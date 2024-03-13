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
          <el-table-column label="Operation" width="200px">
            <template v-slot="scope">
              <el-button type="primary" @click="startReviewing(scope.row.id)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)" plain>Start Reviewing</el-button>
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
              <el-button icon="Download" round @click="downloadPDF(scope.row.pdfURL)">


              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="Comments" width="100px">
            <template v-slot="scope">
              <el-button round icon="Edit" @click="getReviewingForm(scope.row)"></el-button>
            </template>

          </el-table-column>

          <el-table-column label="Operation" width="300px">
            <template v-slot="scope">
              <el-button icon="check" @click="onAccept(scope.row)" type="success" round>Approve</el-button>
              <el-button icon="close" @click="onReject(scope.row)" type="danger" round>Reject</el-button>
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
              <el-button type="primary" icon="check" v-if="scope.row.interview_date !== null" @click="onAcceptApproved(scope.row)">Accept</el-button>
              <el-button type="warning" icon="minus" v-if="scope.row.interview_date !== null" @click="sendMessageToUser(scope.row.adopter_id, scope.row.id, scope.row.dog_id, scope.row.interview_date)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Refuse</el-button>

              <el-button type="primary" icon="Position" v-if="scope.row.interview_date === null" @click="hurryUp(scope.row.adopter_id, scope.row.id, scope.row.dog_id)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Send Message</el-button>
              <el-button icon="close" type="danger" v-if="scope.row.interview_date === null" @click="onReject(scope.row)">Reject</el-button>
            </template>
          </el-table-column>


        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="`Interviewing (${applicationInterviewing.length})`" name="fourth">

        <el-table :data="applicationInterviewing" :show-header="true" style="width: 100%">
          <el-table-column prop="id" label="Application ID" width="120"></el-table-column>
          <el-table-column prop="adopter_id" label="Adopter ID" width="120"></el-table-column>
          <el-table-column prop="dog_id" label="Dog ID"></el-table-column>
          <el-table-column label="Interview Date" width="200">
            <template v-slot="scope">
              <span>{{transofmDateFormat(scope.row.interview_date, 1)}}</span>
            </template>
          </el-table-column>

          <el-table-column label="Interview Result" width="200px">
              <template v-slot="scope">

                <el-button icon="Edit" round v-if="getInterviewStatus(scope.row.interview_date)" @click="onclickInterview(scope.row)"></el-button>
                <span v-else>Waiting for Interview</span>

              </template>
          </el-table-column>

          <el-table-column label="Application Details" width="200px">
            <template v-slot="scope">
              <el-button icon="Download" round @click="downloadPDF(scope.row.pdfURL)">
<!--                <el-icon><Download /></el-icon>-->
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="Operation" width="400px">
            <template v-slot="scope">
              <el-button type="primary" icon="check" v-if="scope.row.haveCompetitor === false" @click="pass(scope.row)">Pass</el-button>
              <el-button type="primary" icon="check" v-if="scope.row.haveCompetitor === true && this.compareResult[scope.row.dog_id] === true" @click="pass_and_reject(scope.row)">Pass and Reject other competitors</el-button>
              <el-button type="info" icon="coffee-cup" v-if="scope.row.haveCompetitor === true && this.compareResult[scope.row.dog_id] === false">Waiting for competitor</el-button>
              <el-button type="danger" icon="close" @click="onReject(scope.row)">Reject</el-button>

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
              <el-button type="warning" icon="List" round @click="contact_info_pre(scope.row.adopter_id)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)"></el-button>
<!--              <el-icon @click="contact_info_pre(scope.row.adopter_id)"><List /></el-icon>-->
            </template>
          </el-table-column>

          <el-table-column width="300px" label="Send message">
            <template v-slot="scope">
              <el-button type="primary" round icon="Position" @click="sendRemind(scope.row.adopter_id, scope.row.id, scope.row.dog_id)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Send</el-button>
            </template>
          </el-table-column>

          <el-table-column label="Collection Confirmation">
            <template v-slot="scope">
              <el-icon color="green" size="30px" @click="collection_confirm_a(scope.row)" style="margin-right: 40px;"><SuccessFilled /></el-icon>
              <el-icon color="red" size="30px" @click="collection_failed_methods(scope.row)"><CircleCloseFilled /></el-icon>

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
          <el-button type="primary" @click="saveReviewingForm" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Save</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog title="Approve Confirmation" v-model="dialog_accept_visible">
      <span>Please make sure all application details have been investigated and commented.</span>
      <br><br><br>
      <el-button type="primary" @click="acceptConfirm(this.temp_object)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Yes I confirm and submit</el-button>
      <el-button type="info" @click="this.dialog_accept_visible = false">Cancel</el-button>

    </el-dialog>

    <el-dialog title="Approve Confirmation" v-model="dialog_accept_approved_visible">
      <span>Are you sure you want to accept this interview date?</span>
      <br><br><br>
      <el-button type="primary" @click="acceptConfirmApproved(this.temp_object)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Yes I confirm and submit</el-button>
      <el-button type="info" @click="this.dialog_accept_approved_visible = false">Cancel</el-button>

    </el-dialog>

    <el-dialog title="Confirmation" v-model="dialog_interview_pass_visible">
      <span> Are you sure you want to make it pass?</span>
      <br><br><br>
      <el-button type="primary" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)" @click="pass_confirm">Yes I confirm and submit</el-button>
      <el-button type="info" @click="this.dialog_interview_pass_visible = false">Cancel</el-button>
    </el-dialog>

    <el-dialog title="Reject Confirmation" v-model="dialog_reject_visible">
      <span style="word-break: keep-all;">Please make sure all application details have been investigated and commented.</span>
      <br><br><br>

      <el-input v-model="reject_reason" type="textarea" placeholder="Please fill in the reasons for rejection"></el-input>
      <br><br><br>

      <el-button type="primary" @click="rejectConfirm(this.temp_object, this.reject_reason)" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Yes I confirm and submit</el-button>
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
        <el-button type="success" @click="submitInterviewConform" round v-if="step_interview===2" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Submit</el-button>

      </div>
    </el-dialog>

    <el-dialog title="Confirmation" v-model="dialog_interview_pass_reject">
      <span>This process is irreversible, please confirm all the details have been investigated. After doing this, please send messages to the rejected adopters to explain this.</span>
      <br><br><br>
      <div style="text-align: center">
        <el-button type="success" round @click="pass_rejct_confirm" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Yes, I confirm and submit</el-button>
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

    <el-dialog title="Collection Confirmation" v-model="collection_dialog_confirm">
      <span> Are you sure the dog has been collected by its adopter? </span>
      <br><br><br>
      <el-button type="primary" @click="collection_confirm" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Yes I confirm</el-button>
      <el-button @click="collection_dialog_confirm=false">Cancel</el-button>
    </el-dialog>

    <el-dialog title="Collection Failed Report" v-model="dialog_not_collect">
      <span>Are you sure the collection is failed? If you confirm, it will reject the application immediately and the dog becomes available again.</span>
      <br><br><br>

          <el-input v-model="reject_reason" type="textarea" placeholder="Please fill in the reasons for rejection."></el-input>

      <br><br><br>

      <el-button type="primary" @click="collection_failed" v-loading.fullscreen.lock="isloading" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Yes I confirm and submit</el-button>
      <el-button type="info" @click="dialog_not_collect = false">Cancel</el-button>

    </el-dialog>




  </div>
</template>


<script>
import messageStore from "../store/messageStore.ts";
import service from "../utils/request.ts";
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
      dialog_interview_pass_visible: false,
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
        temp_adopter_tel: '',

      isloading: false,

      collection_dialog_confirm: false,

      dialog_not_collect: false

    }

  },

  methods:{
    collection_failed_methods(row){
      this.temp_object = row;
      this.dialog_not_collect= true;
    },


    pass(row){

      this.dialog_interview_pass_visible = true;
      this.temp_object = row;

    },

    collection_confirm_a(row){
      this.temp_object = row;
      this.collection_dialog_confirm = true;
    }
    ,

    getPendingApplication() {
      const params={
        status: "Pending"
      };

      service.get("api/adopter/application/status", {params:params})
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

      service.get("api/adopter/application/status", {params:params})
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

      service.get("api/adopter/application/status", {params:params})
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

      service.get("api/adopter/application/status", {params:params})
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

      service.get("api/adopter/application/status", {params:params})
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

      service.get("api/adopter/application/status", {params:params})
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

      this.isloading = true;
      setTimeout(() => {

        const params={
          id: id,
          status: "Reviewing"
        };

        const reviewingForm = {
          application_id : id
        }

        service.put("api/adopter/application/editForm", params).then((res) => {

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
          service.post("api/reviewing/save", reviewingForm).then((res) => {

            setTimeout(() => {

              if (res.data.msg === "success"){
                console.log("Created new reviewing form");
              }
              else{
                console.error("Error when creating a new reviewing form");
              }
            }, 1000)

          }).catch((err) => console.log("Error appeared when posting new reviewing form : ", err));
        })
            .catch((err) => {
              console.log("Error reviewing: ", err);
            }).finally(() => this.isloading = false);

      }, 500)



    },

    getReviewingForm(row){
        const param={
          application_id: row.id
        }

        service.get("api/reviewing", {params:param}).then((res) => {
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
      this.isloading= true;
      service.put("api/reviewing/edit", this.reviewing_form).then((res) => {
        setTimeout(() => {
          this.isloading = false;
          if (res.data.msg === "success"){
            console.log("Saving reviewing form successfully!");
            this.$message({
              message: 'Saved Successfully',
              type: 'success'
            })
            this.dialog_reviewing_visible = false
          }
        }, 700)

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
      service.get("api/interview", {params: {application_id: row.id}}).then((res) => {
        this.interview_form = res.data.data[0];
        this.dialog_interview_visible = true;
      })

    },

    rejectConfirm(row,reason){
      this.isloading = true;

      if (!this.reject_reason.trim()) {
        this.$message.error('Please fill in the reasons for rejection.');
        return;
      }

      let payload= {...row};
      delete payload.created_date;
      payload.status="Rejected";
      payload.reject_reason = reason;
      service.put("api/adopter/application/editForm", payload).then((res) => {
        setTimeout(() => {
          this.isloading = false;
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
            this.sendRejectReasonToUser(payload.adopter_id, payload.id, payload.dog_id);
          }
        }, 700)

      })
          .catch((err) => {
        console.log("Error when rejecting: ", err);
      })
    },

    collection_failed(){
      this.rejectConfirm(this.temp_object, this.reject_reason);
      service.put("api/dogpage/edit", {id: this.temp_object.dog_id, adoptStatus: "Available"}).then((res) => {

      }).catch((err) => console.log("Error when editing: ", err))

    },

    acceptConfirm(row){
      this.isloading = true;

      let payload = {...row};

      delete payload.created_date;
      payload.status = "Approved";
      service.put("api/adopter/application/editForm", payload).then((res) => {
        setTimeout(() => {
          this.isloading= false;
          if(res.data.msg === "success"){
            console.log("Approved successfully");
            this.$message({
              message: "Approved successfully",
              type:"success"
            });
            this.dialog_accept_visible = false;

          }
        }, 700)

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

      this.isloading = true;

      setTimeout(() => {
        let payload = {...row};
        delete payload.created_date;
        payload.status = "Await";
        service.put("api/adopter/application/editForm", payload).then((res) => {

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
          service.post("api/interview/save", {application_id: payload.id});
        })
            .catch((err) => {
              console.log("Error when approving: ", err);
            }).finally(() => this.isloading = false)

      }, 700)

    },

    submitInterviewConform(){
      this.isloading = true;

      setTimeout(() => {

        this.interview_form.staff_id = localStorage.getItem("ms_id");
        service.put("api/interview/edit", this.interview_form).then((res) => {
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
        }).then(() => this.getAwaitInterviewApplication()).catch((err) => console.log("Error when submitting interview form: ", err))
        .catch((err) => console.log("error when submitting: ", err))
        .finally((this.isloading = false));


      }, 700)

    },

    sendMessageToUser(adopter_id, application_id, dog_id, interview_date){

      this.isloading = true;

      service.get("api/customer/"+ adopter_id).then((res) => {
        setTimeout(() => {
          this.isloading = false;
          let adopter_name = res.data.data.firstName;

          const all_detail = JSON.stringify({
            application_id, dog_id, interview_date, adopter_name
          });

          this.$router.push({ path: '/tabs', query: { tab: 'fourth', all_detail, userId: adopter_id } })

        }, 700)

      }).then(() => {
          service.put("api/adopter/application/editForm", {id: application_id, interview_date: null}).catch((err) => {
            console.log("Error appear when editing form: ", err);
          })
      })

          .catch((err) => console.log("error when fetching name: ", err));

    },

    sendRejectReasonToUser(adopter_id, application_id, dog_id){
      console.log("application_id is: ", application_id)
      service.get("api/customer/" + adopter_id).then((res) => {
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
      this.isloading = true;
      setTimeout(() => {
        service.get("api/customer/"+ adopter_id).then((res) => {
          let adopter_name = res.data.data.firstName;

          const all_detail_hurry = JSON.stringify({
            application_id, dog_id, adopter_name
          });

          this.$router.push({ path: '/tabs', query: { tab: 'fourth', all_detail_hurry, userId: adopter_id } })

        })

            .catch((err) => console.log("error when fetching name: ", err))
        .finally(() => this.isloading = false)
      }, 700)



    },

    async sendRemind(adopter_id, application_id, dog_id){
      this.isloading = true;

      setTimeout(async () => {
        try {
          const res = await service.get(`api/customer/${adopter_id}`);
          let adopter_name = res.data.data.firstName;

          const secondRes = await service.get(`api/dogpage/${dog_id}`);
          let dog_name = secondRes.data.data.name;

          const all_detail_remind = JSON.stringify({
            application_id, dog_id, adopter_name, dog_name
          });

          this.$router.push({path: '/tabs', query: {tab: 'fourth', all_detail_remind, userId: adopter_id}});

          this.isloading = false;


        } catch (err) {
          console.log("error when fetching data", err);
        }

      }, 700)

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


        const res = await service.get("api/adopter/application/byDog/"+ dog_id);
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

    pass_confirm(){
      this.isloading = true;
      setTimeout(() => {

        let payload = {...this.temp_object};
        delete payload.created_date;
            payload.status = "Adoption Pending"
            service.put("api/adopter/application/editForm", payload).then((res) => {
              if (res.data.msg === "success"){
                console.log("Passed successfully");
                this.$message({
                  message: "Submit successfully",
                  type:"success"
                });
                this.dialog_interview_pass_visible = false;
              }
              else{
                console.log("Pass failed")
                this.$message.error("Failed in submitting, please contact IT service");
                this.dialog_interview_pass_visible = false;
              }
      }).then(() => {
              this.getAwaitInterviewApplication();
              this.getAdoptionPendingApplication();
            })
                .catch((err) => console.log("Error when pass: ", err)).finally(() => this.isloading = false)}, 700)
    },


    pass_rejct_confirm(){

      this.isloading = true;

      setTimeout(() => {
        let payload = {...this.temp_object};
        delete payload.created_date;
        payload.status = "Adoption Pending"
        const temp_id = payload.id;
        const temp_dog_id = payload.dog_id;
        service.put("api/adopter/application/editForm", payload).then((res) => {
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
            return service.put("api/adopter/application/editForm", item);
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

            service.put("api/dogpage/edit", dog).then((res) => {
              if (res.data.msg === "success"){
                console.log("Dog Reserved successfully");
              }

            })

          })
              .catch((err) => console.log("error when rejecting competitors: ", err));
        }).catch((err) => console.log("error when submitting: ", err))
        .finally(() => this.isloading = false);

      }, 700)

    },

    contact_info_pre(adopter_id){
      this.isloading = true;
      setTimeout(() => {
        this.isloading = false;
        this.contact_info(adopter_id);
        this.dialog_contact_info_visible = true;
      }, 300)

    },

    async contact_info(adopter_id){
      const res = await service.get(`api/customer/${adopter_id}`);
      this.temp_adopter_name = res.data.data.firstName;
      this.temp_adopter_email = res.data.data.email;
      this.temp_adopter_tel = res.data.data.phoneNumber;

    },

    async collection_confirm(){
      this.isloading = true;
      setTimeout(() => {

        let payload = {...this.temp_object}
        delete payload.created_date;
        payload.status = "Adopted"
        service.put("api/adopter/application/editForm", payload).then((res) => {
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

          this.collection_dialog_confirm = false;
        }).then(() => this.getAdoptionPendingApplication())
            .then(() => {
              let dog_id = payload.dog_id;

              let dog = {
                "id": dog_id,
                "adoptStatus": "Adopted",
                "adoptedDate": new Date()
              }

              service.put("api/dogpage/edit", dog).then((res) => {
                if (res.data.msg === "success"){
                  console.log("Dog adopted successfully");
                }

              }).catch((err) => console.log("error when upadting dog: ", err));

            })
            .catch((err) => console.log("Error when editing form: ", err)).finally(() => this.isloading = false);

      }, 500)


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
