<template>
	<div>
		<div class="container">
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" v-loading="isloadingTable">
        <el-table-column prop="id" label="ID" width="60">
        </el-table-column>
        <el-table-column prop="name" label="Name" width="150">
        </el-table-column>
        <el-table-column prop="age" label="Age" width="60">
        </el-table-column>
        <el-table-column prop="species" label="Species" width="150">
        </el-table-column>
        <el-table-column prop="gender" label="Gender" width="90">
        </el-table-column>
        <el-table-column prop="adoptStatus" label="Adopt Status" width="120">
        </el-table-column>
        <el-table-column label="Entry Date" width="180">
          <template v-slot="scope">
            {{transofmDateFormat(scope.row.entryDate)}}
          </template>
        </el-table-column>
        <el-table-column formatter="" label="Latest Update" width="300">
          <template v-slot="scope">
            {{transofmDateFormat(scope.row.lastUpdateTime, 1)}}
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="180">
          <template v-slot="scope">
            <el-button icon="Search" circle @click="getFormDog(scope.row.id)"></el-button>

            <el-button type="primary" icon="Edit" circle @click="getEditForm(scope.row.id)"></el-button>

            <el-button type="danger" icon="Delete" circle @click="handleDelete(scope.row.id)"></el-button>
          </template>

        </el-table-column>

			</el-table>
			<div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total">
        </el-pagination>
			</div>
		</div>

<!--    query dog-->
    <el-dialog title="Detailed Dog Information" v-model="this.dialogFormVisible">
      <el-form ref="form" :model="individualData" label-width="150px" class="label-bold">

        <el-form-item label="ID: ">
          <span>{{individualData.id}}</span>
        </el-form-item>

        <el-form-item label="Name: ">
          <span>{{individualData.name}}</span>

        </el-form-item>

        <el-form-item label="Age: ">
          <span>{{individualData.age}}</span>
        </el-form-item>

        <el-form-item label="Species: ">
          <span>{{individualData.species}}</span>
        </el-form-item>

        <el-form-item label="Gender: ">
          <span>{{individualData.gender}}</span>
        </el-form-item>

        <el-form-item label="Status: ">
          <span>{{individualData.adoptStatus}}</span>
        </el-form-item>

        <el-form-item label="Introduction: ">
          <span>{{individualData.intro}}</span>
        </el-form-item>

        <el-form-item label="Medical History: ">
          <span>{{individualData.medicalHistory}}</span>
        </el-form-item>

        <el-form-item label="Image: ">
          <template>
            <img :src="individualData.imgURL" width="200px" height="140px">
          </template>
        </el-form-item>

        <el-form-item label="Entry Date: ">
          <span>{{transofmDateFormat(individualData.entryDate)}}</span>
        </el-form-item>

        <el-form-item label="Last Vaccine Date: ">
          <span>{{transofmDateFormat(individualData.lastVaccineDate)}}</span>
        </el-form-item>

        <el-form-item label="Adopted Date: ">
          <span>{{transofmDateFormat(individualData.adoptedDate)}}</span>
        </el-form-item>
        <el-form-item label="Lastest Update: ">
          <span>{{transofmDateFormat(individualData.lastUpdateTime, 1)}}</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="dialogFormVisible = false">OK</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>

<!--    edit-->
    <el-dialog title="Dog Registration" v-model="dialogEditFormVisible">
      <el-form ref="form" :model="individualData" label-width="150px">

        <el-form-item label="ID: ">
          <span>{{individualData.id}}</span>
        </el-form-item>
        <el-form-item label="Name: " style="width: 50%">
          <el-input v-model="individualData.name" :content="infoForm.name"></el-input>
        </el-form-item>

        <el-form-item label="Age: " style="width: 30%">
          <el-input v-model="individualData.age" :content="infoForm.age"></el-input>
        </el-form-item>

        <el-form-item label="Species: " style="width: 80%">
          <el-input v-model="individualData.species"></el-input>
        </el-form-item>

        <el-form-item label="Gender: ">
          <el-select v-model="individualData.gender">
            <el-option label="Male" value="Male"></el-option>
            <el-option label="Female" value="Female"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Status: ">
          <el-radio-group v-model="individualData.adoptStatus">
            <el-radio label="Available"></el-radio>
            <el-radio label="Reserved"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Introduction: ">
          <el-input type="textarea" v-model="individualData.intro" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="Medical History: ">
          <el-input type="textarea" v-model="individualData.medicalHistory" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="Image URL: ">
          <el-input type="textarea" v-model="individualData.imgURL" placeholder="URL"></el-input>
        </el-form-item>

        <el-form-item label="Entry Date: ">
          <el-col :span="11">
            <el-date-picker type="date" format="DD-MM-YYYY" value-format="YYYY-MM-DD" placeholder="Entry date(if known)" v-model="individualData.entryDate" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="Last Vaccine Date: ">
          <el-col :span="11">
            <el-date-picker type="date" format="DD-MM-YYYY" value-format="YYYY-MM-DD" placeholder="Last Vaccine date(if known)" v-model="individualData.lastVaccineDate" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="Adopted Date: ">
          <el-col :span="11">
            <el-date-picker type="date" format="DD-MM-YYYY" value-format="YYYY-MM-DD" placeholder="Adopted date(if known)" v-model="individualData.adoptedDate" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmitEdit" v-loading.fullscreen.lock="isloadingEdit" element-loading-text="Loading..." element-loading-background="rgba(0, 0, 0, 0.8)">Submit</el-button>
          <el-button type="primary" @click="dialogEditFormVisible = false">Cancel</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>
		<!-- 编辑弹出框 -->
	</div>
</template>


<script>
import service from "../utils/request.ts";
import {ElMessage, ElMessageBox} from "element-plus";

export default{

  data(){
    return {
      tableData : [],
      individualData : [],
      isloadingTable: false,
      searchForm : {
        id:'',
        gender:'',
        adoptStatus:''
      },
      dialogFormVisible: false,
      dialogEditFormVisible : false,
      dialogAddFormVisible: false,
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
      },
      currentPage : 1,
      pageSize : 5,
      total:1000,

      isloadingEdit: false
    }
  },
  methods: {


    onSubmitEdit: function (){
      this.isloadingEdit= true;
      this.editDog()
      this.dialogEditFormVisible = false
    },

    handleDelete: function(id){
      // 二次确认删除
      ElMessageBox.confirm('Do you want to delete？', 'Warning', {
        type: 'warning'
      })
          .then(() => {
            service.delete('/api/dogpage/delete/' + id).then((res) => {
              if(res.data.msg === 'success'){
                this.$message({
                  type:'success',
                  message: 'Deleted successfully'
                })
              }
            }).then(() => this.fetchDogs());
          })
          .catch((er) => {
            console.error(er)});
    },

    editDog: function (){

      this.isloadingEdit = true;

      service.put('/api/dogpage/edit/', this.individualData)
          .then((res) => {

            setTimeout(() => {
              this.isloadingEdit = false;
              if(res.data.msg === 'success'){
                this.$message({
                  type: 'success',
                  message: 'Submit successfully'
                })
                this.fetchDogs();
              }
              else{
                this.$message.error("Error when editing")
              }
            }, 2000);

          })
          .catch((error) => console.log("error when editing: ", error))
    },

    getDetailDog: function (id){
      service.get('/api/dogpage/'+id)
          .then((result) =>
          {this.individualData = result.data.data})
    },

    getFormDog: function (id){
      this.getDetailDog(id)
      this.setVisibleDialog()
    },

    getEditForm: function (id){
      this.getDetailDog(id)
      this.setVisibleEditDialog()
    },

    setVisibleDialog : function (){
      this.dialogFormVisible = true
    },

    setVisibleEditDialog : function (){
      this.dialogEditFormVisible = true
    },

    handleSizeChange:function (val){
      this.pageSize = val
      this.currentPage = 1;
      this.fetchDogs()
    },
    handleCurrentChange:function (val){
      this.currentPage=val
      this.fetchDogs()
    },

    transofmDateFormat: function (inputDate, showTime=0) {
      // Ensure inputDate is a valid date string
      const date = new Date(inputDate);

      // Get date and time components
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      // Format the date and time components
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      // Combine the formatted date and time
      if (showTime === 0){
        return `${formattedDate}`;
      }
      return `${formattedDate}  ${formattedTime}`;
    },

    fetchDogs:function (){
      this.isloadingTable = true;

      const {id, gender, adoptStatus} = this.searchForm
      const params={
        page: this.currentPage,
        pageSize:this.pageSize,
        id,
        gender,
        adoptStatus
      };

      service.get('/api/dogpage', {params:params})
          .then((result) => {
            this.tableData = result.data.data.rows;
            this.total = result.data.data.total
          }).then(() => {
            setTimeout(() => {
              this.isloadingTable = false;
            }, 1000)
      })
          .catch((error) => console.error('Error when fetching data: ', error))
    }
  },
  mounted() {
    // send async request to get data
    this.fetchDogs()


  }
}
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #F56C6C;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}

.label-bold {
  font-weight: bold;
  color: #333;
}


</style>
