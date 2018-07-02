<template>
    <transition name="el-fade-in-linear">
        <div>
            <div class="panel-between">
                <div class="panel-start item-center">
                    <ButtonGroup>
                        <Button type="ghost" ><Icon type="android-add"></Icon> 发送短信</Button>
                        <Button type="ghost" @click="outputData()"><Icon type="ios-upload-outline"></Icon> 导出数据</Button>
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
                        <Input v-model="search1" placeholder="姓名 查找" @input="search('realName',1)"  @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="3">
                        <Input v-model="search2" placeholder="手机号 查找" @input="search('phone',2)" @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="3">
                        <Select v-model="search3" placeholder="性别 查找" @on-change="search('gender',3),changePageSize()"  @keydown.enter.native="changePageSize()">
                            <Option value="0" >未知</Option><Option value="1" >男</Option><Option value="2" >女</Option>
                        </Select>
                    </Col>
                    <Col :span="3">
                        <Input v-model="search4" placeholder="昵称 查找" @input="search('nickName',4)" @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="3">
                        <Input v-model="search5" placeholder="省份 查找"  @input="search('province',5)" @keydown.enter.native="changePageSize()" /> 
                    </Col>
                    <Col :span="3">
                        <Input v-model="search6" placeholder="城市 查找"  @input="search('city',6)" @keydown.enter.native="changePageSize()" /> 
                    </Col>
                    <Col :span="4">
                        <ButtonGroup>
                            <Button @click="changePageSize()">搜索</Button>
                            <Button @click="clearFilter()">清除筛选</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </div>
            <Table ref="selection" border :columns="columns" :data="data" style="margin-top:15px" :loading="tableLoading"></Table>
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
                    <Button type="primary" @click="importFiles()">确 定</Button>
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
      tableLoading: false,
      user: JSON.parse(sessionStorage.getItem("user")),
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
        { label: "每页 100 条", value: 100 }
      ],
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",search6:'',
      classList: [],
      columns: [
        { type: "selection", width: 60, align: "center" },
        {
          title: "头像",width:75,
          key: "avatarUrl",
          render: (h, params) => {
            var props = { size: "large" };
            if (params.row.avatarUrl) {
              props.src = params.row.avatarUrl;
            } else {
              props.icon = "person";
            }
            var dj = h("Avatar", {
              props: props
            });
            return dj;
          }
        },
        { title: "姓名", key: "realName" },
        { title: "手机号", key: "phone" },
        {
          title: "性别",
          key: "gender",
          render: (h, params) => {
            var gender = "未获取";
            if (params.row.gender) {
              if (params.row.gender == 0) {
                gender = "未知";
              } else if (params.row.gender == 1) {
                gender = "男";
              } else if (params.row.gender == 2) {
                gender = "女";
              }
            }
            return h("span", gender);
          }
        },
        { title: "微信昵称", key: "nickName" },
        { title: "省份", key: "province" },
        { title: "城市", key: "city" },
        { title: "注册时间", key: "createTime" }
      ],
      data: [],
      query: {
        fields: [],
        wheres: [
          {
            value: "appid",
            opertionType: "equal",
            opertionValue: JSON.parse(sessionStorage.getItem("user")).sunwouId
          },
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
  },
  methods: {
    outputData() {
      if(this.data.length == 0){
        this.$Message.warning("无数据可导出");
      }else{
        this.$refs.selection.exportCsv({
          filename:
            "user-" +
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
    clearFilter() {
      var li = ["realName", "phone", "gender", "nickName", "province", "city"];
      for (var i = 0; i < 6; i++) {
        this["search" + parseInt(i + 1)] = "";
        this.search(li[i], parseInt(i + 1));
      }
      this.getList();
    },
    importFiles() {
      if (this.schoolId == "") {
        this.$Message.error("请选择一所学校");
      } else if (this.excelUrl == "") {
        this.$Message.error("请上传excel文件");
      } else {
        $.ajax({
          url: sessionStorage.getItem("API") + "user/import",
          data: { schoolId: this.schoolId, path: this.excelUrl },
          dataType: "json",
          method: "post",
          success(res) {
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

    changePageSize() {
      this.getList();
    },
    changePage(e) {
      this.query.pages.currentPage = e;
      this.getList();
    },
    search(tag, num) {
      var temp = -1;
      for (var i in this.query.wheres) {
        if (this.query.wheres[i].value == tag) {
          temp = i;
        }
      }

      if (temp == -1) {
        if (this["search" + num] != "") {
          this.query.wheres.push({
            value: tag,
            opertionType: "like",
            opertionValue: this["search" + num]
          });
        }
      } else {
        if (this["search" + num] == "") {
          this.query.wheres.splice(temp);
        } else {
          this.query.wheres[temp].opertionValue = this["search" + num];
        }
      }
    },
    getList() {
      this.tableLoading = true;
      $.ajax({
        url: sessionStorage.getItem("API") + "wxuser/find",
        data: { query: JSON.stringify(this.query) },
        method: "post",
        dataType: "json",
        success(res) {
          that.tableLoading = false;
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
