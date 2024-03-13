<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title" style="color: #262626;">Dog Rescue Shelter System</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="password"
              v-model="param.password"
              @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">Login</el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import service from "../utils/request";
import messageStore from "../store/messageStore";

interface LoginInfo {
	username: string;
	password: string;
}

interface info {
  id: number;
  age: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  address: string;
  postCode: string;
  role: string;
  dateOfBirth: Date;
  gender: string;
  entryDate: Date;
  salary: number;
  emergency_Contact: string;
  avatar: string;
  contractStartDate: Date;
  contractEndDate: Date;
  username: string;
  password: string;
  contractImg: string;
  identityPhoto: string;
  identification: string;
  lastUpdateTime: Date;
  job:string;

}

const router = useRouter();
const param = reactive<LoginInfo>({
	username: '',
	password: ''
});

const rules: FormRules = {
	username: [
		{
			required: true,
			message: 'Please input the username',
			trigger: 'blur'
		}
	],
	password: [{ required: true, message: 'Please input the password', trigger: 'blur' }]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const response = await service.post("/api/login", {
          username: param.username,
          password: param.password
        });
        if (response.data.msg === "success") {
          ElMessage.success('Login Successfully');
          const token = response.data.data || '';
          localStorage.setItem('ms_token', token);
          console.log("MS_TOKEN: ", localStorage.getItem('ms_token'))
          localStorage.setItem('ms_username', param.username);

          service.get("/api/staffpage", {params:param, headers:{"token": token}}).then((res) =>{
            const staffInfo: info[] = res.data.data.rows;
            const keys = permiss.defaultList[staffInfo[0].role == 'admin' ? 'admin' : 'user'];

                permiss.handleSet(keys);
                localStorage.setItem('ms_keys', JSON.stringify(keys));
                localStorage.setItem('ms_role', (staffInfo[0].role) === 'admin'?'Admin':'Staff');
                localStorage.setItem('ms_age', JSON.stringify(staffInfo[0].age));
                localStorage.setItem('ms_id', JSON.stringify(staffInfo[0].id));
                localStorage.setItem('ms_avatar', staffInfo[0].avatar);
                localStorage.setItem('ms_password', JSON.stringify(staffInfo[0].password).slice(1,-1));
                localStorage.setItem('ms_firstname', JSON.stringify(staffInfo[0].firstName).slice(1, -1));
                localStorage.setItem('ms_lastname', JSON.stringify(staffInfo[0].lastName).slice(1, -1));
                localStorage.setItem('ms_entryDate', JSON.stringify(staffInfo[0].entryDate).slice(1, -1));
                localStorage.setItem('ms_job', JSON.stringify(staffInfo[0].job).slice(1, -1));
                localStorage.setItem('ms_lastUpdateTime', JSON.stringify(staffInfo[0].lastUpdateTime).slice(1, -1));
                localStorage.setItem('ms_email', (staffInfo[0].email));
                localStorage.setItem('ms_phoneNumber', staffInfo[0].phoneNumber);
                localStorage.setItem('ms_address', staffInfo[0].address);
                localStorage.setItem('ms_postCode', staffInfo[0].postCode);
                localStorage.setItem('ms_emergency', staffInfo[0].emergency_Contact);

                const tokens = localStorage.getItem('ms_token');
                console.log(localStorage.getItem('ms_token'));
                if (tokens){
                  messageStore.initWebSocket(tokens);
                }



                router.push('/');
          }
          );

        } else {
          ElMessage.error('Login failed');
          return false;
        }
      } catch (error) {
        ElMessage.error("Login failed");
      }
    } else {
      ElMessage.error('Please complete the form');
      return false
    }
  });
    }

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(src/assets/img/login.jpg);
	background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
