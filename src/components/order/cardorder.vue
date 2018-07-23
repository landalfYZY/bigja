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
        // {
        //   title: "姓名/货号",
        //   key: "waterNumber",
        //   render(h, params) {
        //     return h("div", params.row.concatName+'/'+params.row.waterNumber);
        //   }
        // },
        { title: "用户Id", key: "userId" },
        { title: "剩余数量", key: "count" },
        { title: "创建时间", key: "createTime" },
        
        
      ],
      data: [],
      query: {
        fields: [],
        wheres: [
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
        "usercard/find",
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
