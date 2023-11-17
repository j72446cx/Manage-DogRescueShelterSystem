<template>
    <div class="container">
        <div class="form-box">
          <el-form ref="form" :model="infoForm" label-width="150px">

            <el-form-item label="Name: " style="width: 50%">
              <el-input v-model="infoForm.name"></el-input>
            </el-form-item>

            <el-form-item label="Age: " style="width: 40%">
              <el-input v-model="infoForm.age"></el-input>
            </el-form-item>

            <el-form-item label="Species: " style="width: 80%">
              <el-input v-model="infoForm.species"></el-input>
            </el-form-item>

            <el-form-item label="Gender: ">
              <el-select v-model="infoForm.gender" placeholder="Please select gender">
                <el-option label="Male" value="Male"></el-option>
                <el-option label="Female" value="Female"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Last Vaccine Date: ">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="If known" v-model="infoForm.lastVaccineDate" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>

            <el-form-item label="Adopt Status: ">
              <el-radio-group v-model="infoForm.adoptStatus">
                <el-radio label="Available"></el-radio>
                <el-radio label="Reserved"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Introduction: ">
              <el-input type="textarea" v-model="infoForm.intro" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="Medical History: ">
              <el-input type="textarea" v-model="infoForm.medicalHistory" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="Image: ">
              <el-input type="textarea" v-model="infoForm.imgURL" placeholder="URL"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmitAdd" >Create</el-button>
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
        id:'',
        name:'',
        age:'',
        imgURL:'',
        species:'',
        adoptStatus:'',
        medicalHistory:'',
        intro:'',
        gender:'',
        entryDate:'',
        lastVaccineDate:'',
        lastUpdateTime:'',
        adoptedDate:''
      }
    }
  },
  methods: {
    onSubmitAdd: function (){
      alert("Adding: " + JSON.stringify(this.infoForm))
      this.addDog()
      this.dialogAddFormVisible = false
    },
    addDog: function (){
      axios.post('/api/dogpage/save', this.infoForm)
          .then(()=> alert("Added successfully!"))
          .then(()=> location.reload())
          .catch((error) => alert("Add Failed, with error: " + error))
    }
  }

}

</script>
