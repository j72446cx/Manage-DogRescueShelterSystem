<template>
  <div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-calendar v-model="currentDate" >
          <template #dateCell="{ data }">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').pop()}}
              {{ data.isSelected ? (viewDaywork(data.day), '✔️') : '' }}
            </p>

          </template>
        </el-calendar>
      </el-col>

      <el-col :span="16">


        <el-card shadow="hover" style="height: 203px">
          <template #header>
            <div class="clearfix">
              <span>Daily Exercise</span>
              <el-button style="float: right; padding: 3px 0" text @click="button_exercise">Add</el-button>
            </div>
          </template>

          <el-table ref="myTable" :show-header="false" :data="todoList.exerciseInfo"  style="width: 100%" height="100px">

            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  <span>Exercise type: {{scope.row.exerciseType}} scheduled on </span>
                  <span style="color: blueviolet"> {{transofmDateFormat(scope.row.date, 1)}}</span>
                  <span>   with duration </span>
                  <span style="color: blueviolet;"> {{scope.row.duration}}</span>
                  <span> for dog id: </span>
                  <span style="color: blueviolet"> {{scope.row.dog_id}}</span>

                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <br>


<!--        set 2-->
        <el-card shadow="hover" style="height: 203px">
          <template #header>
            <div class="clearfix">
              <span>Medication schedule</span>
              <el-button style="float: right; padding: 3px 0" text @click="button_medication">Add</el-button>
            </div>
          </template>

          <el-table ref="myTable" :show-header="false" :data="todoList.medicationInfo"  style="width: 100%" height="100px">

            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  <span>The dog with id: </span>
                    <span style="color: blueviolet">{{scope.row.dog_id}}</span>

                  <span> should take  </span>
                  <span style="color: blueviolet">{{scope.row.medication_name}} </span>
                    <span> with dosage of </span>
                  <span style="color: blueviolet"> {{scope.row.dosage}}</span>

                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <br>

        <el-card shadow="hover" style="height: 203px">
          <template #header>
            <div class="clearfix">
              <span>Grooming Schedule</span>
              <el-button style="float: right; padding: 3px 0" text @click="button_grooming">Add</el-button>
            </div>
          </template>

          <el-table ref="myTable" :show-header="false" :data="todoList.groomingInfo"  style="width: 100%" height="100px">

            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  <span>The dog with id: </span>
                  <span style="color: blueviolet"> {{scope.row.dog_id}} </span>
                  <span> have a {{scope.row.type}} at </span>
                   <span style="color: blueviolet">  {{transofmDateFormat(scope.row.grooming_date, 1)}}</span>

                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>


      </el-col>


    </el-row>

  </div>
</template>

<script>
import service from "../utils/request.ts";
import router from "../router/index.ts";

export default {
  data(){
    return{

      todoList: {
        medicationInfo: [],
        groomingInfo: [],
        exerciseInfo: [],
        feedingInfo: []
      },
      showCard : true,
      value : new Date(),
      dateFormatStart : '',
      dateFormatEnd: '',
      currentDate: new Date().toISOString().split('T')[0]

    }
  },
  methods: {

    fetchInfo: function (){
      const params1 = {
        medication_time_start : this.dateFormatStart,
        medication_time_end : this.dateFormatEnd
      }

      const params2 = {
        grooming_time_start : this.dateFormatStart,
        grooming_time_end : this.dateFormatEnd
      }

      const params3 = {
        exercise_time_start : this.dateFormatStart,
        exercise_time_end : this.dateFormatEnd
      }

      const params4 = {
        feeding_time_start : this.dateFormatStart,
        feeding_time_end : this.dateFormatEnd
      }

      service.get('/api/interaction/getMedication', {params:params1})
          .then((res) => {
            this.todoList.medicationInfo = res.data.data.rows;
      }).catch(()=>{
        console.error("Fetch medication info failed")});
      service.get('/api/interaction/getGrooming', {params:params2})
          .then((res) => {this.todoList.groomingInfo = res.data.data.rows;}).catch(()=>{
        console.error("Error fetching grooming info")});
      service.get('/api/interaction/getExercise', {params:params3})
          .then((res) => {this.todoList.exerciseInfo = res.data.data.rows;}).catch(()=>{
        console.error("Error fetching exercise info")
      });
      service.get('/api/interaction/getFeed', {params:params4})
          .then((res) => {
            this.todoList.feedingInfo = res.data.data.rows;
          }
          ).catch(()=>{
        console.error("Error fetching feed info")
      });
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

    viewDaywork: function (data){
      this.dateFormatStart = data;
      let date = new Date(data);
      date.setDate(date.getDate() + 1);
      this.dateFormatEnd = date.toISOString().split('T')[0];

      this.fetchInfo();
    },

    hasActivityOnDate: function (date, activityType){

      return activityType.some(activity => {
        let activityDate = activity.datetime.split('T')[0];
        return activityDate === date;
      })
    },

    button_grooming: function (){
        router.push("/formGrooming")
    },

    button_exercise: function (){
      router.push("/formExercise")

    },
    button_medication:function (){
      router.push("/formMedication")

    }

  },
  mounted() {
    this.fetchInfo();
  }
}

</script>

<style scoped>
.is-selected {
  color: #1989FA;
}
</style>
