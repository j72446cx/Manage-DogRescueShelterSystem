<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">


				<el-card shadow="hover" class="mgb20" style="height: auto; max-height: 252px; overflow-y: auto;">
					<div class="user-info">
						<el-avatar :size="120" :src=imgurl />
						<div class="user-info-cont">
							<div class="user-info-name">{{ this.name }}</div>
							<div>{{ this.job }}</div>
						</div>
					</div>
<!--					<div class="user-info-list">-->
<!--						Last login time：-->
<!--						<span>2022-10-01</span>-->
<!--					</div>-->
<!--					<div class="user-info-list">-->
<!--						Last login location：-->
<!--						<span>Manchester</span>-->
<!--					</div>-->
				</el-card>



				<el-card shadow="hover"  style="height: auto; max-height: 302px; overflow-y: auto;">
					<template #header>
						<div class="clearfix">
							<span>Daily Feeding Check</span>
						</div>
					</template>


          <el-table :show-header="false" :data="this.resDogs" v-if="this.resDogs.length !== 0">

            <el-table-column>
              <template #default="scope">
                <span>{{ scope.row.name}} is fed normally today?</span>

                <div class="icon-container">
                <el-button type="text" @click="toggleNormalDialog(scope.row.id)">
                  <el-icon><Select /></el-icon>
                </el-button>

                <el-button type="text" @click="handleNo(scope.row.id)">
                  <el-icon><CloseBold/></el-icon>
                </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table :show-header="false" v-else empty-text="Great, you have completed it!">

          </el-table>

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
									<div class="grid-num">{{all_message}}</div>
									<div>Messages</div>
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
									<div>Tasks For Today</div>
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

					<el-table :show-header="false" :data="todoList" style="height: auto; max-height: 302px; overflow-y: auto;">

						<el-table-column>
							<template #default="scope">

									{{ scope.row.title }}
<!--                <div class="icon-container">-->
<!--                  <el-button type="text" @click="handleYes(scope.row.id)">-->
<!--                    <el-icon><Select /></el-icon>-->
<!--                  </el-button>-->

<!--                  <el-button type="text" @click="handleNo(scope.row.id)">-->
<!--                    <el-icon><CloseBold/></el-icon>-->
<!--                  </el-button>-->
<!--                </div>-->
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>

    <el-dialog title="Details" v-model="dialog_visible">
      <el-table :data="table_data">
<!--        <el-table-column prop="id" label="ID" width="150"></el-table-column>-->
        <el-table-column prop="dog_id" label="Dog ID"></el-table-column>
        <el-table-column prop="food_type" label="Food Type"></el-table-column>
        <el-table-column prop="quantity" label="Quantity(grams)"></el-table-column>
        <el-table-column prop="feeding_time" label="Date"></el-table-column>
      </el-table>
      <br>
      <el-form :model="dialog_form">
        <el-form-item label="Why not fed normally?" :label-width="200">
          <el-input v-model="dialog_form.notes" autocomplete="off" type="textarea"/>
        </el-form-item>
        <br>

        <div class="submit-button-container">
        <el-form-item>
          <el-button type="primary" @click="this.innerDialogVisible = true" >Submit</el-button>
        </el-form-item>

        </div>

      </el-form>


      <el-dialog title="Confirmation" v-model="this.innerDialogVisible">

        <span>Your notes will play a crucial role in further analysis by our vet, please make sure everything you write: conforms to reality and full of details </span>
        <br><br><br>
        <el-button type="primary" @click="this.handleSubmitNotes">Yes I confirm and submit now</el-button>
      </el-dialog>


    </el-dialog>

    <el-dialog title="Confirmation" v-model="this.normalDialogVisible">
      <span> Please confirm everything before you submit</span>
      <br><br><br>
      <el-button type="primary" @click="this.handleYes(this.awaitNormalConfirm)">Yes I confirm and submit it now</el-button>
    </el-dialog>

	</div>
</template>

<script>

import service from "../utils/request.ts";
import messageStore from "../store/messageStore.ts";


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

      all_message : messageStore.state.all_messages.length,

      imgurl : localStorage.getItem('ms_avatar'),
      name : localStorage.getItem('ms_firstname'),
      role : localStorage.getItem('ms_role'),
      job : localStorage.getItem('ms_job'),
      
      resDogs: [],
      resDogNumber : 0,
      taskLeft : 0,
      time_now : new Date(),
      temp_dogname : '',
      dialog_visible: false,
      dialog_form: {
        notes: ''
      },
      search_form: {
        dog_id: '',
        feeding_time_start: this.formatDateStart(new Date()),
        feeding_time_end: this.formatDateEnd(new Date())
      },

      table_data: [],

      innerDialogVisible : false,

      normalDialogVisible: false,
      awaitNormalConfirm: ''



    }
  },

  methods:{

    toggleNormalDialog: function (id){
      this.normalDialogVisible = true;
      this.awaitNormalConfirm = id;
    },

   formatDateStart: function(date) {

      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  },

  formatDateEnd: function(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    date.setDate(date.getDate()+1);
    const day = date.getDate().toString().padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
  },

    async getDailyWork() {
      try{
        const medResponse = await service.get("/api/interaction/getMedication", { params: this.param });
        localStorage.setItem("eve_med", JSON.stringify(medResponse.data.data.rows));

        for (const item of medResponse.data.data.rows) {
          this.taskLeft++;
          const dogName = await this.getDogName(item.dog_id);
          this.todoList.push({
            title: `Medicate ${dogName} (id: ${item.dog_id}) with ${item.dosage} of ${item.medication_name}`,
            status: false
          });
        }

        const exResponse = await service.get("api/interaction/getExercise", { params: this.param2 });
        localStorage.setItem("eve_ex", JSON.stringify(exResponse.data.data.rows));

        for (const item of exResponse.data.data.rows) {
          this.taskLeft++;
          const dogName = await this.getDogName(item.dog_id);
          this.todoList.push({
            title: `Exercise with ${dogName} (id: ${item.dog_id}) at ${this.transofmDateFormat(item.date,1)} with duration ${item.duration}`,
            status: false
          });
        }

        const  grResponse = await service.get("api/interaction/getGrooming", {params: this.param3});
        localStorage.setItem("eve_gr", JSON.stringify(grResponse.data.data.rows));

        for (const item of grResponse.data.data.rows){
          this.taskLeft++;
          const dogName = await this.getDogName(item.dog_id);
          this.todoList.push({
            title: `Grooming for ${dogName} (id: ${item.dog_id}) takes place at ${this.transofmDateFormat(item.grooming_date, 1)}`,
            status: false
          })
        }
        localStorage.setItem('task_left', this.taskLeft);
      }catch (err){
        console.error("Error when getting daily work: ", err)
      }


    },

    getResponsible: function (){
     service.get("/api/interaction/staffGetDog/" + localStorage.getItem('ms_id'))
         .then((res) => {
           this.resDogNumber = res.data.data.length;
           for (let i = 0; i < this.resDogNumber; i++) {
             service.get("api/interaction/getFeed", {params: {dog_id:res.data.data[i].id, feeding_time_start:this.formatDateStart(new Date()), feeding_time_end: this.formatDateEnd(new Date())}})
             .then((result) =>{
               for (let j = 0; j < result.data.data.total; j++) {
                 if(result.data.data.rows[j].normal_feed === -1){
                    const dogExist = this.resDogs.some(dog => dog.id === result.data.data.rows[j].dog_id)
                    if (!dogExist || j === 0){
                      this.resDogs.push(res.data.data[i])

                    }



                 }
               }

             })
           }

           localStorage.setItem('ms_dogNumber', this.resDogNumber);

         });
      
    },

    handleYes: function (id){

      this.search_form.dog_id = id;
      this.getFeeding().then(() => {
        let updatePromise = this.table_data.map(item => {
          return service.put("api/interaction/feedNormal/" + item.id + "/1")
        });

        Promise.all(updatePromise).then((response) => {
          let allSuccessful = response.every(res => res.data.msg === 'success');
          if (allSuccessful){
            this.$notify({
              title: 'Success',
              message: "Upload successfully",
              type: "success"
            });
            this.normalDialogVisible = false;
            this.resDogs = [];
            this.getResponsible();
          }
          else {
            // 如果至少一个请求失败了，显示错误通知
            this.$notify.error({
              title: "Failed",
              message: "One or more updates failed, please contact IT department",
            });
          }

        }).catch((error) => {
          console.error('Error when updating: ', error);
          this.$notify.error({
            title: "Failed",
            message: "An error occurred, please contact IT department",
          });
        })
      }).catch(error => {
        console.error('Error when fetching data for yes action: ', error);
      });

      // for (let i = 0; i < this.table_data.length; i++) {
      //   service.put("api/interaction/feedNormal/" + this.table_data[i].id + "/1")
      // }
      // this.resDogs = []
      // this.getResponsible()
    },

    handleNo: function(id){
      this.dialog_visible = true;
     this.search_form.dog_id = id;
     this.getFeeding();

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

    handleSubmitNotes: function (){

     const updatePromises =  this.table_data.map(item => {
       // Encode notes to ensure special characters in notes do not break the URL
       const encodedNotes = encodeURIComponent(this.dialog_form.notes);
       return service.put(`api/interaction/feedNormal/${item.id}/0/?notes=${encodedNotes}`);
     });

     Promise.all(updatePromises).then((response) => {
       const allSuccessful = response.every(res => res.data.msg === 'success');
       if (allSuccessful){
         this.$notify({
           title: "Success",
           message: "Upload Successfully",
           type: 'success'
         });

         this.resDogs = [];
         this.getResponsible();
       }
       else {
         // If not all updates are successful, notify failure
         this.$notify.error({
           title: "Failed",
           message: "Upload Error, please contact IT department",
         });
       }
       this.innerDialogVisible = false;
       this.dialog_visible = false;
     }).catch(error => {
       console.error('Error when submitting notes: ', error);
       this.$notify.error({
         title: "Failed",
         message: "An error occurred, please contact IT department",
       });
     })
    },

    rearrangeDate: function (dateStr) {
      // 分割日期和时间
      const [datePart, timePart] = dateStr.split('T');
      // 分割日期部分
      const dateParts = datePart.split('-');
      // 分割时间部分并去除秒
      const timeParts = timePart.split(':');
      // 重新组合日期和时间
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timeParts[0]}:${timeParts[1]}`;
    },


    getFeeding:function (){
     const {dog_id, feeding_time_start, feeding_time_end} = this.search_form
      const param = {
       dog_id,
        feeding_time_start,
        feeding_time_end
      }

      return service.get("api/interaction/getFeed", {params: param})
        .then((res) => {
          this.table_data = res.data.data.rows;

          for (let i = 0; i < this.table_data.length; i++) {
            this.table_data[i].feeding_time = this.rearrangeDate(this.table_data[i].feeding_time)
          }


        })

          .catch((error) => console.error('Error when fetching data: ', error))


    },

    async getDogName(id){
      const res = await service.get("api/dogpage/" + id);
      return res.data.data.name;
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

.icon-container {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 将图标对齐到容器的末端 */
  gap: 5px; /* 图标之间的间距 */
}

.container {
  max-height: 400px; /* 根据需要调整最大高度 */
  overflow-y: auto;
}

.table-container{/* 表格整体 */
  width:1350px;
  height: 250px;
  margin-left:130px;
  margin-top:50px;
}

.submit-button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
