<template>
	<div class="container">

		<el-tabs>
			<el-tab-pane :label="`Unread information (${unread_message.length})`" name="first">
				<el-table :data="unread_message" :show-header="false" style="width: 100%">
					<el-table-column>
						<template #default="scope">
              <el-link class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>
						</template>
					</el-table-column>

          <el-table-column>
            <template #default="scope">
              <div class="truncate-text">
                <el-link>{{truncateText(scope.row.body, 69)}}</el-link>
              </div>

            </template>
          </el-table-column>

					<el-table-column prop="date" width="180"></el-table-column>
					<el-table-column width="120">
						<template #default="scope">
							<el-button size="small" @click="this.toggleRead(scope.row.messageId)">Label as read</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="handle-row">
					<el-button type="primary">Label all as Read</el-button>
				</div>
			</el-tab-pane>

			<el-tab-pane :label="`Read Information (${read_message.length})`" name="second">
<!--				<template>-->
					<el-table :data="read_message" :show-header="false" style="width: 100%">
						<el-table-column>
							<template #default="scope">
								<span class="message-title">{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="date" width="180"></el-table-column>
						<el-table-column width="120">
							<template #default="scope">
								<el-button type="danger">Delete</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger">Delete all</el-button>
					</div>
<!--				</template>-->
			</el-tab-pane>

		</el-tabs>
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
    }



  },

  methods:{
    toggleRead:function (id){
        axios.post("api/messages/read/" + id).then((res) => {
          if (res.data.msg !== "success"){
            console.error("Label as read failed")
          }
          else{
            messageStore.fetchNewMessages();
            messageStore.markMessageAsRead(id);

          }
        })
    },
    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    }

  },

  created() {

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
