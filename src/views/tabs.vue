<template>
	<div class="container">

		<el-tabs v-model="activeTabs">
			<el-tab-pane :label="`Received (${allMessages.length})`" name="first">

				<el-table :data="allMessages" :show-header="true" style="width: 100%">
					<el-table-column width="300" label="Title">
						<template #default="scope">
<!--              <el-link @click="this.toggleRead(scope.row.messageId)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>-->
              <el-link @click="this.openMessageDrawer(scope.row)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>
						</template>
					</el-table-column>

          <el-table-column width="450" label="Content">
            <template #default="scope">
              <div class="truncate-text">
                <el-link @click="this.openMessageDrawer(scope.row)">{{truncateText(scope.row.body, 69)}}</el-link>
              </div>

            </template>
          </el-table-column>

          <el-table-column></el-table-column>
          <el-table-column width="120" label="Date">
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





      <el-tab-pane :label="`Sent To Staff (${sentMessages.length})`" name="second">

        <el-table :data="sentMessages" :show-header="true" style="width: 100%">
          <el-table-column width="300" label="Title">
            <template #default="scope">
              <!--              <el-link @click="this.toggleRead(scope.row.messageId)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>-->
              <el-link @click="this.openMessageDrawer(scope.row)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>
            </template>
          </el-table-column>

          <el-table-column width="450" label="Content">
            <template #default="scope">
              <div class="truncate-text">
                <el-link @click="this.openMessageDrawer(scope.row)">{{truncateText(scope.row.body, 69)}}</el-link>
              </div>

            </template>
          </el-table-column>

          <el-table-column></el-table-column>
          <el-table-column width="120" label="Date">
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


      <el-tab-pane :label="`Sent To Adopter (${sentUserMessages.length})`" name="five">

        <el-table :data="sentUserMessages" :show-header="true" style="width: 100%">
          <el-table-column width="300" label="Title">
            <template #default="scope">
              <!--              <el-link @click="this.toggleRead(scope.row.messageId)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>-->
              <el-link @click="this.openMessageDrawer(scope.row)" class="large-bold-text">{{truncateText(scope.row.title, 69)}}</el-link>
            </template>
          </el-table-column>

          <el-table-column width="450" label="Content">
            <template #default="scope">
              <div class="truncate-text">
                <el-link @click="this.openMessageDrawer(scope.row)">{{truncateText(scope.row.body, 69)}}</el-link>
              </div>

            </template>
          </el-table-column>

          <el-table-column></el-table-column>
          <el-table-column width="120" label="Date">
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








			<el-tab-pane :label="`New message to Staff`" name="third">
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

      <el-tab-pane :label="`New message to User`" name="fourth">
        <el-form ref="form" :model="sendToUserForm" label-width="100px" :rules="rulesUser">
          <br>
          <el-form-item label="To: " prop="receiverId">
            <el-input v-model="sendToUserForm.receiverId" style="width: 150px"></el-input>
          </el-form-item>

          <el-form-item label="Title: ">
            <el-input v-model="sendToUserForm.title" :autosize="{ minRows: 1, maxRows: 3 }"></el-input>
          </el-form-item>

          <el-form-item label="Content: ">
            <el-input type="textarea" v-model="sendToUserForm.body" :autosize="{ minRows: 4, maxRows: 10 }"></el-input>

          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" @click="onSubmitAddToUser" >Submit</el-button>
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
        <p style="white-space: pre-wrap;">{{ selectedMessage.body }}</p>

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
      sentUserMessages: messageStore.state.sent_user_messages,

      activeTabs: 'first',
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
          receiverRole:"staff"
      },

      sendToUserForm: {
        receiverId: '',
        senderId: localStorage.getItem("ms_id"),
        type: "sendToOne",
        date: new Date(),
        title: '',
        body: '',
        status: 0,
        receiverRole:"user"
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
      },

      rulesUser : {
        receiverId: [
          {required: true, message: 'Please input the user ID', trigger:'blur'},
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

  watch: {
    '$route.query.tab'(newTab){
      if (newTab === 'fourth'){
        this.activeTabs = "fourth"
      }
    },

    '$route.query.userId'(userId){
      this.sendToUserForm.receiverId = userId;
      this.sendToUserForm.title = "Request of changing interview time";
    }
  },

  methods:{
    resetInfoForm(){
      this.infoForm = {
        receiverId: '',
        senderId: localStorage.getItem("ms_id"),
        type: "sendToOne",
        date: new Date(),
        title: '',
        body: '',
        status: 0,
        receiverRole:"staff"
      }
    },

    resetSendToUserForm(){
      this.sendToUserForm = {
        receiverId: '',
        senderId: localStorage.getItem("ms_id"),
        type: "sendToOne",
        date: new Date(),
        title: '',
        body: '',
        status: 0,
        receiverRole:"user"
      }
    },

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

    async onSubmitAdd(){
      this.$refs.form.validate(async (valid) => {
            if (valid) {
              await messageStore.sendMessageWebsocket(this.infoForm);
              await messageStore.fetchSentMessages();

              ElNotification({
                title: 'Success',
                message: 'Sending message successfully',
                type: 'success',
              })

              this.resetInfoForm();
            } else {
              ElNotification({
                title: 'Error',
                message: 'Failed in sending messages. This is may due to the non-exist of Staff id',
                type: 'error',
              })
              return false;
            }

            // this.resetInfoForm();
          }

      )
    },

    async onSubmitAddToUser(){

      this.$refs.form.validate(async (valid) => {
            if (valid) {
              await messageStore.sendMessageWebsocket(this.sendToUserForm);
              await messageStore.fetchSentMessagesUser();

              ElNotification({
                title: 'Success',
                message: 'Sending message successfully',
                type: 'success',
              })
              this.resetSendToUserForm();
            } else {
              ElNotification({
                title: 'Error',
                message: 'Failed in sending messages. This is may due to the non-exist of User id',
                type: 'error',
              })
              return false;
            }
          }
      )

      // this.resetSendToUserForm();


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

    const tab = this.$route.query.tab;
    if (tab) {
      this.activeTabs = tab;
    }

    const userId = this.$route.query.userId;
    if (userId){
      this.sendToUserForm.receiverId = userId;
    }

    const all_detail = this.$route.query.all_detail ? JSON.parse(this.$route.query.all_detail) : null
    if (all_detail){
      this.sendToUserForm.body = "Dear " + all_detail.adopter_name + ",\n\n" + "    Thanks for your application in our shelter system. Concerning the application with id: "
      + all_detail.application_id + " to the dog with id: " + all_detail.dog_id + ", the interview date you proposed: " + all_detail.interview_date + " is not available due to some reasons. " +
          "\n\n<<<<<<<<<< Add your Explanation and Solution >>>>>>>>>>>>\n\n" +
          "    We felt very sorry for the inconvenient.\n\n" + "Sincerely,\n" + "Dog Rescue Shelter Team";
      this.sendToUserForm.title = "Proposed Interview Schedule is not available"
    }

    const all_detail_hurry = this.$route.query.all_detail_hurry ? JSON.parse(this.$route.query.all_detail_hurry) : null
    if (all_detail_hurry){
      this.sendToUserForm.body = "Dear " + all_detail_hurry.adopter_name + ",\n\n" + "    Thanks for your application in our shelter system. Regarding the application with id: "
      + all_detail_hurry.application_id + " to the dog with id: " + all_detail_hurry.dog_id + ", we saw that you have not yet decide an interview date. In order to get in touch with your dog earlier, "
      + "please decide this as soon as possible." + "\n\nThanks for your cooperation, \n" + "Dog Rescue Shelter Team";

      this.sendToUserForm.title = "Deciding the Interview Date"
    }

    const all_detail_reject = this.$route.query.all_detail_reject ? JSON.parse(this.$route.query.all_detail_reject): null
    if (all_detail_reject){
      this.sendToUserForm.body = "Dear " + all_detail_reject.adopter_name + ",\n\n" + "    Thanks for your application in our shelter system." + "\n" + "    Regarding the application with id: "
          + all_detail_reject.application_id + " to the dog with id: " + all_detail_reject.dog_id  + "\n\n" +
          "<---------------- Add your detailed reason of why reject this application ---------------->" + "\n\n    We felt sorry about this. \n" + "\nBest wishes,\n"+"Dog Rescue Shelter Team";

      this.sendToUserForm.title = "Application denied"
    }

    const all_detail_remind = this.$route.query.all_detail_remind ? JSON.parse(this.$route.query.all_detail_remind) : null
    if (all_detail_remind){
      this.sendToUserForm.body = "Dear " + all_detail_remind.adopter_name + ",\n\n" + "    We are thrilled to extend our heartiest congratulations to you on being selected as the forever home for "+ all_detail_remind.dog_name + "! \n    After careful consideration and witnessing the remarkable connection between you two, it's clear that you are the perfect match for each other.\n" +
          "    Adopting a dog is a journey filled with love, challenges, and unforgettable moments, and we are confident that "+all_detail_remind.dog_name+" has found not just a home but a family with you. The bond you've already begun to form is the foundation of a lifelong companionship, and it's this unique connection that truly stood out to us during the adoption process.\n" +
          "    We believe that "+all_detail_remind.dog_name+" is not just a pet, but a companion who will bring joy, laughter, and comfort into your life. As you embark on this exciting new chapter together, remember that the bond you share is a precious gift, nurtured by patience, understanding, and a lot of love.\n"+
          "    Please know that we are here for you and "+all_detail_remind.dog_name+", ready to support you both through this transition and beyond. We encourage you to keep us updated on your adventures together and look forward to hearing about the wonderful moments you will undoubtedly share.\n"+
          "\nWarmest regards,\n" + "Dog Shelter Team"

      this.sendToUserForm.title = "Congratulations on Your New Furry Family Member!"
    }


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

.pre-wrap {
  white-space: pre-wrap;
}

</style>
