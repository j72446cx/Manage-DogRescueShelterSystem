<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="form" :model="infoForm" label-width="150px">

        <el-form-item label="Dog ID: " style="width: 50%">
          <el-input v-model="infoForm.dog_id"></el-input>
        </el-form-item>

        <el-form-item label="Staff ID: " style="width: 50%">
          <el-input v-model="infoForm.staff_id"></el-input>
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
          <el-button type="primary" @click="onSubmitAdd" >Submit</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {

  data(){
    return {
      infoForm : {
        dog_id:'',
        staff_id:'',
        medication_name:'',
        dosage:'',
        startDate: '',
        endDate:'',
        notes:''
      },

      value1: []

    }
  },
  methods: {
    onSubmitAdd: function (){
      this.value1[0] = this.value1[0] + "T00:00:00"
      this.value1[1] = this.value1[1] + "T23:59:59"
      this.infoForm.dosage = this.infoForm.dosage.toString() + "g"
      this.infoForm.startDate = this.value1[0]
      this.infoForm.endDate = this.value1[1]

      alert("Adding: " + JSON.stringify(this.infoForm))

      this.addGrooming()
    },
    addGrooming: function (){
      axios.post('/api/interaction/medication', this.infoForm)
          .then(()=> alert("Added successfully!"))
          .then(()=> location.reload())
          .catch((error) => alert("Add Failed, with error: " + error))
    }

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
