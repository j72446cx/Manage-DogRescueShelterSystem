<template>
	<div>
		<div class="container">
<!--			<div class="handle-box">-->
<!--				<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
<!--					<el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--					<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--				</el-select>-->
<!--				<el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>-->
<!--				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>-->
<!--				<el-button type="primary" :icon="Plus">新增</el-button>-->
<!--			</div>-->


			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="60">
        </el-table-column>
        <el-table-column prop="name" label="Name" width="80">
        </el-table-column>
        <el-table-column prop="age" label="Age" width="60">
        </el-table-column>
        <el-table-column prop="species" label="Species" width="150">
        </el-table-column>
        <el-table-column prop="gender" label="Gender" width="90">
        </el-table-column>
        <el-table-column prop="adoptStatus" label="Adopt Status" width="120">
        </el-table-column>
        <el-table-column prop="entryDate" label="Entry Date" width="180">
        </el-table-column>
        <el-table-column prop="lastUpdateTime" formatter="" label="Latest Update" width="170">
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
      <el-form ref="form" :model="individualData" label-width="150px">

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
          <el-button type="primary" @click="onSubmitEdit" >Submit</el-button>
          <el-button type="primary" @click="dialogEditFormVisible = false">Cancel</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>
		<!-- 编辑弹出框 -->
	</div>
</template>


<script>
import axios from 'axios'
import {ElMessage, ElMessageBox} from "element-plus";

export default{

  data(){
    return {
      tableData : [],
      individualData : [],
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
      total:1000
    }
  },
  methods: {
    onSubmitSearch: function (){
      this.searchForm =  this.transformEntryDate(this.searchForm)
      this.fetchDogs()
      alert("Searching "+ JSON.stringify(this.searchForm))
    },

    onSubmitAdd: function (){
      alert("Adding: " + JSON.stringify(this.infoForm))
      this.addDog()
      this.dialogAddFormVisible = false
      location.reload()
    },

    onSubmitEdit: function (){
      alert("Editing : " + JSON.stringify(this.individualData))
      this.editDog()
      this.dialogEditFormVisible = false
      location.reload()
    },

    deleteDog: function (id){
      axios.delete('/dogpage/delete/' + id)
          .then(() =>
          {this.tableData = this.tableData.filter((dog) => dog.id !== id)
            location.reload()
            alert("Deleted successfully!")})
          .catch((error) => alert("Delete Failed, with error: " + error))
    },

    handleDelete: function(id){
      // 二次确认删除
      ElMessageBox.confirm('Do you want to delete？', 'Warning', {
        type: 'warning'
      })
          .then(() => {
            ElMessage.success('Delete successfully');
            axios.delete('/api/dogpage/delete/' + id);
          })
          .catch((er) => {
            console.error(er)});
    },

    addDog: function (){
      axios.post('/api/dogpage/save', this.infoForm)
          .then(()=> alert("Added successfully!"))
          .catch((error) => alert("Add Failed, with error: " + error))
    },

    editDog: function (){
      axios.put('/api/dogpage/edit/', this.individualData)
          .then(()=> alert("Edited successfully!"))
          .catch((error) => alert("Edit Failed, with error: " + error))
    },

    getDetailDog: function (id){
      axios.get('/api/dogpage/'+id)
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

    setVisibleAddDialog: function (){
      this.dialogAddFormVisible = true
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

    transformEntryDate:function (originalData){
      const transofmedData = {...originalData}
      if (transofmedData.entryDate){
        const [entryStartDate, entryEndDate] = transofmedData.entryDate;

        transofmedData.entryStartDate = entryStartDate
        transofmedData.entryEndDate = entryEndDate
        delete transofmedData.entryDate
      }

      return transofmedData
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

    // upload Img
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    fetchDogs:function (){
      const {id, gender, adoptStatus} = this.searchForm
      const params={
        page: this.currentPage,
        pageSize:this.pageSize,
        id,
        gender,
        adoptStatus
      };

      axios.get('/api/dogpage', {params:params})
          .then((result) => {
            this.tableData = result.data.data.rows;
            this.total = result.data.data.total
            for (let i = 0; i < this.total; i++) {
              this.tableData[i].entryDate = this.transofmDateFormat(this.tableData[i].entryDate);
              this.tableData[i].lastVaccineDate = this.transofmDateFormat(this.tableData[i].lastVaccineDate);
              this.tableData[i].adoptedDate = this.transofmDateFormat(this.tableData[i].adoptedDate);
              this.tableData[i].lastUpdateTime = this.transofmDateFormat(this.tableData[i].lastUpdateTime, 1);
            }
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

<!--<script setup lang="ts" name="basetable">-->
<!--import { ref, reactive } from 'vue';-->
<!--import { ElMessage, ElMessageBox } from 'element-plus';-->
<!--import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';-->
<!--import {fetchDogData} from "../api/index";-->
<!--import axios from "axios";-->

<!--interface TableItem{-->
<!--  id: number;-->
<!--  name: string;-->
<!--  age: number;-->
<!--  imgURL: string;-->
<!--  species: string;-->
<!--  intro:string;-->
<!--  gender:string;-->
<!--  lastFeedTime:string;-->
<!--  entryDate:string;-->
<!--  lastUpdateTime:string;-->
<!--  adoptStatus:string;-->
<!--  medicalStatus:string;-->
<!--  medicalHistory:string;-->
<!--  adoptedDate:string;-->
<!--  lastVaccineDate:string;-->
<!--}-->
<!--let pageSize = 5;-->
<!--let currentPage = 1;-->
<!--const tableData = ref<TableItem[]>([]);-->
<!--const getData = () => {-->
<!--  const params = {-->
<!--    page: currentPage,-->
<!--    pageSize: pageSize-->
<!--  }-->
<!--  axios.get('/api/dogpage',{params:params})-->
<!--      .then((result) => {-->
<!--        tableData.value = result.data.data.rows;-->
<!--        pageTotal.value = result.data.data.total;-->
<!--      })-->
<!--};-->
<!--getData();-->
<!--const handleSizeChange = (val: number) => {-->
<!--  pageSize = val-->
<!--  currentPage = 1;-->
<!--  getData()-->
<!--};-->
<!--const handleCurrentChange =  (val: number) => {-->
<!--  currentPage=val-->
<!--  getData()-->
<!--};-->
<!--// const query = reactive({-->
<!--// 	address: '',-->
<!--// 	name: '',-->
<!--// 	pageIndex: 1,-->
<!--// 	pageSize: 10-->
<!--// });-->

<!--const pageTotal = ref(0);-->
<!--// 获取表格数据-->



<!--// // 查询操作-->
<!--// const handleSearch = () => {-->
<!--// 	query.pageIndex = 1;-->
<!--// 	getData();-->
<!--// };-->
<!--// // 分页导航-->
<!--// const handlePageChange = (val: number) => {-->
<!--// 	query.pageIndex = val;-->
<!--// 	getData();-->
<!--// };-->
<!--//-->
<!--// // 删除操作-->
<!--const handleDelete = (index: number) => {-->
<!--	// 二次确认删除-->
<!--	ElMessageBox.confirm('Do you want to delete？', 'Warning', {-->
<!--		type: 'warning'-->
<!--	})-->
<!--		.then(() => {-->
<!--			ElMessage.success('Delete successfully');-->
<!--			axios.delete('/api/dogpage/' + index);-->
<!--		})-->
<!--		.catch(() => {});-->
<!--};-->


<!--//-->
<!--// // 表格编辑时弹窗和保存-->
<!--// const editVisible = ref(false);-->
<!--// let form = reactive({-->
<!--// 	name: '',-->
<!--// 	address: ''-->
<!--// });-->
<!--// let idx: number = -1;-->
<!--// const handleEdit = (index: number, row: any) => {-->
<!--// 	idx = index;-->
<!--// 	form.name = row.name;-->
<!--// 	form.address = row.address;-->
<!--// 	editVisible.value = true;-->
<!--// };-->
<!--// const saveEdit = () => {-->
<!--// 	editVisible.value = false;-->
<!--// 	ElMessage.success(`修改第 ${idx + 1} 行成功`);-->
<!--// 	tableData.value[idx].name = form.name;-->
<!--// 	tableData.value[idx].address = form.address;-->
<!--// };-->

<!--</script>-->

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
</style>
