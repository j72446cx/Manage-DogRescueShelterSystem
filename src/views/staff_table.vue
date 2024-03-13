<template>
  <div>
    <div class="container">
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="Staff ID" width="80"></el-table-column>
        <el-table-column label="Full Name">
          <template v-slot="scope">
            {{scope.row.firstName}}  {{scope.row.middleName}} {{scope.row.lastName}}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="role" label="Role"></el-table-column>
        <el-table-column prop="job" label="Job" width="150"></el-table-column>

        <el-table-column label="Operation" width="320px">
          <template v-slot="scope">
            <el-button icon="Search" round @click="dialog_detail_staff(scope.row.id)"></el-button>
            <el-button icon="Edit" type="primary" round @click="dialog_edit(scope.row)"></el-button>
            <el-button icon="Delete" round type="danger" @click="dialog_confirmation(scope.row.id)"></el-button>
            <el-button icon="sell" round type="warning" @click="dog_current_search(scope.row.id)"></el-button>
            <el-button icon="promotion" round type="success" @click="sendMessageToStaff(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog v-model="dialog_staff_visible" title="Detailed Staff information">
      <el-form  v-if="this.step===0" class="label-bold">
        <el-form-item label="Staff ID: ">
          {{individualData.id}}
        </el-form-item>

        <el-form-item label="TEL: ">
          {{individualData.phoneNumber}}
        </el-form-item>

        <el-form-item label="Full Name: ">
          {{individualData.firstName}} {{individualData.middleName}} {{individualData.lastName}}
        </el-form-item>

        <el-form-item label="Date Of Birth: ">
          {{transofmDateFormat(individualData.dateOfBirth, 0)}}
        </el-form-item>

        <el-form-item label="Gender: ">
          {{individualData.gender}}
        </el-form-item>


        <el-form-item label="Email: ">
          {{individualData.email}}
        </el-form-item>


      <el-form-item label="Address: ">
        {{individualData.address}}
      </el-form-item>

      <el-form-item label="Postcode: ">
        {{individualData.postCode}}
      </el-form-item>

        <el-form-item label="Emergency Contact: ">
          {{individualData.emergency_Contact}}
        </el-form-item>

        <el-form-item label="Identification: ">
          {{individualData.identification}}
        </el-form-item>

      </el-form>


      <el-form v-if="step===1" class="label-bold">

        <el-form-item label="Role: ">
          {{individualData.role}}
        </el-form-item>

        <el-form-item label="Job: ">
          {{individualData.job}}
        </el-form-item>

        <el-form-item label="Entry Date: ">
          {{transofmDateFormat(individualData.entryDate)}}
        </el-form-item>

        <el-form-item label="Contract Start: ">
          {{transofmDateFormat(individualData.contractStartDate)}}
        </el-form-item>

        <el-form-item label="Contract End: ">
          {{transofmDateFormat(individualData.contractEndDate)}}
        </el-form-item>

        <el-form-item label="Contract Image: ">
          {{individualData.contractImg}}
        </el-form-item>

        <el-form-item label="Salary: ">
          {{individualData.salary}} £
        </el-form-item>


      </el-form>

      <el-button type="primary" round @click="step++" v-if="step<1">Next</el-button>
      <el-button type="info" round @click="step--" v-if="step>0">Back</el-button>

    </el-dialog>

    <el-dialog title="Confirmation" v-model="dialog_confirmation_visible">
      <span> Are you sure you want to delete the staff?</span>
      <br><br><br>
      <el-button type="success" round @click="onDelete">Yes, I confirm and submit now</el-button>
      <el-button type="info" round @click="this.dialog_confirmation_visible=false">I need double check...</el-button>
    </el-dialog>

    <el-dialog title="Edit Information" v-model="dialog_edit_visible">
      <el-form class="label-bold" label-width="200px">
        <el-form-item></el-form-item>
        <el-form-item label="Role: ">
            <el-select v-model="individualData.role">
              <el-option v-for="items in optionsRole"
                         :key="items.value"
                         :label="items.label"
                         :value="items.value"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="Job: ">
          <el-select v-model="individualData.job">
            <el-option v-for="items in optionsJob"
                       :key="items.value"
                       :label="items.label"
                       :value="items.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Contract Start Date: ">

          <el-date-picker
              v-model="individualData.contractStartDate"
              type="date"
          >
          </el-date-picker>

        </el-form-item>

        <el-form-item label="Contract End Date: ">
          <el-date-picker
            v-model="individualData.contractEndDate"
            type="date"></el-date-picker>

        </el-form-item>

        <el-form-item label="Salary: ">
          <el-input v-model="individualData.salary"></el-input>
        </el-form-item>
        <br><br><br>
        <el-button type="primary" round @click="onEdit">Submit</el-button>
        <el-button type="info" round @click="dialog_edit_visible = false">Cancel</el-button>

      </el-form>
    </el-dialog>

    <el-dialog title="Dog Assignment Management" v-model="dog_ass_dialog">
      <el-dialog title="Dog Assignment" v-model="inner_dog_ass">
        <el-form>
          <el-form-item label="Assign to Dog with ID: " style="width: 40%">
            <el-input v-model="temp_dog_id"></el-input>
          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" @click="assign">Submit</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

      <el-dialog title="Confirmation" v-model="inner_dog_del">
        <span> Are you sure you want to delete this assignment?</span>
        <br><br>
        <el-button type="primary" @click="delete_assign" round>Yes, I confirm and submit</el-button>
        <el-button type="info" round @click="inner_dog_del = false">Cancel</el-button>
      </el-dialog>


      <el-button type="primary" style="font-weight: bold" icon="plus" @click="this.inner_dog_ass= true">Add Assignment</el-button>
      <br>
      <el-form v-for="items in dog_current">
        <el-divider></el-divider>
        <el-form-item label="Dog Name: ">
          <span>{{items.name}}</span>
        </el-form-item>
        <el-form-item label="Dog ID: ">
          <span>{{items.id}}</span>
        </el-form-item>
        <el-form-item>
          <el-button round icon="delete" type="danger" @click="delete_pre(items.id)">Delete Assignment</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import service from "../utils/request.ts";
export default {
  data(){
    return {
      tableData : [],
      individualData : [],
      currentPage : 1,
      pageSize : 6,
      total:1000,

      step: 0,
      temp_id: '',

      dialog_staff_visible: false,
      dialog_confirmation_visible: false,
      dialog_edit_visible: false,

      optionsRole: [{
        value: 'admin',
        label: 'admin'
      },
        {
          value: 'employee',
          label: 'employee'
        }
      ],

      optionsJob: [{
        value: 'Groomer',
        label: 'Groomer'
      },
        {
          value: 'Behavioral Trainer',
          label: 'Behavioral Trainer'
        },
        {
          value: 'Caretaker',
          label: 'Caretaker'
        },
        {
          value: 'Vet',
          label: 'Vet'
        }
      ],



      dog_current: [],
      dog_ass_dialog: false,
      inner_dog_ass :false,
      inner_dog_del: false,

      temp_dog_id: ''




    }
  },

  methods:{

    delete_pre(id){

      this.temp_dog_id = id;
      this.inner_dog_del = true;

    },

    delete_assign(){
      service.delete("api/interaction/deleteAssign", {params: {dog_id: this.temp_dog_id, staff_id: this.temp_id}}).then((res) => {
        if (res.data.msg === 'success'){
          this.$message({
            type: 'success',
            message: 'Delete assignment successfully'
          })
          this.inner_dog_del = false;
          this.dog_ass_dialog = false;

        }

        else{
          this.$message.error("Error when assigning dogs, please contact IT service")
        }
      }).catch((err) => {console.log("Error when assigning: {}" , err)})

    },

    sendMessageToStaff(id_to_staff){
      this.$router.push({path: '/tabs', query: {tab: 'third',id_to_staff: id_to_staff}})

    },


    assign(){

      service.post('api/interaction/assign/'+this.temp_dog_id+"/"+this.temp_id ).then((res) => {
        if (res.data.msg === 'success'){
          this.$message({
            type: 'success',
            message: 'Assignment Completed'
          })
          this.inner_dog_ass = false;
          this.dog_ass_dialog = false;
        }

        else{
          this.$message.error("Error when assigning dogs, please contact IT service")
        }
      }).catch((err) => {console.log("Error when assigning: {}" , err)})
    },

    dog_current_search(id){
      this.dog_ass_dialog = true;
      this.temp_id = id;
      const temp_dog_current = []
      service.get('api/interaction/staffGetDog/' + this.temp_id).then((res) => {
        res.data.data.forEach((ele) => {
          temp_dog_current.push({id: ele.id, name: ele.name})
        })
      }).then(() => this.dog_current = temp_dog_current)
          .catch((err) => {
        console.log("Error when fetching staff get dog: ", err)
      })

    },

    dialog_edit(row){

      this.individualData = row;
      this.dialog_edit_visible = true;

    },

    dialog_confirmation(id){
      this.temp_id = id;
      this.dialog_confirmation_visible = true;
    },

    dialog_detail_staff(id){
      service.get("api/staffpage/" + id).then((res) => {
        this.individualData =  res.data.data;
      }).then(() => this.dialog_staff_visible = true);
    },

    fetchStaff:function(){
      const param={
        page:this.currentPage,
        pageSize: this.pageSize
      }

      service.get("api/staffpage", {params: param}).then((res) => {
        this.tableData = res.data.data.rows;
        this.total = res.data.data.total;
      }).catch((err) => {
        console.log("Error when fetching staff data: ", err)
      })
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

    handleCurrentChange:function (val){
      this.currentPage=val
      this.fetchStaff()
    },

    onDelete: function (){
        service.delete("api/staffpage/delete/" + this.temp_id).then((res) =>{
          if (res.data.msg === 'success'){
            this.$message({
              type:'success',
              message: 'Staff deleted successfully'
            })
          }
        }).then(() => {
          this.dialog_confirmation_visible = false;
          this.fetchStaff();
        }).catch((err) => this.$message.error("Cannot delete the staff, this is may due to he/she has some works that not cleared yet. If this error still happens, please contact IT service."))
    },

    onEdit(){

      const temp = {
        id: this.individualData.id,
        role: this.individualData.role,
        job: this.individualData.job,
        contractStartDate: this.individualData.contractStartDate,
        contractEndDate: this.individualData.contractEndDate,
        salary: this.individualData.salary
      }

        service.put('api/staffpage/edit', temp).then((res) => {
          if (res.data.msg === 'success'){
            this.$message({
              type: 'success',
              message: 'Edit successfully'
            })
          }
          else{
            this.$message.error("Error when editing, please contact IT service")
          }
        }).then(() => this.dialog_edit_visible = false)
            .catch((err) => {
          console.log("Error when editing : ", err)
        })



    }

  },

  mounted() {
    this.fetchStaff();
  }


}
</script>

<style scoped>

.table {
  width: 100%;
  font-size: 14px;
}

.label-bold {
  font-weight: bold;
  color: #333;
}

</style>