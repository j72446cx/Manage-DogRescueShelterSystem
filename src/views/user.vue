<template>
	<div>
		<el-row :gutter="50">
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>Employee Certificate</span>
						</div>
					</template>
					<div class="info">
						<div class="info-image">
							<el-avatar :size="100" :src="this.imgurl" />
							<span class="info-edit"  @click="this.avatar_change_dialog = true">
								<i class="el-icon-lx-camerafill" ></i>
							</span>
						</div>
						<div class="info-name">{{ firstname }}</div>
            <div class="info-desc">Staff ID: {{staff_id}}</div>
            <div class="info-desc">Job: {{job}}</div>
						<div class="info-desc">Entry Date: {{entryDate.split("T")[0]}}</div>
<!--            <div class="info-desc">Last Update Time: {{lastUpdateTime.split("T")[0]}}</div>-->
<!--            <div class="info-desc">Number of your dogs: {{dogNumber}}</div>-->
					</div>
				</el-card>
			</el-col>

			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>Editing Password</span>
						</div>
					</template>
					<el-form ref="form" :model="form" label-width="200px">
						<el-form-item label="Username："> {{ this.username }} </el-form-item>
						<el-form-item label="Early password：">
							<el-input type="password" v-model="input_earlypsw"></el-input>
						</el-form-item>
						<el-form-item label="New password：">
							<el-input type="password" v-model="formPsw.password"></el-input>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="onSubmitPassword">Save</el-button>
						</el-form-item>
					</el-form>
				</el-card>
        <br>
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>Personal Information Edition</span>
            </div>
          </template>

          <el-form label-width="200px">

            <el-form-item label="Email: ">
              <el-input v-model="info_edit.email"></el-input>
            </el-form-item>

            <el-form-item label="Address: ">
              <el-input v-model="info_edit.address"></el-input>
            </el-form-item>

            <el-form-item label="Postcode: ">
              <el-input v-model="info_edit.postCode"></el-input>
            </el-form-item>

            <el-form-item label="TEL: ">
              <el-input v-model="info_edit.phoneNumber"></el-input>
            </el-form-item>

            <el-form-item label="Emergency Contact: ">
              <el-input v-model="info_edit.emergency_Contact"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmitPersonalInfo">Save</el-button>
            </el-form-item>
          </el-form>
        </el-card>
			</el-col>


		</el-row>

    <el-dialog v-model="avatar_change_dialog" title="Avatar change">

      <el-form>
        <br>
        <el-form-item label="New avatar: ">

          <el-upload drag
                     action="api/upload"
                     name = "image"
                     :file-list="fileListAvatar"
                     :on-preview="handlePreviewAvatar"
                     :on-remove="handleRemoveAvatar"
                     :on-exceed="handleExceedAvatar"
                     :on-success="handleSuccessAvatar">
            <el-button v-if="fileListAvatar === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
            <div v-if="fileListAvatar.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

            <div v-if="fileListAvatar.length !== 0" slot="tip" class="el-upload__tip">
              <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
              <br>
              If you want to upload another photo, please delete the previous one at first!
            </div>
          </el-upload>


        </el-form-item>
        <br>
        <el-form-item>
          <el-button type="primary" @click="onSubmitAvatar" round>Submit</el-button>
        </el-form-item>
      </el-form>


    </el-dialog>

	</div>
</template>


<script>

import service from "../utils/request.ts";
import router from "../router/index.ts";

export default {
  data(){
    return{
      username: localStorage.getItem("ms_username"),
      imgurl : localStorage.getItem('ms_avatar'),
      firstname: localStorage.getItem('ms_firstname'),
      lastname: localStorage.getItem('ms_lastname'),
      job: localStorage.getItem('ms_job'),
      entryDate: localStorage.getItem('ms_entryDate'),
      lastUpdateTime: localStorage.getItem('ms_lastUpdateTime'),
      dogNumber: localStorage.getItem('ms_dogNumber'),
      staff_id: localStorage.getItem('ms_id'),
      password: localStorage.getItem('ms_password'),
      input_earlypsw: '',
      fileListAvatar: [],

      info_edit: {
        email: localStorage.getItem('ms_email'),
        phoneNumber: localStorage.getItem('ms_phoneNumber'),
        address: localStorage.getItem('ms_address'),
        postCode: localStorage.getItem('ms_postCode'),
        emergency_Contact: localStorage.getItem('ms_emergency'),
        id: localStorage.getItem('ms_id')
      },

      formPsw: {
        password: '',
        id: localStorage.getItem('ms_id')
      },

      avatar_change: {
        avatar: localStorage.getItem('ms_avatar'),
        id: localStorage.getItem('ms_id')

      },

      avatar_change_dialog: false
    }
  },

  methods: {


      onSubmitPassword:function() {

        if (this.input_earlypsw === this.password){
          service.put('api/staffpage/edit', this.formPsw)
              .then((res) => res.data.msg === "success"?
                  this.$message({
                    message: "Password Changed Successfully",
                    type: 'success'
                  })
                  :this.$message({
                    message: "Some error occured, please contact IT department",
                    type: 'error'
                  }))
        }
        else{
          this.$message({

            message: 'Your early password is incorrect',
            type: 'error'
          })
        }

        router.push("/login")
      },

    onSubmitPersonalInfo(){
        service.put('api/staffpage/edit', this.info_edit).then((res) => {
          if (res.data.msg === 'success'){
            this.$message({
              type: 'success',
              message: 'Edit successfully'
            });
            router.push('/login')
          }
          else{
            this.$message.error("Error when editing, please contact IT service")
          }
        })
    },
    handleRemoveAvatar(){

        this.avatar_change.avatar = '';
        this.fileListAvatar = [];

    },

    handlePreviewAvatar(){

    },

    handleExceedAvatar(){
      this.$message.warning("Please first delete the photo you uploaded previously!")
    },
    handleSuccessAvatar(response, file){
      this.avatar_change.avatar = response.data;
      this.fileListAvatar.push(file)

    },

    onSubmitAvatar(){

        service.put('api/staffpage/edit', this.avatar_change).then((res) => {
          if (res.data.msg === 'success'){
            this.$message({
              type: 'success',
              message: 'Changed successfully'
            });
            localStorage.setItem('ms_avatar', this.avatar_change.avatar);
            location.reload();
          }
          else{
            this.$message.error("Error when editing, please contact IT service")
          }

        })
    }
  }
}





</script>

<style scoped>
.info {
	text-align: center;
	padding: 35px 0;
}
.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}

.info-edit {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}
.info-edit i {
	color: #eee;
	font-size: 25px;
}
.info-image:hover .info-edit {
	opacity: 1;
}
.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}
.crop-demo-btn {
	position: relative;
}
.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}
</style>
