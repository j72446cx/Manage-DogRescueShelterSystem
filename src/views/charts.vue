<template>
  <div class="container">

    <el-tabs>
      <el-tab-pane :label="`Pending (${applicationPending.length})`" name="first">

        <el-table :data="applicationPending" :show-header="true" style="width: 100%">
          <el-table-column prop="id" label="Application ID"></el-table-column>
          <el-table-column prop="adopter_id" label="Adopter ID"></el-table-column>
          <el-table-column prop="dog_id" label="Dog ID"></el-table-column>
          <el-table-column label="Created Date" width="300">
            <template v-slot="scope">
              <span>{{transofmDateFormat(scope.row.created_date, 1)}}</span>

            </template>
          </el-table-column>
          <el-table-column label="Operation">
            <template v-slot="scope">
              <el-button type="primary" @click="startReviewing(scope.row.id)" plain>Start Reviewing</el-button>
            </template>
          </el-table-column>


        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`Reviewing (${applicationReviewing.length})`" name="second">

        <el-table :data="applicationReviewing" :show-header="true" style="width: 100%">
          <el-table-column prop="id" label="Application ID"></el-table-column>
          <el-table-column prop="adopter_id" label="Adopter ID"></el-table-column>
          <el-table-column prop="dog_id" label="Dog ID"></el-table-column>
          <el-table-column label="Application Details">
            <template v-slot="scope">
              <el-button type="text" @click="downloadPDF(scope.row.pdfURL)">

                <el-icon><Download /></el-icon>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="Writing comment for Application Details" width="400px">
            <template v-slot="scope">
              <el-button type="text" @click="getReviewingForm(scope.row)">Click to start or continue</el-button>
            </template>

          </el-table-column>

          <el-table-column label="Operation" width="200px">
            <template v-slot="scope">
              <el-button @click="onAccept(scope.row)" type="success" round>Approve</el-button>
              <el-button @click="onReject(scope.row)" type="danger" round>Reject</el-button>
            </template>
          </el-table-column>


        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`Approved (${applicationApproved.length})`" name="third">

        <el-table :data="applicationApproved" :show-header="true" style="width: 100%">
          <el-table-column prop="id" label="Application ID"></el-table-column>
          <el-table-column prop="adopter_id" label="Adopter ID"></el-table-column>
          <el-table-column prop="dog_id" label="Dog ID"></el-table-column>
          <el-table-column label="Interview Date proposed by adopter" width="300">
            <template v-slot="scope">
              <span>{{transofmDateFormat(scope.row.interview_date, 1)}}</span>
            </template>
          </el-table-column>


          <el-table-column label="Operation on interview date" width="400">
            <template v-slot="scope">
              <el-button type="primary" v-if="scope.row.interview_date !== null" @click="onAcceptApproved(scope.row)">Accept</el-button>
              <el-button type="danger" v-if="scope.row.interview_date !== null" @click="sendMessageToUser(scope.row.adopter_id, scope.row.id, scope.row.dog_id, scope.row.interview_date)">Reject and send message to the adopter</el-button>

              <el-button type="info" v-if="scope.row.interview_date === null" @click="hurryUp(scope.row.adopter_id, scope.row.id, scope.row.dog_id)">Send message to hurry him/her up</el-button>
              <el-button type="danger" v-if="scope.row.interview_date === null" @click="onReject(scope.row)">Reject</el-button>
            </template>
          </el-table-column>


        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`Interviewing (${applicationInterviewing.length})`" name="fourth">

        <el-table :data="applicationInterviewing" :show-header="true" style="width: 100%">
          <el-table-column prop="id" label="Application ID"></el-table-column>
          <el-table-column prop="adopter_id" label="Adopter ID"></el-table-column>
          <el-table-column prop="dog_id" label="Dog ID"></el-table-column>
          <el-table-column label="Interview Date" width="300">
            <template v-slot="scope">
              <span>{{transofmDateFormat(scope.row.interview_date, 1)}}</span>
            </template>
          </el-table-column>

          <el-table-column label="Interview Result" width="200px">
              <template v-slot="scope">

                <el-button type="text" v-if="getInterviewStatus(scope.row.interview_date)" @click="onclickInterview(scope.row)">Click to write/modify notes</el-button>
                <span v-else>Waiting for the Interview</span>

              </template>
          </el-table-column>

          <el-table-column label="Application Details">
            <template v-slot="scope">
              <el-button type="text" @click="downloadPDF(scope.row.pdfURL)">

                <el-icon><Download /></el-icon>
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="Operation" width="400px">
            <template v-slot="scope">
              <el-button type="primary" v-if="scope.row.haveCompetitor === false">Pass</el-button>
              <el-button type="primary" v-if="scope.row.haveCompetitor === true && this.compareResult[scope.row.dog_id] === true" @click="pass_and_reject(scope.row)">Pass and Reject other competitors</el-button>
              <el-button type="info" v-if="scope.row.haveCompetitor === true && this.compareResult[scope.row.dog_id] === false">Waiting for competitor</el-button>
              <el-button type="danger" @click="onReject(scope.row)">Reject</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`Adoption Pending (${applicationAdoptionPending.length})`" name="fifth">

        <el-table :data="applicationAdoptionPending" :show-header="true" style="width: 100%">
          <el-table-column prop="id" label="Application ID"></el-table-column>
          <el-table-column prop="adopter_id" label="Adopter ID"></el-table-column>
          <el-table-column prop="dog_id" label="Dog ID"></el-table-column>

          <el-table-column label="Contact information">
            <template v-slot="scope">
              <el-icon @click="contact_info_pre(scope.row.adopter_id)"><List /></el-icon>
            </template>
          </el-table-column>

          <el-table-column width="300px" label="Send message">
            <template v-slot="scope">
              <el-button type="text" @click="sendRemind(scope.row.adopter_id, scope.row.id, scope.row.dog_id)">Send Message to remind the adopter</el-button>
            </template>
          </el-table-column>

          <el-table-column label="Collection confirmation">
            <template v-slot="scope">
              <el-icon color="green" size="30px" @click="collection_confirm(scope.row)" style="margin-right: 40px;"><SuccessFilled /></el-icon>
              <el-icon color="red" size="30px"><CircleCloseFilled /></el-icon>

            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>

    </el-tabs>











    <el-dialog title="Reviewing Form" v-model="dialog_reviewing_visible">

      <el-form label-width="250px">
        <el-form-item label="Application ID: ">{{temp_review_info.application_id}}</el-form-item>
        <el-form-item label="Adopter ID: ">{{temp_review_info.adopter_id}}</el-form-item>
        <el-form-item label="Dog ID: ">{{temp_review_info.dog_id}}</el-form-item>
      </el-form>

      <el-form :model="reviewing_form" label-width="250px">
        <el-form-item label="Customer Information section: ">
          <el-input type="textarea" v-model="reviewing_form.customer_info_notes"></el-input>
        </el-form-item>
        <el-form-item label="Form Information section: ">
          <el-input type="textarea" v-model="reviewing_form.form_info_notes"></el-input>
        </el-form-item>
        <el-form-item label="Family Member section: ">
          <el-input type="textarea" v-model="reviewing_form.family_member_notes"></el-input>
        </el-form-item>
        <el-form-item label="Residence Information section: ">
          <el-input type="textarea" v-model="reviewing_form.residence_info_notes"></el-input>
        </el-form-item>
        <el-form-item label="Personal Background section: ">
          <el-input type="textarea" v-model="reviewing_form.personal_background_notes"></el-input>
        </el-form-item>
        <el-form-item label="Dog Care section: ">
          <el-input type="textarea" v-model="reviewing_form.dog_care_notes"></el-input>
        </el-form-item>
        <el-form-item label="Summary: ">
          <el-input type="textarea" v-model="reviewing_form.overall_notes"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="dialog_reviewing_visible = false">Cancel</el-button>
          <el-button type="primary" @click="saveReviewingForm">Save</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog title="Approve Confirmation" v-model="dialog_accept_visible">
      <span>Please make sure all application details have been investigated and commented.</span>
      <br><br><br>
      <el-button type="primary" @click="acceptConfirm(this.temp_object)">Yes I confirm and submit</el-button>
      <el-button type="info" @click="this.dialog_reject_visible = false">Cancel</el-button>

    </el-dialog>

    <el-dialog title="Approve Confirmation" v-model="dialog_accept_approved_visible">
      <span>Are you sure you want to accpet this interview date?</span>
      <br><br><br>
      <el-button type="primary" @click="acceptConfirmApproved(this.temp_object)">Yes I confirm and submit</el-button>
      <el-button type="info" @click="this.dialog_accept_approved_visible = false">Cancel</el-button>

    </el-dialog>

    <el-dialog title="Reject Confirmation" v-model="dialog_reject_visible">
      <span style="word-break: keep-all;">Please make sure all application details have been investigated and commented.</span>
      <br><br><br>

      <el-input v-model="reject_reason" type="textarea" placeholder="Please fill in the reasons for rejection"></el-input>
      <br><br><br>

      <el-button type="primary" @click="rejectConfirm(this.temp_object, this.reject_reason)">Yes I confirm and submit</el-button>
      <el-button type="info" @click="this.dialog_reject_visible = false">Cancel</el-button>

    </el-dialog>

    <el-dialog title="Interview Result" v-model="dialog_interview_visible">
      <el-form label-width="250px" v-if="this.step_interview === 0">
        <el-form-item label="Application ID: ">{{temp_review_info.application_id}}</el-form-item>
        <el-form-item label="Adopter ID: ">{{temp_review_info.adopter_id}}</el-form-item>
        <el-form-item label="Dog ID: ">{{temp_review_info.dog_id}}</el-form-item>
      </el-form>

      <el-form :model="interview_form" label-width="400px" v-if="this.step_interview === 1">
        <el-form-item label="Examine on body language of dog and adopter: ">
          <el-input type="textarea" v-model="interview_form.body_language"></el-input>
        </el-form-item>
        <el-form-item label="Examine on play and interaction between dog and adopter: ">
          <el-input type="textarea" v-model="interview_form.play"></el-input>
        </el-form-item>
        <el-form-item type="textarea" label="Examine on dog's response to adopter's instructions: ">
          <el-input type="textarea" v-model="interview_form.response_instruction"></el-input>
        </el-form-item>
      </el-form>

      <el-form :model="interview_form" label-width="400px" v-if="step_interview === 2">
        <el-form-item label="Examine on intimate contact between dog and adopter: ">
          <el-input type="textarea" v-model="interview_form.intimate_contact"></el-input>
        </el-form-item>
        <el-form-item label="Examine on eye contact between dog and adopter: ">
          <el-input type="textarea" v-model="interview_form.eye_contact"></el-input>
        </el-form-item>
        <el-form-item label="Summary: ">
          <el-input type="textarea" v-model="interview_form.summary"></el-input>
        </el-form-item>
      </el-form>
      <br><br>
      <div style="text-align: center">
        <el-button type="info" @click="this.step_interview--" v-if="step_interview > 0" round>Back</el-button>
      <el-button type="primary" @click="this.step_interview++" round v-if="step_interview < 2">Next</el-button>
        <el-button type="success" @click="submitInterviewConform" round v-if="step_interview===2">Submit</el-button>

      </div>
    </el-dialog>

    <el-dialog title="Confirmation" v-model="dialog_interview_pass_reject">
      <span>This process is irreversible, please confirm all the details have been investigated. After doing this, please send messages to the rejected adopters to explain this.</span>
      <br><br><br>
      <div style="text-align: center">
        <el-button type="success" round @click="pass_rejct_confirm">Yes, I confirm and submit</el-button>
        <el-button type="info" @click="dialog_interview_pass_reject=false" round>I need double check</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Contact Info" v-model="dialog_contact_info_visible">
      <el-form title="Contact Info">
        <el-form-item label="Adopter Name: ">{{this.temp_adopter_name}}</el-form-item>
        <el-form-item label="Adopter Email: ">{{this.temp_adopter_email}}</el-form-item>
        <el-form-item label="Adopter Phone Number: ">{{this.temp_adopter_tel}}</el-form-item>


      </el-form>



    </el-dialog>


  </div>
</template>


<script>
import messageStore from "../store/messageStore.ts";
import axios from "axios";
import router from "../router/index.ts";

export default {
  data(){
    return{

      applicationPending: [],
      applicationReviewing: [],
      applicationApproved: [],
      applicationAdoptionPending: [],
      applicationInterviewing: [],
      applicationAdopted: [],

      reviewing_form: [],
      dialog_reviewing_visible: false,
      temp_review_info: {
        application_id: '',
        dog_id: '',
        adopter_id: ''
      },

      dialog_accept_visible: false,
      dialog_reject_visible: false,
      dialog_interview_visible: false,
      dialog_interview_pass_reject: false,
      temp_object : '',
      interview_form: [],

      adopter_name: '',

      dialog_accept_approved_visible: false,
      dialog_contact_info_visible: false,

      step_interview: 0,

      compareResult: [],

      reject_reason: '',


        temp_adopter_name: '',
        temp_adopter_email: '',
        temp_adopter_tel: ''






    }

  },

  methods:{

    getPendingApplication() {
      const params={
        status: "Pending"
      };

      axios.get("api/adopter/application/status", {params:params})
      .then((res) => {

        if (res.data.data !== []){
          this.applicationPending = res.data.data;
          this.applicationPending.sort((a, b) => a.dog_id - b.dog_id);
        }

      }).catch((error) => console.error('Error when fetching data: ', error))
    },

    getReviewingApplication() {
      const params={
        status: "Reviewing"
      };

      axios.get("api/adopter/application/status", {params:params})
          .then((res) => {

            if (res.data.data !== []){

              this.applicationReviewing = res.data.data;
              this.applicationReviewing.sort((a, b) => a.dog_id - b.dog_id);

            }


          }).catch((error) => console.error('Error when fetching data: ', error))
    },

    getApprovedApplication() {
      const params={

        status: "Approved"
      };

      axios.get("api/adopter/application/status", {params:params})
          .then((res) => {

            if (res.data.data !== []){
              this.applicationApproved = res.data.data;
              this.applicationApproved.sort((a, b) => a.dog_id - b.dog_id);
            }


          }).catch((error) => console.error('Error when fetching data: ', error))
    },

    getAdoptionPendingApplication() {
      const params={

        status: "Adoption Pending"
      };

      axios.get("api/adopter/application/status", {params:params})
          .then((res) => {

            if (res.data.data !== []){
              this.applicationAdoptionPending = res.data.data;
              this.applicationAdoptionPending.sort((a, b) => a.dog_id - b.dog_id);
            }


          }).catch((error) => console.error('Error when fetching data: ', error))
    },

    getAdoptedPendingApplication() {
      const params={

        status: "Adopted"
      };

      axios.get("api/adopter/application/status", {params:params})
          .then((res) => {

            if (res.data.data !== []){
              this.applicationAdopted = res.data.data;
              this.applicationAdopted.sort((a, b) => a.dog_id - b.dog_id);
            }


          }).catch((error) => console.error('Error when fetching data: ', error))
    },

    getAwaitInterviewApplication() {
      const params={

        status: "Await"
      };

      axios.get("api/adopter/application/status", {params:params})
          .then((res) => {

            if (res.data.data !== []){
              this.applicationInterviewing = res.data.data;
              this.applicationInterviewing.sort((a, b) => a.dog_id - b.dog_id);
            }

            for (let i = 0; i < this.applicationInterviewing.length; i++) {
              this.check_compare(this.applicationInterviewing[i].dog_id);
            }





          }).catch((error) => console.error('Error when fetching data: ', error))
    },

    transofmDateFormat: function (inputDate, showTime=0) {

      if (inputDate === null){
        return "To be confirmed";
      }


      // Ensure inputDate is a valid date string
      const date = new Date(inputDate);

      // Get date and time components
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      // Format the date and time components
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = `${hours}:${minutes}`;

      // Combine the formatted date and time
      if (showTime === 0){
        return `${formattedDate}`;
      }
      return `${formattedDate}  ${formattedTime}`;
    },

    downloadPDF(url){
      if(url){
        window.location.href = url;
      }else{
        console.log("Invalid url");
      }
    },

    startReviewing(id){
      const params={
        id: id,
        status: "Reviewing"
      };

      const reviewingForm = {
        application_id : id
      }

      axios.put("api/adopter/application/editForm", params).then((res) => {
        if (res.data.msg === "success"){
          console.log("Successfully start reviewing");
        }
        else{
          console.error("Error when start reviewing");
        }
      }).then(() =>{
        this.getPendingApplication();
      }).then(() => {
        this.getReviewingApplication();
      }).then(() => {
        axios.post("api/reviewing/save", reviewingForm).then((res) => {
          if (res.data.msg === "success"){
            console.log("Created new reviewing form");
          }
          else{
            console.error("Error when creating a new reviewing form");
          }
        }).catch((err) => console.log("Error appeared when posting new reviewing form : ", err));
      })
          .catch((err) => {
        console.log("Error reviewing: ", err);
      });



    },

    getReviewingForm(row){
        const param={
          application_id: row.id
        }

        axios.get("api/reviewing", {params:param}).then((res) => {
          if (res.data.data !== []){
            this.reviewing_form = res.data.data[0];
            this.reviewing_form.staff_id = localStorage.getItem("ms_id");
            this.temp_review_info.adopter_id = row.adopter_id;
            this.temp_review_info.application_id = row.id;
            this.temp_review_info.dog_id = row.dog_id;


          }
        }).then(() => {
          this.dialog_reviewing_visible = true;
        })
            .catch((err) => console.log("Error when getting reviewing form: ", err));


    },

    saveReviewingForm(){
      axios.put("api/reviewing/edit", this.reviewing_form).then((res) => {
        if (res.data.msg === "success"){
          console.log("Saving reviewing form successfully!");
          this.$message({
            message: 'Saved Successfully',
            type: 'success'
          })
          this.dialog_reviewing_visible = false
        }
      }).catch((err) => console.log("Error appear when saving reviewing form: ", err));
    },

    onAccept(row){
      this.dialog_accept_visible = true;
      this.temp_object = row;
    },

    onReject(row){
      this.dialog_reject_visible = true;
      this.temp_object = row;
    },

    onAcceptApproved(row){
      this.dialog_accept_approved_visible = true;
      this.temp_object= row;
    },

    onclickInterview(row){
      this.temp_review_info.dog_id = row.dog_id;
      this.temp_review_info.adopter_id = row.adopter_id;
      this.temp_review_info.application_id = row.id;
      axios.get("api/interview", {params: {application_id: row.id}}).then((res) => {
        this.interview_form = res.data.data[0];
        this.dialog_interview_visible = true;
      })

    },

    rejectConfirm(row,reason){

      if (!this.reject_reason.trim()) {
        this.$message.error('Please fill in the reasons for rejection.');
        return;
      }

      let payload= {...row};
      delete payload.created_date;
      payload.status="Rejected";
      payload.reject_reason = reason;
      axios.put("api/adopter/application/editForm", payload).then((res) => {
        if(res.data.msg === "success"){
          console.log("Rejected successfully");
          this.$message({
            message: "Rejected successfully",
            type:"success"
          });
          this.dialog_reject_visible = false;
          this.getReviewingApplication();
          this.getAwaitInterviewApplication();
          this.getApprovedApplication();
        }
      }).catch((err) => {
        console.log("Error when rejecting: ", err);
      }).then(() => {
        console.log(payload)
        this.sendRejectReasonToUser(payload.adopter_id, payload.id, payload.dog_id);
      })
    },

    acceptConfirm(row){

      let payload = {...row};

      delete payload.created_date;
      payload.status = "Approved";
      axios.put("api/adopter/application/editForm", payload).then((res) => {
        if(res.data.msg === "success"){
          console.log("Approved successfully");
          this.$message({
            message: "Approved successfully",
            type:"success"
          });
          this.dialog_accept_visible = false;

        }
      }).then(() =>{
            this.getReviewingApplication();
            this.getApprovedApplication();
      }
          )
          .catch((err) => {
        console.log("Error when approving: ", err);
      })
    },

    acceptConfirmApproved(row){

      let payload = {...row};
      delete payload.created_date;
      payload.status = "Await";
      axios.put("api/adopter/application/editForm", payload).then((res) => {
        if(res.data.msg === "success"){
          console.log("Accept successfully");
          this.$message({
            message: "Accept successfully",
            type:"success"
          });
          this.dialog_accept_approved_visible = false;
        }
        else{
          console.log("Accept failed");
          this.$message.error("Failed in accept, please contact IT service")
        }
      }).then(() => {
            this.getApprovedApplication();
            this.getAwaitInterviewApplication();
      }

          ).then(() => {
        axios.post("api/interview/save", {application_id: payload.id})
      })
          .catch((err) => {
        console.log("Error when approving: ", err);
      })
    },

    submitInterviewConform(){
      this.interview_form.staff_id = localStorage.getItem("ms_id");
      axios.put("api/interview/edit", this.interview_form).then((res) => {
        if (res.data.msg === "success"){
          console.log("Submit interview successfully");
          this.$message({
            message: "Submit successfully",
            type:"success"
          });
          this.dialog_interview_visible = false;
          this.step_interview = 0;
        }
        else{
          this.$message.error("Failed in submitting interview, please contact IT service")
          this.dialog_interview_visible = false;
          this.step_interview = 0;
        }
      }).then(() => this.getAwaitInterviewApplication()).catch((err) => console.log("Error when submitting interview form: ", err));
    },

    sendMessageToUser(adopter_id, application_id, dog_id, interview_date){

      axios.get("api/customer/"+ adopter_id).then((res) => {
        let adopter_name = res.data.data.firstName;

        const all_detail = JSON.stringify({
          application_id, dog_id, interview_date, adopter_name
        });

        this.$router.push({ path: '/tabs', query: { tab: 'fourth', all_detail, userId: adopter_id } })

      }).then(() => {
          axios.put("api/adopter/application/editForm", {id: application_id, interview_date: null}).catch((err) => {
            console.log("Error appear when editing form: ", err);
          })
      })

          .catch((err) => console.log("error when fetching name: ", err));

    },

    sendRejectReasonToUser(adopter_id, application_id, dog_id){
      console.log("application_id is: ", application_id)
      axios.get("api/customer/" + adopter_id).then((res) => {
        let adopter_name = res.data.data.firstName;
        const all_detail_reject = JSON.stringify({
          application_id, dog_id, adopter_name
        });
        this.$router.push({path: '/tabs', query: {tab: 'fourth', all_detail_reject, userId: adopter_id}})
      }).catch((err) => {
        console.log("Error when sending reject reason to user: ", err);
      })
    },

    hurryUp(adopter_id, application_id, dog_id){

      axios.get("api/customer/"+ adopter_id).then((res) => {
        let adopter_name = res.data.data.firstName;

        const all_detail_hurry = JSON.stringify({
          application_id, dog_id, adopter_name
        });

        this.$router.push({ path: '/tabs', query: { tab: 'fourth', all_detail_hurry, userId: adopter_id } })

      })

          .catch((err) => console.log("error when fetching name: ", err))


    },



    async sendRemind(adopter_id, application_id, dog_id){
      try{
        const res = await axios.get(`api/customer/${adopter_id}`);
        let adopter_name = res.data.data.firstName;

        const secondRes = await axios.get(`api/dogpage/${dog_id}`);
        let dog_name = secondRes.data.data.name;

        const all_detail_remind = JSON.stringify({
          application_id, dog_id, adopter_name, dog_name
        });

        this.$router.push({ path: '/tabs', query: { tab: 'fourth', all_detail_remind, userId: adopter_id } })


      }catch (err){
        console.log("error when fetching data", err);
      }
    },

    getInterviewStatus(time){
      const inputTime = new Date(time);
      // Get the current time
      const currentTime = new Date();

      // Compare the input time with the current time
      return inputTime <= currentTime;
    },

    check_compare: async function(dog_id){
      try{


        const res = await axios.get("api/adopter/application/byDog/"+ dog_id);
        let result = true;
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].status !== "Await" || res.data.data[i].interview_date === null || new Date(res.data.data[i].interview_date ) > new Date()){
            console.log("false: ", dog_id);
            result = false;
            break;
          }
        }
        this.compareResult[dog_id] = result;
    } catch (err) {
        console.log("Error when fetching data: ", err);
      }
    },

    pass_and_reject(row){
      this.dialog_interview_pass_reject = true;
      this.temp_object = row;
    },

    pass_rejct_confirm(){
      let payload = {...this.temp_object};
      delete payload.created_date;
      payload.status = "Adoption Pending"
      const temp_id = payload.id;
      const temp_dog_id = payload.dog_id;
      axios.put("api/adopter/application/editForm", payload).then((res) => {
        if (res.data.msg === "success"){
          console.log("Passed successfully");
          this.$message({
            message: "Submit successfully",
            type:"success"
          });
          this.dialog_interview_pass_reject = false;
        }
        else{
          console.log("Pass failed")
          this.$message.error("Failed in submitting, please contact IT service");
          this.dialog_interview_pass_reject = false;
        }
      }).then(() => {
        let payload_2 = this.applicationInterviewing.filter(item => !(item.id === payload.id || item.dog_id !== temp_dog_id))
        .map(item => ({...item, status:"Rejected"}));

        let update_promise = payload_2.map(item => {
          return axios.put("api/adopter/application/editForm", item);
        });

        Promise.all(update_promise).then((res) => {

            console.log("Successfully reject other competitors");
            this.$message({
              message: "Reject other competitors successfully",
              type: "success"
            })

        }).then(() => {
          this.getAwaitInterviewApplication();
          this.getAdoptionPendingApplication();

        }).then(() => {
          let dog_id = payload.dog_id;

          let dog = {
            "id": dog_id,
            "adoptStatus": "Reserved"
          }

          axios.put("api/dogpage/edit", dog).then((res) => {
            if (res.data.msg === "success"){
              console.log("Dog Reserved successfully");
            }

          })

        })
            .catch((err) => console.log("error when rejecting competitors: ", err));
      }).catch((err) => console.log("error when submitting: ", err));
    },

    contact_info_pre(adopter_id){
      this.contact_info(adopter_id);
      this.dialog_contact_info_visible = true;
    },

    async contact_info(adopter_id){
      const res = await axios.get(`api/customer/${adopter_id}`);
      this.temp_adopter_name = res.data.data.firstName;
      this.temp_adopter_email = res.data.data.email;
      this.temp_adopter_tel = res.data.data.phoneNumber;

    },

    async collection_confirm(row){
      let payload = {...row}
      delete payload.created_date;
      payload.status = "Adopted"
      axios.put("api/adopter/application/editForm", payload).then((res) => {
        if (res.data.msg === "success"){
          console.log("Submit successfully");
          this.$message({
            message: "Submit successfully",
            type:"success"
          });
        }
        else{
          console.log("Pass failed")
          this.$message.error("Failed in submitting, please contact IT service");
        }
      }).then(() => this.getAdoptionPendingApplication())
          .then(() => {
              let dog_id = payload.dog_id;

              let dog = {
                "id": dog_id,
                "adoptStatus": "Adopted"
              }

              axios.put("api/dogpage/edit", dog).then((res) => {
                if (res.data.msg === "success"){
                  console.log("Dog adopted successfully");
                }

              }).catch((err) => console.log("error when upadting dog: ", err));

      })
          .catch((err) => console.log("Error when editing form: ", err));

    }
  },




  mounted() {

    this.getAdoptedPendingApplication();
    this.getAdoptionPendingApplication();
    this.getApprovedApplication();
    this.getPendingApplication();
    this.getReviewingApplication();
    this.getAwaitInterviewApplication();


  },

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

span {
  white-space: pre-wrap;
  word-break: keep-all;
}

</style>
