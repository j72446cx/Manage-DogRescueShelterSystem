<template>
  <div class="container">
    <div class="form-box">
      <el-row :gutter="120">
        <el-col :span="12">

          <el-form :model="infoForm" label-width="200" style="width: 120%" v-if="step===0" ref="form" :rules="rules">
            <span style="font-size: 150%; font-weight: bold">Staff Registration</span>
            <br><br>

            <el-form-item label="Firstname: " prop="firstName" style="width: 150%">
              <el-input v-model="infoForm.firstName"></el-input>
            </el-form-item>
            <el-form-item label="Lastname: " prop="lastName" style="width: 150%">
              <el-input v-model="infoForm.lastName"></el-input>
            </el-form-item>
            <el-form-item label="Middle name: " prop="middleName" style="width: 150%">
              <el-input v-model="infoForm.middleName"></el-input>
            </el-form-item>
            <el-form-item label="Gender: " prop="gender" style="width: 150%">
              <el-select v-model="infoForm.gender">
                <el-option v-for="items in optionsGender"
                           :key="items.value"
                           :label="items.label"
                           :value="items.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Date of Birth: " prop="dateOfBirth" style="width: 150%">
              <el-date-picker
                  v-model="infoForm.dateOfBirth"
                  type="date"
              >
              </el-date-picker>
            </el-form-item>
            <br>
            <el-form-item label="Address: " prop="address" style="width: 150%">
              <el-input v-model="infoForm.address" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="Postcode: " prop="postCode" style="width: 150%">
              <el-input v-model="infoForm.postCode"></el-input>
            </el-form-item>
            <el-form-item label="Email: " prop="email" style="width: 150%">
              <el-input v-model="infoForm.email"></el-input>
            </el-form-item>
            <el-form-item label="TEL: " prop="phoneNumber" style="width: 150%">
              <el-input v-model="infoForm.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="Identification Number: " prop="identification" style="width: 150%">
              <el-input v-model="infoForm.identification"></el-input>
            </el-form-item>
            <el-form-item label="Emergency Contact: " prop="emergency_Contact" style="width: 150%">
              <el-input v-model="infoForm.emergency_Contact"></el-input>
            </el-form-item>

          </el-form>

          <el-form label-width="200" style="width: 120%" v-if="step===1" ref="form2" :model="this.infoForm" :rules="rules">
            <span style="font-size: 150%; font-weight: bold">Admin Confirmation</span>
            <br><br>


            <el-form-item label="Contract Start Date: " style="width: 150%" prop="contractStartDate">
              <el-date-picker
                  v-model="infoForm.contractStartDate"
                  type="date"
              >
              </el-date-picker>

            </el-form-item>
            <el-form-item label="Contract End Date: " style="width: 150%" prop="contractEndDate">
              <el-date-picker
                  v-model="infoForm.contractEndDate"
                  type="date"
              >
              </el-date-picker>

            </el-form-item>

            <el-form-item label="Job: " style="width: 150%" prop="job">
              <el-select v-model="infoForm.job">
                <el-option v-for="items in optionsJob"
                           :key="items.value"
                           :label="items.label"
                           :value="items.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Role: " style="width: 150%" prop="role">
              <el-select v-model="infoForm.role">
                <el-option v-for="items in optionsRole"
                           :key="items.value"
                           :label="items.label"
                           :value="items.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Salary: £" style="width: 150%" prop="salary">
              <el-input v-model="infoForm.salary"></el-input>
            </el-form-item>

          </el-form>
        </el-col>


        <el-col :span="12">
          <br><br><br>
          <el-form label-width="300" style="width: 300%" v-if="step===0" :model="infoForm" ref="form" :rules="rules">


            <el-form-item label="Username: " prop="username" style="width: 80%">
              <el-input v-model="infoForm.username"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="Password: " prop="password" style="width: 80%">
              <el-input v-model="infoForm.password"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="Contract Image:" prop="contractImg">

              <el-upload drag
                         action="api/upload"
                         name = "image"
                         :file-list="fileListContractImg"
                         :on-preview="handlePreviewContract"
                         :on-remove="handleRemoveContract"
                         :on-exceed="handleExceedContract"
                         :on-success="handleSuccessPhoto">
                <el-button v-if="fileListContractImg === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
                <div v-if="fileListContractImg.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

                <div v-if="fileListContractImg.length !== 0" slot="tip" class="el-upload__tip">
                  <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
                  <br>
                  If you want to upload another photo, please delete the previous one at first!
                </div>
              </el-upload>

            </el-form-item>


            <el-form-item label="Identification photo: " prop="identityPhoto">
              <el-upload drag
                         action="api/upload"
                         name = "image"
                         :file-list="fileListIdentication"
                         :on-preview="handlePreviewIdPhoto"
                         :on-remove="handleRemoveIdPhoto"
                         :on-exceed="handleExceedIdPhoto"
                         :on-success="handleSuccessIdPhoto">
                <el-button v-if="fileListIdentication === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
                <div v-if="fileListIdentication.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

                <div v-if="fileListIdentication.length !== 0" slot="tip" class="el-upload__tip">
                  <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
                  <br>
                  If you want to upload another photo, please delete the previous one at first!
                </div>
              </el-upload>

            </el-form-item>

          </el-form>
          <div class="fixed-button-container">
            <el-button type="primary" round icon="right" @click="nextForm" v-if="step===0">Next</el-button>
            <el-button type="info" icon="back" @click="step--" v-if="step===1" round>Back</el-button>
            <el-button type="success" icon="upload" @click="this.onsubmitAddStaff" v-if="step===1" round>Submit</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import service from "../utils/request.ts";
import router from "../router/index.ts";

export default {
  data(){
    return {
      infoForm :  {
        age: '',
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phoneNumber: '',
        address: '',
        postCode: '',
        role: '',
        dateOfBirth: '',
        gender: '',
        salary: '',
        emergency_Contact: '',
        contractStartDate: '',
        contractEndDate: '',
        username: '',
        password: '',
        contractImg: '',
        identityPhoto: '',
        identification: '',
        entryDate: new Date(),
        job: ''
      },

      fileListIdentication: [],
      fileListContractImg: [],
      loadingSubmit: false,

      step: 0,

      optionsJob: [{
        value: 'Groomer',
        label: 'Groomer'
      },
        {
          value: 'Behavioral Trainer',
          label: 'Behavioral Trainer'
        },
        {
          value: 'Caretaker',
          label: 'Caretaker'
        },
        {
          value: 'Vet',
          label: 'Vet'
        }
      ],

      optionsRole: [{
        value: 'admin',
        label: 'admin'
      },
        {
          value: 'employee',
          label: 'employee'
        }
      ],

      optionsGender: [{
        value: 'Male',
        label: 'Male'
      },
        {
          value: 'Female',
          label: 'Female'
        }
      ],

      rules: {
        firstName: [
          { required: true, message: 'Please input the firstname', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: 'Please input the lastname', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: 'Please select the gender', trigger: 'blur' }
        ],
        dateOfBirth: [
          { required: true, message: 'Please choose the date of birth', trigger: 'blur' }
        ],
        contractStartDate: [
          { required: true, message: 'Please choose the start date', trigger: 'blur' }
        ],
        contractEndDate: [
          { required: true, message: 'Please choose the end date', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'Please input the address', trigger: 'blur' }
        ],
        postCode: [
          { required: true, message: 'Please input the postcode', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input the email', trigger: 'blur' },
          { type: 'email', message: 'Please input the correct email format', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: 'Please input the TEL', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: 'Please input the Identification Number', trigger: 'blur' }
        ],
        emergency_Contact: [
          { required: true, message: 'Please input the emergency contact', trigger: 'blur' }
        ],
        username: [
          { required: true, message: 'Please input the username', trigger: 'blur' },
          { min: 5, max: 12, message: 'Username must be greater than 5 and less than 12 characters', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username must not contain special characters', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input the password', trigger: 'blur' },
          {  min: 5 ,max: 15, message: 'Password must be greater than 5 and less than 15 characters', trigger: 'blur' }
        ],
        contractImg: [
          { required: true, message: 'Please upload the contract Image', trigger: 'blur'}
        ],
        identityPhoto: [
          {required: true, message: 'Please upload your identification photo'}
        ],
        job: [
          {required: true, message: 'Please select the job'}
        ],
        role: [
          {required: true, message: 'Please select the role'}
        ],
        salary: [
          {required: true, message: 'Please input the salary'}
        ]
      }
    }

  },
  methods: {

    resetForm(){
      this.infoForm= {
        age: '',
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phoneNumber: '',
        address: '',
        postCode: '',
        role: '',
        dateOfBirth: '',
        gender: '',
        salary: '',
        emergency_Contact: '',
        contractStartDate: '',
        contractEndDate: '',
        username: '',
        password: '',
        contractImg: '',
        identityPhoto: '',
        identification: '',
        entryDate: new Date(),
        job: ''
      }
    },
    validateField(field) {
      console.log("Come")
      this.$refs.form.validateField(field, (errorMessage) => {
        console.log(errorMessage);
      });
    },
    clear_form(){
      this.infoForm = {
        age: '',
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phoneNumber: '',
        address: '',
        postCode: '',
        role: '',
        dateOfBirth: '',
        gender: '',
        entryDate: '',
        salary: '',
        emergency_Contact: '',
        contractStartDate: '',
        contractEndDate: '',
        username: '',
        password: '',
        contractImg: '',
        identityPhoto: '',
        identification: '',
        job: ''
      }
    },

    handlePreviewIdPhoto(){

    },

    handleRemoveIdPhoto(){

      this.infoForm.identityPhoto = '';
      this.fileListIdentication = [];

    },

    handleExceedIdPhoto(){

      this.$message.warning("Please first delete the photo you uploaded previously!")

    },

    handleSuccessIdPhoto(response, file){
      this.infoForm.identityPhoto = response.data;
      this.fileListIdentication.push(file);
    },

    handlePreviewContract(){

    },

    handleRemoveContract(){

      this.infoForm.contractImg = '';
      this.fileListContractImg = [];

    },

    handleExceedContract(){
      this.$message.warning("Please first delete the photo you uploaded previously!")

    },

    handleSuccessPhoto(response, file){
      this.infoForm.contractImg = response.data;
      this.fileListContractImg.push(file);


    },

    onSubmitAdd: function (){
      this.addDog()
      this.dialogAddFormVisible = false
    },
    addDog: function (){
      this.loadingSubmit = true;
      service.post('/api/staffpage/save', this.infoForm)
          .then((res)=> setTimeout(() => {
            this.loadingSubmit = false;
            if (res.data.msg === 'success'){
              this.$message({
                type: 'success',
                message: 'Submit successfully'
              })
            }
            this.clear_form();
          }, 1000))
          .catch((error) => console.log("Error when submitting form: ", error))
    },

    nextForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          service.get('api/staffpage/', {params: {username: this.infoForm.username}}).then((res) => {
            if (res.data.data.total !== 0){
              this.$message.error("Username already exist");
              return false;
            }
            else{
              this.step++;
            }
          });
          // 提交表单
        } else {
          this.$message.error("Some inputs is invalid, please check again.")
          return false;
        }
      });
    },

    async onsubmitAddStaff(){
      this.$refs.form2.validate(async (valid) => {
        if (valid) {
          service.post('api/staffpage/save', this.infoForm).then((res) => {
            if (res.data.msg === 'success'){
              this.$message({
                type: 'success',
                message: 'Staff registered successfully'
              })
              this.resetForm();
              router.push('/dashboard');
            }
            else{
              this.$message.error("Error when adding staff, please contact IT service")
            }
          })

        } else {
          this.$message.error("Some inputs is invalid, please check again.")
          return false;
        }

      })
    }


  }

}

</script>

<style scoped>
.fixed-button-container {
  position: fixed; /* 使用 fixed 定位，使元素相对于视口固定位置 */
  right: 100px; /* 距离视口右边 20px */
  bottom: 30px; /* 距离视口底部 20px */
  z-index: 1000; /* 确保按钮在其他内容之上 */
}
</style>
