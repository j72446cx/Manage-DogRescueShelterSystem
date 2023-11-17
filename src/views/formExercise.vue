<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="form" :model="infoForm" label-width="150px">

        <el-form-item label="Dog ID: " style="width: 50%">
          <el-input v-model="infoForm.dog_id"></el-input>
        </el-form-item>

        <el-form-item label="Staff ID: " style="width: 40%">
          <el-input v-model="infoForm.staff_id"></el-input>
        </el-form-item>

        <el-form-item label="Exercise Datetime: ">
          <el-date-picker
              v-model="infoForm.date"
              type="datetime"
              placeholder="Select the datetime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="Exercise Duration">
          <el-time-select
              v-model="infoForm.duration"
              start="00:15"
              step="00:15"
              end="03:00"
              placeholder="Pick Duration" />

        </el-form-item>

        <el-form-item label="Exercise Type: ">
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
          <el-button type="primary" @click="onSubmitAdd" >Submit</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const groomingOptions = ['Walk', 'Jogging', 'Frisbee', 'Competition'];
export default {

  data(){
    return {
      infoForm : {
        dog_id:'',
        staff_id:'',
        duration:'',
        date: '',
        exerciseType:'',
        notes:''
      },

      checkAll: false,
      checkedGrooming : [],
      groomingTypes: groomingOptions,
      isIndeterminate: true
    }
  },
  methods: {
    onSubmitAdd: function (){
      this.infoForm.exerciseType = this.checkedGrooming.join(', ')
      alert("Adding: " + JSON.stringify(this.infoForm))

      this.addGrooming()
    },
    addGrooming: function (){
      axios.post('/api/interaction/exercise', this.infoForm)
          .then(()=> alert("Added successfully!"))
          .then(()=> location.reload())
          .catch((error) => alert("Add Failed, with error: " + error))
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

  }

}

</script>
