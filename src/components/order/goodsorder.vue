<template>
    <transition name="el-fade-in-linear">
        <div>
            <div class="panel-between">
                <div class="panel-start item-center">
                    <ButtonGroup>
                        <!-- <Button type="ghost" @click="navTo('/orgnizationUserInsert')"><Icon type="android-add"></Icon> 新增员工</Button> -->
                        <Button type="ghost" @click="outputData()"><Icon type="ios-upload-outline"></Icon> 导出数据</Button>
                    </ButtonGroup>
                    <span class="font-grey" style="margin-left:10px">可以按回车进行筛选</span>
                </div>
                <div class="panel-end">
                    <Button type="ghost" @click="getList()">刷新</Button>
                    <Select v-model="query.pages.size" style="width:100px;margin-left:20px" @on-change="changePageSize()">
                        <Option v-for="item in pageSizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <Menu mode="horizontal" theme="light" active-name="交易完成" @on-select="tabsClick">
                <MenuItem name="交易完成">
                    交易完成
                </MenuItem>
                <MenuItem name="待接手">
                    待接手
                </MenuItem>
                <MenuItem name="制作中">
                    制作中
                </MenuItem>
                <MenuItem name="待取货">
                    待取货
                </MenuItem>
                
            </Menu>
            <Table ref="selection" border :columns="columns" :data="data" style="margin-top:15px" @on-selection-change="getSelected" :loading="tableLoading"></Table>
            <div class="panel-end" style="margin-top:15px">
                <Page :total="total" size="small" show-total show-elevator :page-size="query.pages.size" @on-change="changePage"></Page>
            </div>
            
        </div>
    </transition>
</template>

<script>
var that;
import tableexpend from "../template/tableexpend";
export default {
  components: {
    tableexpend
  },
  data() {
    return {
      tableLoading: false,
      total: 0,
      selection: [],
      pageSizeList: this.com.config.pageSizeList,
      search1: "",
      search2: "",
      search3: "",
      columns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(tableexpend, {
              props: {
                row: params.row.ops
              }
            });
          }
        },
        { type: "selection", width: 60, align: "center" },
        {
          title: "姓名/货号",
          key: "waterNumber",
          render(h, params) {
            return h("div", params.row.concatName+'/'+params.row.waterNumber);
          }
        },
        { title: "取货方式", key: "getType" },
        { title: "商品数量", key: "productCount" },
        { title: "订单金额", key: "total" },
        { title: "状态", key: "status" },
        { title: "创建时间", key: "createTime" },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            var te = null;
            if (params.row.status == "待接手") {
              te = h(
                "Button",
                {
                  props: { type: "ghost", size: "small" },
                  on: {
                    click() {
                      that.accept(params.row.sunwouId, "accept");
                    }
                  }
                },
                "接单"
              );
            } else if (params.row.status == "制作中") {
              te = h(
                "Button",
                {
                  props: { type: "ghost", size: "small" },
                  on: {
                    click() {
                      that.accept(params.row.sunwouId, "noti");
                    }
                  }
                },
                "制作完成"
              );
            } else if (params.row.status == "待取货") {
              te = h(
                "Button",
                {
                  props: { type: "ghost", size: "small" },
                  on: {
                    click() {
                      that.accept(params.row.sunwouId, "complete");
                    }
                  }
                },
                "完成交易"
              );
            }
            var sm = h("ButtonGroup", [te]);
            return sm;
          }
        }
      ],
      data: [],
      query: {
        fields: [],
        wheres: [
        //   { value: "shopId", opertionType: "equal", opertionValue: "" },
          { value: "status", opertionType: "equal", opertionValue: "交易完成" },
          { value: "isDelete", opertionType: "equal", opertionValue: false }
        ],
        sorts: [{ value: "createTime", asc: false }],
        pages: {
          currentPage: 1,
          size: 10
        }
      }
    };
  },
  watch:{
      $route(){
          this.getList();
      }
  },
  mounted() {
    that = this;
    that.getList();
  },
  methods: {
    tabsClick(e) {
      for (var i in this.query.wheres) {
        if (this.query.wheres[i].value == "status") {
          this.query.wheres[i].opertionValue = e;
        }
      }
      this.getList();
    },
    accept(id, name) {
      var data = {
        orderId: id
      };
      if (name == "accept") {
        data.acceptId = JSON.parse(sessionStorage.getItem("userId"));
      }
      this.com.post(this, "order/" + name, data, function(res) {
        if (res.code) {
          that.$Notice.success({
            title: res.msg
          });
          that.getList();
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

    outputData() {
      if (this.data.length == 0) {
        this.$Message.warning("无数据可导出");
      } else {
        this.$refs.selection.exportCsv({
          filename:
            "shop-" +
            new Date().getFullYear() +
            (new Date().getMonth() + 1) +
            new Date().getDate(),
          columns: this.columns,
          data: this.data
        });
      }
    },
    clearFilter() {
      var li = ["name", "type"];
      for (var i = 0; i < 2; i++) {
        this["search" + parseInt(i + 1)] = "";
        this.search(li[i], parseInt(i + 1));
      }
      this.getList();
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
        this.query.wheres.push({
          value: tag,
          opertionType:
            typeof this["search" + num] == "boolean" ? "equal" : "like",
          opertionValue: this["search" + num]
        });
      } else {
        this.query.wheres[temp].opertionValue = this["search" + num];
      }
    },
    getList() {
      this.tableLoading = true;
      this.com.post(
        this,
        "order/find",
        { query: JSON.stringify(this.query) },
        function(res) {
          if (res.code) {
            that.data = res.params.msg;
            that.total = res.params.total;
          }
        },
        "tableLoading"
      );
    },
    navTo(path, query) {
      this.$router.push({ path: path, query: query });
    }
  }
};
</script>
