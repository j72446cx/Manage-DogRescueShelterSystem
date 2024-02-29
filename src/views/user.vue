<template>
	<div>
		<el-row :gutter="20">
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
							<span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
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
			</el-col>
		</el-row>

	</div>
</template>


<script>

import axios from "axios";
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

      formPsw: {
        password: '',
        id: localStorage.getItem('ms_id')
      }
    }
  },

  methods: {
      onSubmitPassword:function() {

        if (this.input_earlypsw === this.password){
          axios.put('api/staffpage/edit', this.formPsw)
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
