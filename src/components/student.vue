<template>
    <transition name="el-fade-in-linear">
        <div>
            <div class="panel-between">
                <div class="panel-start item-center">
                    <ButtonGroup>
                        <Button type="ghost" @click="deletestu()"><Icon type="trash-a"></Icon> 删除</Button>
                        <Button type="ghost" @click="navTo('/studentAdd')"><Icon type="android-add"></Icon> 添加学生</Button>
                        <Button type="ghost" @click="outputData()"><Icon type="ios-upload-outline"></Icon> 导出数据</Button>
                        <Button type="ghost" @click="studentModel = true"><Icon type="android-add"></Icon> 导入学生</Button>
                    </ButtonGroup>
                    <span class="font-grey" style="margin-left:10px">可以按回车进行筛选</span>
                </div>
                <div class="panel-end">
                    <Select v-model="query.pages.size" style="width:100px;margin-left:20px" @on-change="changePageSize()">
                        <Option v-for="item in pageSizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <div style="margin-top:15px" >
                <Row :gutter="5">
                    <Col :span="3">
                        <Select v-model="search6" placeholder="学校筛选"  @on-change="search('schoolId',6),changePageSize()" @keydown.enter.native="changePageSize()">
                            <Option v-for="(item,index) in schoolList" :value="item.sunwouId" :key="index">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col :span="3">
                        <Input v-model="search1" placeholder="姓名 查找" @input="search('name',1)"  @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="3">
                        <Input v-model="search2" placeholder="身份证 查找" @input="search('sunwouId',2)" @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="3">
                        <Input v-model="search3" placeholder="性别 查找" @input="search('gender',3)" @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="3">
                        <Input v-model="search4" placeholder="入学年份 查找" @input="search('schoolTime',4)" @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="3">
                        <Input v-model="search5" placeholder="班级 查找"  @input="search('cl',5)" @keydown.enter.native="changePageSize()" /> 
                    </Col>
                    <Col :span="4">
                        <ButtonGroup>
                            <Button @click="changePageSize()">搜索</Button>
                            <Button @click="clearFilter()">清除筛选</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </div>
            <Table ref="selection" border :columns="columns" :data="data" style="margin-top:15px" @on-selection-change="getSelected" :loading="tableLoading"></Table>
            <div class="panel-end" style="margin-top:15px">
                <Page :total="total" size="small" show-total show-elevator :page-size="query.pages.size" @on-change="changePage"></Page>
            </div>

    
            <el-dialog title="导入学生" :visible.sync="studentModel" width="30%" :before-close="handleClose">
                <Form  label-position="top">
                    <FormItem label="选择一所单位">
                        <Select v-model="schoolId" >
                            <Option v-for="item in schoolList" :value="item.sunwouId" :key="item.sunwouId">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="上传EXCEL文件" >
                        <Upload :action="api+'file/fileup'" :data="{userId:user.sunwouId}" :on-success="fileSuccess">
                            <Button type="ghost" icon="ios-cloud-upload-outline">点击上传</Button>
                        </Upload>
                    </FormItem>
                </Form>
                <span slot="footer" class="dialog-footer">
                    <Button @click="studentModel = false">取 消</Button>
                    <Button type="primary" :loading="asloading" @click="importFiles()">确 定</Button>
                </span>
            </el-dialog>

            <el-dialog :title="'修改学生信息 :'+tempValue.ids" :visible.sync="stuModel" width="400px" >
                <Form  label-position="top">
                    <FormItem label="姓名">
                        <Input placeholder="姓名" v-model="tempValue.name" />
                    </FormItem>
                    <FormItem label="入学年份" >
                        <Input placeholder="入学年份" v-model="tempValue.schoolTime" />
                    </FormItem>
                    <FormItem label="班级" >
                        <Input placeholder="班级"  v-model="tempValue.cl" />
                    </FormItem>
                </Form>
                <span slot="footer" class="dialog-footer">
                    <Button @click="stuModel = false">取 消</Button>
                    <Button type="primary" @click="updateStudent()">保存修改</Button>
                </span>
            </el-dialog>
        </div>
    </transition>
</template>

<script>
var that;
import carAdd from "./carouselAdd.vue";
export default {
  components: {
    carAdd
  },
  data() {
    return {
      asloading:false,
      tempValue:{
        ids:'',
        schoolTime:'',
        name:'',
        cl:''
      },
      stuModel:false,
      selection:[],
      user: JSON.parse(sessionStorage.getItem("user")),
      tableLoading:false,
      api: sessionStorage.getItem("API"),
      schoolId: "",
      schoolList: [],
      excelUrl: "",
      studentModel: false,
      total: 0,
      carouselModel: false,
      pageSizeList: [
        { label: "每页 10 条", value: 10 },
        { label: "每页 20 条", value: 20 },
        { label: "每页 30 条", value: 30 },
        { label: "每页 50 条", value: 50 },
        { label: "每页 100 条", value: 100 },
        { label: "每页 500 条", value: 500 },
        { label: "每页 1000 条", value: 1000 },
        { label: "每页 5000 条", value: 5000 },
        { label: "每页 10000 条", value: 10000 }
      ],
      search1: "",search2: "",search3: "",search4: "",search5: "",search6:'',
      classList: [],
      columns: [
        { type: "selection", width: 60, align: "center" },
        { title: "姓名", key: "name" },
        { title: "身份证", key: "sunwouId" },
        { title: "性别", key: "gender", },
        { title: "入学年份", key: "schoolTime" },
        { title: "班级", key: "cl" },
        { title: "创建时间", key: "createTime" },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("ButtonGroup", [
              h(
                "Button",
                {
                  props: { type: "ghost", icon: "ios-compose-outline" },
                  on: {
                    click: () => {
                      that.stuModel = true
                      that.tempValue = {
                        ids:params.row.sunwouId,
                        name:params.row.name,
                        schoolTime:params.row.schoolTime,
                        cl:params.row.cl
                      }
                    }
                  }
                },
                "编辑"
              ),
              
            ]);
          }
        }
      ],
      data: [],
      query: {
        fields: [],
        wheres: [
          {value:JSON.parse(sessionStorage.getItem('user')).appid ? 'appid':'schoolId',opertionType:'equal',opertionValue:JSON.parse(sessionStorage.getItem('user')).sunwouId},
          { value: "isDelete", opertionType: "equal", opertionValue: false }
        ],
        sorts: [{ value: "createTime", asc: false }],
        pages: {
          currentPage: 1,
          size: 20
        }
      }
    };
  },
  mounted() {
    that = this;
    that.getList();
    that.getSchool();
  },
  methods: {
    updateStudent(){
      $.ajax({
        url: sessionStorage.getItem("API") + "user/update",
        data: this.tempValue,
        dataType: "json",
        method: "post",
        success(res) {
          that.stuModel = false;
          if (res.code) {
            that.$Notice.success({
              title: "修改成功"
            });
            that.getList();
          } else {
            that.$Notice.error({
              title: "修改失败"
            });
          }
        }
      });
    },
    getSelected(e) {
      var li = [];
      for (var i in e) {
        li.push(e[i].sunwouId);
      }
      that.selection = li;
    },
    deletestu(){
      if (this.selection.length == 0) {
        this.$Notice.warning({
          title: "请选择删除项"
        });
      } else {
        that.$Modal.confirm({
          title: "警告",
          content: "<p>此操作将永久删除改信息，是否继续？</p>",
          onOk() {
            $.ajax({
              url: sessionStorage.getItem("API") + "user/update",
              data: {
                ids: that.selection.toString(),
                isDelete: true
              },
              dataType: "json",
              method: "post",
              success(res) {
                that.studentModel = false;
                if (res.code) {
                  that.$Notice.success({
                    title: res.msg.replace('更新','删除')
                  });
                  that.getList();
                } else {
                  that.$Notice.error({
                    title: res.msg
                  });
                }
              }
            });
          },
          onCancel() {
            that.$Message.info("已取消");
          }
        });
      }
    },
    outputData() {
      if(this.data.length == 0){
        this.$Message.warning("无数据可导出");
      }else{
        this.$refs.selection.exportCsv({
          filename:
            "student-" +
            new Date().getFullYear() +
            (new Date().getMonth() + 1) +
            new Date().getDate(),
          columns: this.columns,
          data: this.data
        });
      }
      
    },
    handleClose() {
      this.studentModel = false;
    },
    clearFilter(){
      var li = ['name','sunwouId','gender','schoolTime','cl','schoolId']
      for(var i=0;i<6;i++){
          this['search'+parseInt(i+1)] = '';
          this.search(li[i],parseInt(i+1))
      }
      this.getList();
    },
    importFiles() {
      if (this.schoolId == "") {
        this.$Message.error("请选择一所学校");
      } else if (this.excelUrl == "") {
        this.$Message.error("请上传excel文件");
      } else {
        this.asloading = true
        $.ajax({
          url: sessionStorage.getItem("API") + "user/import",
          data: { schoolId: this.schoolId, path: this.excelUrl },
          dataType: "json",
          method: "post",
          success(res) {
            that.asloading = false;
            that.handleClose();
            if (res.code) {
              that.$Message.success(res.msg);
              that.getList();
            } else {
              that.$Message.error(res.msg);
            }
          }
        });
      }
    },
    fileSuccess(e) {
      that.excelUrl = e.msg;
    },
    getSchool() {
      var query = {
            fields: [],
            wheres: [
              { value: "isDelete", opertionType: "equal", opertionValue: false }
            ],
            sorts: [{ value: "createTime", asc: false }],
            pages: {
              currentPage: 1,
              size: 10000
            }
          }
      if(!JSON.parse(sessionStorage.getItem('user')).appid){
        query.wheres.push({value:'sunwouId',opertionType:'equal',opertionValue:JSON.parse(sessionStorage.getItem('user')).sunwouId})
      }
      $.ajax({
        url: sessionStorage.getItem("API") + "school/find",
        data: {
          query: JSON.stringify(query)
        },
        method: "post",
        dataType: "json",
        success(res) {
          if (res.code) {
            that.schoolList = res.params.msg;
          }
        }
      });
    },
    changePageSize() {
      this.getList();
    },
    changePage(e) {
      this.query.pages.currentPage = e;
      this.getList();
    },
    search(tag,num) {
      var temp = -1;
      for (var i in this.query.wheres) {
        if (this.query.wheres[i].value == tag) {
          temp = i;
        }
      }
      if (temp == -1) {
        this.query.wheres.push({
          value: tag,
          opertionType: typeof this['search'+num] == 'boolean' ? "equal":'like',
          opertionValue: this['search'+num]
        });
      } else {
        this.query.wheres[temp].opertionValue = this['search'+num];
      }
    },
    getList() {
      this.tableLoading = true
      $.ajax({
        url: sessionStorage.getItem("API") + "user/find",
        data: { query: JSON.stringify(this.query) },
        method: "post",
        dataType: "json",
        success(res) {
          that.tableLoading = false
          if (res.code) {
            that.data = res.params.msg;
            that.total = res.params.total;
          }
        }
      });
    },
    navTo(path) {
      this.$router.push({ path: path });
    }
  }
};
</script>
