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

        <el-form-item label="Grooming Date: ">
          <el-date-picker
              v-model="infoForm.grooming_date"
              type="datetime"
              placeholder="Select the datetime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="Grooming Type: ">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Select All</el-checkbox>
          <div style="margin: 15px 0; "></div>
          <el-checkbox-group v-model="checkedGrooming" @change="handleCheckedCitiesChange" style="width: 500%">
            <el-checkbox v-for="type in groomingTypes" :label="type" :key="type">{{type}}</el-checkbox>
          </el-checkbox-group>
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

const groomingOptions = ['Hair cutting', 'Nail cutting', 'Ear/Eye Cleaning', 'Tartar cleaning', 'Bath'];
export default {

  data(){
    return {
      infoForm : {
        dog_id:'',
        staff_id:localStorage.getItem('ms_id'),
        grooming_date:'',
        type:'',
        notes:''
      },

      role: localStorage.getItem('ms_role'),
      staff_dog: [],

      checkAll: false,
      checkedGrooming : [],
      groomingTypes: groomingOptions,
      isIndeterminate: true,
      isloadingSubmit: false
    }
  },
  methods: {
    resetForm(){
      this.infoForm.dog_id = '';
      this.infoForm.grooming_date = '';
      this.infoForm.type = '';
      this.infoForm.notes = '';
      this.checkedGrooming = [];
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
      this.infoForm.type = this.checkedGrooming.join(', ')

      this.addGrooming()
    },
    addGrooming: function (){
      this.isloadingSubmit = true;
      service.post('/api/interaction/grooming', this.infoForm)
          .then((res)=>{
            setTimeout(() => {
              this.isloadingSubmit = false;
              if (res.data.msg === 'success'){
                this.$message({
                  type:'success',
                  message: 'Submit successfully'
                })
              }
              else{
                this.$message.error("Error when submitting the form")
              }
              this.resetForm()
            }, 1000)

          })
          .catch((error) => console.log("Add Failed, with error: " , error))
    },
    handleCheckAllChange(val) {
      this.checkedGrooming = val ? groomingOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.groomingTypes.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.groomingTypes.length;
    }

  },
  mounted() {
    this.staffgetDog();
  }

}

</script>
