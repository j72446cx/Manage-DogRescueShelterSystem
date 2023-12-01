<template>
	<div class="container">

		<el-tabs>
			<el-tab-pane :label="`Received (${allMessages.length})`" name="first">

				<el-table :data="allMessages" :show-header="false" style="width: 100%">
					<el-table-column width="300">
						<template #default="scope">
<!--              <el-link @click="this.toggleRead(scope.row.messageId)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>-->
              <el-link @click="this.openMessageDrawer(scope.row)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>
						</template>
					</el-table-column>

          <el-table-column width="450">
            <template #default="scope">
              <div class="truncate-text">
                <el-link @click="this.openMessageDrawer(scope.row)">{{truncateText(scope.row.body, 69)}}</el-link>
              </div>

            </template>
          </el-table-column>

          <el-table-column></el-table-column>
          <el-table-column width="90">
            <template #default="scope">
              <span>{{processDate(scope.row.date)}}</span>

            </template>
          </el-table-column>


          <el-table-column width="300">
            <template #default="scope">
              <span>By: {{scope.row.senderName}}</span>
            </template>
          </el-table-column>

          <el-table-column width="50">
            <template #default="scope">
              <el-icon v-if="scope.row.status===0"><ChatDotSquare /></el-icon>
            </template>
          </el-table-column>

				</el-table>
			</el-tab-pane>





      <el-tab-pane :label="`Sent (${sentMessages.length})`" name="second">

        <el-table :data="sentMessages" :show-header="false" style="width: 100%">
          <el-table-column width="300">
            <template #default="scope">
              <!--              <el-link @click="this.toggleRead(scope.row.messageId)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>-->
              <el-link @click="this.openMessageDrawer(scope.row)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>
            </template>
          </el-table-column>

          <el-table-column width="450">
            <template #default="scope">
              <div class="truncate-text">
                <el-link @click="this.openMessageDrawer(scope.row)">{{truncateText(scope.row.body, 69)}}</el-link>
              </div>

            </template>
          </el-table-column>

          <el-table-column></el-table-column>
          <el-table-column width="90">
            <template #default="scope">
              <span>{{processDate(scope.row.date)}}</span>

            </template>
          </el-table-column>


          <el-table-column width="300">
            <template #default="scope">
              <span>To: {{scope.row.receiverName}}</span>
            </template>
          </el-table-column>


        </el-table>
      </el-tab-pane>








			<el-tab-pane :label="`New`" name="third">
        <el-form ref="form" :model="infoForm" label-width="100px" :rules="rules">
          <br>
          <el-form-item label="To: " prop="receiverId">
            <el-autocomplete
                v-model="infoForm.receiverId"
                :fetch-suggestions="querySearch"
                placeholder="Type to search"
                @select="handleSelect"
                :clearable="true"
            >
            </el-autocomplete>

          </el-form-item>

          <el-form-item label="Title: ">
            <el-input v-model="infoForm.title" :autosize="{ minRows: 1, maxRows: 3 }"></el-input>
          </el-form-item>

          <el-form-item label="Content: ">
            <el-input type="textarea" v-model="infoForm.body" :autosize="{ minRows: 4, maxRows: 10 }"></el-input>

          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" @click="onSubmitAdd" >Submit</el-button>
          </el-form-item>

        </el-form>
			</el-tab-pane>

		</el-tabs>

    <el-drawer title="Message Details: " v-model="drawer">
      <div v-if="selectedMessage">
        <p style="font-size: 14px; color: #aaa;">From: {{ selectedMessage.senderName }}</p>
        <p style="font-size: 14px; color: #aaa;">{{convertDateFormat(selectedMessage.date)}}</p>
        <br>
        <h3>{{ selectedMessage.title }}</h3>
        <el-divider></el-divider>
        <br>
        <p>{{ selectedMessage.body }}</p>

      </div>
    </el-drawer>


	</div>
</template>


<script>
import messageStore from "../store/messageStore.ts";
import axios from "axios";

export default {
  data(){
    return{
      unread_message : messageStore.state.messages,
      read_message : messageStore.state.read_messages,
      hasNewMessage : messageStore.state.hasNewMessage,
      allMessages : messageStore.state.all_messages,
      sentMessages: messageStore.state.sent_messages,

      drawer: false,
      selectedMessage: null,
      infoForm: {
          receiverId: '',
          senderId: localStorage.getItem("ms_id"),
          type: "sendToOne",
          date: new Date(),
          title: '',
          body: '',
          status: 0,
      },

      selectedStaff : '',

      all_staff: [],

      rules : {
        receiverId: [
          {required: true, message: 'Please select the staff member', trigger:'blur'},
          {validator: (rule, value, callback) => {
              if (value === '' || isNaN(Number(value))) {
                callback(new Error('Receiver ID must be a number'));
              } else {
                callback();
              }
            },
            trigger: 'blur'}
        ]
      }


    }

  },

  methods:{
    openMessageDrawer(message) {
      this.selectedMessage = message;
      this.drawer = true;

      axios.post("api/messages/read/" + message.messageId).then((res) => {
        if (res.data.msg !== "success"){
          console.error("Label as read failed")
        }
        else{
          messageStore.fetchNewMessages();
          messageStore.markMessageAsRead(message.messageId);

        }
      })

    },

    onSubmitAdd(){
      this.$refs.form.validate((valid) =>{
        if (valid){
          messageStore.sendMessageWebsocket(this.infoForm);
          messageStore.fetchSentMessages();

          ElNotification({
            title: 'Success',
            message: 'Sending message successfully',
            type: 'success',
          })
        }
        else {
          ElNotification({
            title: 'Error',
            message: 'Failed in sending messages. This is may due to the non-exist of Staff id',
            type: 'error',
          })
          return false;
        }
          }

      )
    },

    getAllStaff(){
      axios.get("api/staffpage", {params: {pageSize:10000}})
        .then((res) =>
            {this.all_staff = res.data.data.rows.map(staff => ({
              value: staff.firstName + ' ' + staff.lastName,
              id: staff.id
            }))})
    },

    convertDateFormat:function (inputDate){
      const date = new Date(inputDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从 0 开始的
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    },

    processDate:function (inputDate){
      const date = new Date(inputDate);
      const now = new Date();

      const dateYear = date.getFullYear();
      const dateMonth = date.getMonth();
      const dateDay = date.getDate();

      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth();
      const nowDay = now.getDate();

      if (dateYear === nowYear && dateMonth === nowMonth && dateDay === nowDay) {
        return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
      }

      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (dateYear === yesterday.getFullYear() && dateMonth === yesterday.getMonth() && dateDay === yesterday.getDate()) {
        return 'Yesterday';
      }

      return dateDay.toString().padStart(2, '0') + '/' + (dateMonth + 1).toString().padStart(2, '0') + '/' + dateYear;

    },

    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    },

    querySearch :function (queryString, cb){
      const results = queryString
          ? this.all_staff.filter(this.createFilter(queryString))
          : this.all_staff
      cb(results)
    },

    createFilter :function (queryString) {
      return (staff) => {
        return (
            staff.value.toLowerCase().includes(queryString.toLowerCase())
        )
      }
    },

    handleSelect(item) {

      this.infoForm.receiverId = item.id;
      this.selectedStaff = item.value;

    }

  },

  mounted() {
    this.getAllStaff();

  }

}




</script>





<style>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}

.el-link {
  margin-right: 8px;
}
.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}

.large-bold-text {
  font-size: 15px;
  font-weight: 900;

}

</style>
