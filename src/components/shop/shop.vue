<template>
    <transition name="el-fade-in-linear">
        <div>
            <div class="panel-between">
                <div class="panel-start item-center">
                    <ButtonGroup>
                        
                        <Button type="ghost" ><Icon type="trash-a"></Icon> 删除</Button>
                        <Button type="ghost" @click="navTo('/shopInsert')"><Icon type="android-add"></Icon> 新增店铺</Button>
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
            
                    <Col :span="4">
                        <Input v-model="search1" placeholder="店铺 查找" @input="search('shopName',1)"  @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="4">
                        <Input v-model="search2" placeholder="电话 查找" @input="search('phone',2)" @keydown.enter.native="changePageSize()" />
                    </Col>
                    <Col :span="4">
                        <Input v-model="search3" placeholder="地址 查找" @input="search('address',3)" @keydown.enter.native="changePageSize()" />
                    </Col>
                    
                    <Col :span="5">
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
            
        </div>
    </transition>
</template>

<script>
var that;
export default {
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
        { type: "selection", width: 60, align: "center" },
        {
          title: "图片",
          key: "shopImage",
          render: (h, params) => {
            return h("Avatar", {
              props: { src: params.row.shopImage, size: "large" }
            });
          }
        },
        { title: "店名", key: "shopName" },
        { title: "电话", key: "phone" },
        {
          title: "营业状态",
          render(h, params) {
            return h("i-switch", {
              props: { value: params.row.openStatus, size: "small" },
              on: {
                "on-change"() {
                  that.changeUpdate(
                    params.row.sunwouId,
                    "openStatus",
                    !params.row.openStatus
                  );
                }
              }
            });
          }
        },
        {
          title: "接单模式",
          render(h, params) {
            return h("i-switch", {
              props: { value: params.row.getMode, size: "small" },
              on: {
                "on-change"() {
                  that.changeUpdate(
                    params.row.sunwouId,
                    "getMode",
                    !params.row.getMode
                  );
                }
              }
            });
          }
        },
        {
          title: "配送模式",
          render(h, params) {
            return h("i-switch", {
              props: {
                value: params.row.sendMode,
                size: "small"
              },
              on: {
                "on-change"() {
                  that.changeUpdate(
                    params.row.sunwouId,
                    "sendMode",
                    !params.row.sendMode
                  );
                }
              }
            });
          }
        },
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
                  props: { type: "ghost", size: "small" },
                  on: {
                    click() {
                      that.navTo("/shopDetail",{id:params.row.sunwouId});
                    }
                  }
                },
                "管理店铺"
              ),
            //   h(
            //     "Button",
            //     {
            //       props: { type: "ghost", size: "small" },
            //       on: {
            //         click() {
            //           that.navTo("/goods");
            //         }
            //       }
            //     },
            //     "商品"
            //   )
            ]);
          }
        }
      ],
      data: [],
      query: {
        fields: [],
        wheres: [
             { value: "userId", opertionType: "equal", opertionValue: sessionStorage.getItem("userId") },
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
  mounted() {
    that = this;
    that.getList();
  },
  methods: {
    changeUpdate(id, name, value) {
      if (id != null) {
        that.doUpdate(id, name, value);
      } else {
        if (this.selection.length > 0) {
          that.doUpdate(this.selection.toString(), name, value);
        } else {
          that.$Message.info("还没选店铺呢");
        }
      }
    },
    doUpdate(id, name, value) {
      var data = { ids: id };
      data[name] = value;
      this.com.post(this, "shop/update", data, function(res) {
        if (res.code) {
          that.$Notice.success({
            title: res.msg
          });
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
      var li = ["shopName", "phone", "address"];
      for (var i = 0; i < 3; i++) {
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
        "shop/find",
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
    navTo(path,query) {
      this.$router.push({ path: path ,query:query});
    }
  }
};
</script>
