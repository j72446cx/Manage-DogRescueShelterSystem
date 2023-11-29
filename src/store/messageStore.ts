import {onUnmounted, reactive, readonly} from "vue";
import axios from "axios";

interface Message {
    messageId: number;
    senderId: number;
    receiverId: number;
    type: string;
    title: string;
    body: string;
    date: Date;
    status: number;
}

interface State {
    messages: Message[];
    read_messages: Message[];
    hasNewMessage: boolean;
}

const state = reactive<State>({
    messages: [],
    read_messages: [],
    hasNewMessage: false
});

const addMessage = (message: Message) => {
    state.messages.push(message);
    state.hasNewMessage = true;
};

const addReadMessage = (message: Message) => {
    state.read_messages.push(message);
}

const resetNewMessageFlag = () => {
    state.hasNewMessage = false;
};

let webSocket : WebSocket | null = null;

const initWebSocket = (token:string) => {
    webSocket = new WebSocket(`ws://localhost:1010/webSocket/${token}`);

    webSocket.onopen = () => {
        console.log("Websocket is opened");
        fetchNewMessages();
        console.log("onopen, detected unread info: ", state.hasNewMessage)
    }


    webSocket.onmessage = (event) => {
        state.hasNewMessage = true;
        fetchNewMessages();
        console.log("state.hasNewMsg: " + state.hasNewMessage);
        console.log("Unread info: " + state.messages);
        console.log("Read info: " + state.read_messages);

    };

    webSocket.onclose = () => {
        console.log("Websocket closed");
    };

    webSocket.onerror = (error) => {
        console.error("Websocket error: " + error);
    };
}

const fetchNewMessages = () => {

    axios.get('/api/messages', {params: {receiverId: localStorage.getItem("ms_id")}})
        .then(response => {

            response.data.data.rows.forEach((newMessage: Message) => {
                if (!state.messages.some(message => message.messageId === newMessage.messageId)) {
                    if (newMessage.status === 0){
                        addMessage(newMessage);
                    }
                }

                if (!state.read_messages.some(message => message.messageId === newMessage.messageId)){
                    if (newMessage.status === 1){
                        addReadMessage(newMessage)
                    }
                }

            });

        })
        .catch(error => {
            console.error("Error when getting information:", error);
        });

};

const markMessageAsRead = (messageId:number) => {
    // 找到对应的消息并更新状态
    const messageIndex = state.messages.findIndex(message => message.messageId === messageId);
    if (messageIndex !== -1) {
        state.messages.splice(messageIndex, 1); // 从未读列表中移除
    }
};

const disconnectWebSocket = () => {
    if (webSocket) {
        webSocket.close();
        webSocket = null;
    }
}

onUnmounted(() => {
    disconnectWebSocket();
})

export default {
    state: readonly(state),
    addMessage,
    resetNewMessageFlag,
    initWebSocket,
    disconnectWebSocket,
    fetchNewMessages,
    markMessageAsRead
};