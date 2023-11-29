<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">


				<el-card shadow="hover" class="mgb20" style="height: 252px">
					<div class="user-info">
						<el-avatar :size="120" :src=imgurl />
						<div class="user-info-cont">
							<div class="user-info-name">{{ this.name }}</div>
							<div>{{ this.role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						Last login time：
						<span>2022-10-01</span>
					</div>
					<div class="user-info-list">
						Last login location：
						<span>Manchester</span>
					</div>
				</el-card>



				<el-card shadow="hover" style="height: 252px">
					<template #header>
						<div class="clearfix">
							<span>Message Board</span>
						</div>
					</template>

				</el-card>
			</el-col>




			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon"><User /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num"><span>{{this.resDogNumber}}</span></div>
									<div>Your Dogs</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon"><ChatDotRound /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">321</div>
									<div>System Messages</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon"><Notification /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num"><span>{{this.taskLeft}}</span></div>
									<div>Tasks Left Today</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>




				<el-card shadow="hover" style="height: 403px">
					<template #header>
						<div class="clearfix">
							<span>Daily Schedule</span>
<!--							<el-button style="float: right; padding: 3px 0" text></el-button>-->
						</div>
					</template>

					<el-table :show-header="false" :data="todoList" style="width: 100%">
						<el-table-column width="40">
							<template #default="scope">
								<el-checkbox v-model="scope.row.status"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<div
									class="todo-item"
									:class="{
										'todo-item-del': scope.row.status
									}"
								>
									{{ scope.row.title }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>


<!--		<el-row :gutter="20">-->
<!--			<el-col :span="12">-->
<!--				<el-card shadow="hover">-->
<!--					<schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>-->
<!--				</el-card>-->
<!--			</el-col>-->
<!--			<el-col :span="12">-->
<!--				<el-card shadow="hover">-->
<!--					<schart ref="line" class="schart" canvasId="line" :options="options2"></schart>-->
<!--				</el-card>-->
<!--			</el-col>-->
<!--		</el-row>-->
	</div>
</template>

<!--<script setup lang="ts" name="dashboard">-->
<!--import { reactive } from 'vue';-->
<!--import axios from "axios";-->

<!--const imgurl = localStorage.getItem('ms_avatar');-->
<!--const name = localStorage.getItem('ms_username');-->
<!--const role = localStorage.getItem('ms_role');-->

<!--type TodoItem = {-->
<!--  title: string;-->
<!--  status: boolean;-->
<!--};-->

<!--const state = reactive({-->
<!--  todoList: [] as TodoItem[]-->
<!--})-->


<!--const param = reactive({-->
<!--  staff_id : localStorage.getItem('ms_id'),-->
<!--  medication_time_start : formatDateStart(new Date()),-->
<!--  medication_time_end : formatDateEnd(new Date())-->

<!--});-->

<!--const param2 = reactive({-->
<!--  staff_id : localStorage.getItem('ms_id'),-->
<!--  exercise_time_start : formatDateStart(new Date()),-->
<!--  exercise_time_end : formatDateEnd(new Date())-->

<!--});-->

<!--const param3 = reactive({-->
<!--  staff_id : localStorage.getItem('ms_id'),-->
<!--  grooming_time_start : formatDateStart(new Date()),-->
<!--  grooming_time_end : formatDateEnd(new Date())-->

<!--});-->

<!--const param4 = reactive({-->
<!--  staff_id : localStorage.getItem('ms_id'),-->
<!--  feeding_time_start : formatDateStart(new Date()),-->
<!--  feeding_time_end: formatDateEnd(new Date())-->

<!--});-->

<!--function formatDateStart(date: Date): string {-->
<!--  const year = date.getFullYear();-->
<!--  const month = (date.getMonth() + 1).toString().padStart(2, '0');-->
<!--  const day = date.getDate().toString().padStart(2, '0');-->

<!--  return `${year}-${month}-${day}`;-->
<!--}-->

<!--function formatDateEnd(date: Date): string {-->
<!--  const year = date.getFullYear();-->
<!--  const month = (date.getMonth() + 1).toString().padStart(2, '0');-->
<!--  date.setDate(date.getDate()+1);-->
<!--  const day = date.getDate().toString().padStart(2, '0');-->

<!--  return `${year}-${month}-${day}`;-->
<!--}-->

<!--const getDailyWork = () => {-->
<!--  axios.get("/api/interaction/getMedication", {params: param})-->
<!--  .then((res) => {localStorage.setItem("eve_med", JSON.stringify(res.data.data.rows));-->

<!--    res.data.data.rows.forEach((item: { dog_id: any; }, index: any) => {-->
<!--      state.todoList.push({-->
<!--        title: `Need to medicate dog ${item.dog_id}`,-->
<!--        status: false-->
<!--      });-->
<!--    });-->

<!--  });-->

<!--  axios.get("api/interaction/getExercise", {params: param2})-->
<!--      .then((res) => {localStorage.setItem("eve_ex", JSON.stringify(res.data.data.rows)); });-->

<!--  axios.get("api/interaction/getFeed", {params: param4})-->
<!--      .then((res) => {localStorage.setItem("eve_feed", JSON.stringify(res.data.data.rows));});-->

<!--  axios.get("api/interaction/getGrooming", {params: param3})-->
<!--      .then((res) => {localStorage.setItem("eve_gr", JSON.stringify(res.data.data.rows));});-->
<!--}-->

<!--getDailyWork();-->

<!--alert(state.todoList)-->
<!--</script>-->




<script>

import axios from "axios";

export default {
  data(){
    return{
      param : {
        staff_id : localStorage.getItem('ms_id'),
        medication_time_start : this.formatDateStart(new Date()),
        medication_time_end : this.formatDateEnd(new Date())

      },

     param2 : {
        staff_id : localStorage.getItem('ms_id'),
        exercise_time_start : this.formatDateStart(new Date()),
        exercise_time_end : this.formatDateEnd(new Date())

      },

      param3 : {
        staff_id : localStorage.getItem('ms_id'),
        grooming_time_start : this.formatDateStart(new Date()),
        grooming_time_end : this.formatDateEnd(new Date())

      },

      param4 : {
        staff_id : localStorage.getItem('ms_id'),
        feeding_time_start : this.formatDateStart(new Date()),
        feeding_time_end: this.formatDateEnd(new Date())

      },

      todoList: [],

      imgurl : localStorage.getItem('ms_avatar'),
      name : localStorage.getItem('ms_username'),
      role : localStorage.getItem('ms_role'),
      
      resDogs: [],
      resDogNumber : 0,
      taskLeft : 0
    }
  },

  methods:{

   formatDateStart: function(date) {

      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  },

  formatDateEnd: function(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    date.setDate(date.getDate()+1);
    const day = date.getDate().toString().padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
  },

    getDailyWork: function () {
      axios.get("/api/interaction/getMedication", {params: this.param})
          .then((res) => {localStorage.setItem("eve_med", JSON.stringify(res.data.data.rows));


            res.data.data.rows.forEach((item, index) => {
              this.taskLeft++;
              this.todoList.push({
                title: `Medicate the dog with id: ${item.dog_id}`,
                status: false
              });
            });

          });

      axios.get("api/interaction/getExercise", {params: this.param2})
          .then((res) => {localStorage.setItem("eve_ex", JSON.stringify(res.data.data.rows));
            res.data.data.rows.forEach((item, index) => {
              this.taskLeft++;
              this.todoList.push({
                title: `Exercise with the dog with id: ${item.dog_id}`,
                status: false
              });
            });
          });

      axios.get("api/interaction/getFeed", {params: this.param4})
          .then((res) => {localStorage.setItem("eve_feed", JSON.stringify(res.data.data.rows));
            res.data.data.rows.forEach((item, index) => {
              this.taskLeft++;
              this.todoList.push({
                title: `Feed the dog with id: ${item.dog_id}`,
                status: false
              });
            });

          });

      axios.get("api/interaction/getGrooming", {params: this.param3})
          .then((res) => {localStorage.setItem("eve_gr", JSON.stringify(res.data.data.rows));
            res.data.data.rows.forEach((item, index) => {
              this.taskLeft++;
              this.todoList.push({
                title: `Grooming the dog with id: ${item.dog_id}`,
                status: false
              });
            });

          });

      localStorage.setItem('task_left', this.taskLeft);
    },

    getResponsible: function (){
     axios.get("/api/interaction/staffGetDog/" + localStorage.getItem('ms_id'))
         .then((res) => {
           this.resDogNumber = res.data.data.length;

         });
      
    }



  },
  mounted() {
    this.getDailyWork()
    this.getResponsible()
  }

}
</script>

<style scoped>
.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}
</style>
