<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="form" :model="infoForm" label-width="150px">

        <el-form-item label="Dog ID: " style="width: 50%">
          <el-autocomplete
              v-model="infoForm.dog_id"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
              :clearable="true"
              placeholder="Type to search"

          ></el-autocomplete>
        </el-form-item>

        <el-form-item label="Staff ID: " style="width: 40%">
          <el-input v-model="infoForm.staff_id" v-if="role === 'Admin'"></el-input>
          <span v-else>{{infoForm.staff_id}}</span>
        </el-form-item>


        <el-form-item label="Medication Name: ">
          <el-input v-model="infoForm.medication_name" style="width: 50%"></el-input>
        </el-form-item>


        <el-form-item label="Dosage/g: ">
          <el-input-number v-model="infoForm.dosage" :step="50"></el-input-number>
        </el-form-item>

        <el-form-item label="Medication Period: ">
        <div class="demo-date-picker">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="to"
                start-placeholder="Start date"
                end-placeholder="End date"
                value-format="YYYY-MM-DD"

            />
          </div>
        </div>
        </el-form-item>

        <el-form-item label="Notes: ">
          <el-input type="textarea" v-model="infoForm.notes" placeholder="Anything to note..."></el-input>
        </el-form-item>

        <br>
        <el-form-item>
          <el-button type="primary" @click="onSubmitAdd" v-loading.fullscreen.lock="isloadingSubmit" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Submit</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import service from "../utils/request.ts";

export default {

  data(){
    return {
      role: localStorage.getItem('ms_role'),
      infoForm : {
        dog_id:'',
        staff_id:localStorage.getItem('ms_id'),
        medication_name:'',
        dosage:'',
        startDate: '',
        endDate:'',
        notes:''
      },

      value1: [],
      staff_dog: [],

      isloadingSubmit : false

    }
  },
  methods: {
    resetForm(){
      this.infoForm.dog_id = '';
      this.infoForm.medication_name = '';
      this.infoForm.dosage = '';
      this.infoForm.startDate = '';
      this.infoForm.endDate = '';
      this.infoForm.notes = '';
      this.value1 = [];
    },

    handleSelect(item){
      this.infoForm.dog_id = item.id;

    },

    querySearch(querySt, cb){

      const results = querySt ? this.staff_dog.filter(this.create_filter(querySt)) : this.staff_dog;
      cb(results);

    },

    create_filter(querySt){
      return (res) => {
        return (res.value.toLowerCase().includes(querySt.toLowerCase()))
      }
    },


    staffgetDog(){
      service.get("api/interaction/staffGetDog/" + localStorage.getItem('ms_id')).then((res) => {
        this.staff_dog = res.data.data.map(dog => ({
          value: dog.name,
          id: dog.id
        }))
      })
    },
    onSubmitAdd: function (){
      this.value1[0] = this.value1[0] + "T00:00:00"
      this.value1[1] = this.value1[1] + "T23:59:59"
      this.infoForm.dosage = this.infoForm.dosage.toString() + "g"
      this.infoForm.startDate = this.value1[0]
      this.infoForm.endDate = this.value1[1]
      this.addGrooming()
    },
    addGrooming: function (){
      this.isloadingSubmit = true;
      service.post('/api/interaction/medication', this.infoForm)
          .then((res)=> {
            setTimeout(() => {
              this.isloadingSubmit = false;
              if (res.data.msg === 'success') {
                this.$message({
                  type: 'success',
                  message: 'Submit successfully'
                })
              }
              else{
                this.$message.error("Error when submitting the form")
              }
              this.resetForm();

            }, 1000)

          })
          .catch((error) => alert("Add Failed, with error: " + error))
    }

  },
  mounted() {
    this.staffgetDog();
  }

}

</script>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
</style>
