<template>
    <div>
        <div class="panel-between" style="margin-bottom:20px">
            <div class="panel-start item-center">
                <ButtonGroup>
                    <Button type="ghost" @click="dialogTitle = '新增优惠',tempIndex=-1,centerDialogVisible = true"><Icon type="android-add"></Icon> 新增优惠</Button>
                </ButtonGroup>
            </div>
        </div>
        <Table border :columns="columns" :data="fullReduce"></Table>
        <Modal v-model="centerDialogVisible" :title="dialogTitle"
                width="400" @on-ok="onDialogSubmit(tempIndex)">
                <Form label-position="top">
                    <FormItem label="满">
                        <Input v-model="full" placeholder="满多少价格" />
                    </FormItem>
                    <FormItem label="减">
                        <Input v-model="reduce" placeholder="减多少价格" />
                    </FormItem>
                </Form>
        </Modal>
    </div>
</template>
<style>
.sfk:hover {
  background: #f3f3f3;
}
</style>

<script>
var that;
export default {
  data() {
    return {
      columns: [
        {
          title: "满",
          key: "full"
        },
        {
          title: "减",
          key: "reduce"
        },
        {
          title: "操作",
          render(h,params){
              return h("ButtonGroup",[
                  h("Button",{
                      props:{ type:'primary',size:"small" },
                      on:{
                          click(){
                              that.centerDialogVisible = true;
                              that.tempIndex = -2;
                              that.flag = params.index;
                              that.full = params.row.full;
                              that.reduce = params.row.reduce;
                              that.dialogTitle = "修改"
                          }
                      }
                  },"修改"),
                  h("Button",{
                      props:{ type:'error',size:"small" },
                      on:{
                          click(){
                              that.onDialogSubmit(params.index)
                          }
                      }
                  },"删除"),
              ])
          }
        }
      ],
      shopDetail: "",
      tempIndex: -1,
      flag: 0,
      centerDialogVisible: false,
      dialogTitle: "新增地址",
      full: "",
      reduce: "",
      fullReduce: [],
      id: ""
    };
  },
  mounted() {
    that = this;
    this.id = this.$route.query.id;
    this.fullReduce = this.$route.query.fullReduce
      ? JSON.parse(this.$route.query.fullReduce)
      : [];
    that.getShop();
  },
  methods: {
    getShop() {
      this.com.find(
        this,
        "shop/find",
        "shopDetail",
        {
          query: JSON.stringify({
            fields: [],
            wheres: [
              {
                value: "sunwouId",
                opertionType: "equal",
                opertionValue: this.$route.query.id
              },
              { value: "isDelete", opertionType: "equal", opertionValue: false }
            ],
            sorts: [{ value: "createTime", asc: false }],
            pages: {
              currentPage: 1,
              size: 1
            }
          })
        },
        null,
        function(res) {
          if (res.code) {
            that.fullReduce = res.params.msg[0].fullReduce
              ? JSON.parse(res.params.msg[0].fullReduce)
              : [];
          }
        }
      );
    },
    filterData(){
        for (var i = 0; i < this.fullReduce.length - 1; i++) {
            for (var x = 0; x < this.fullReduce.length - 1-i; x++) {
                if (this.fullReduce[x].full < this.fullReduce[x + 1].full) {
                    // 数值交换
                    var a = this.fullReduce[x].full;
                    this.fullReduce[x].full = this.fullReduce[x + 1].full;
                    this.fullReduce[x + 1].full = a;
                }
            }
         }
    },
    onDialogSubmit(num) {
      if (num == -1) {
        this.fullReduce.push({ full: this.full, reduce: this.reduce });
      } else if (num == -2) {
        this.fullReduce[this.flag].full = this.full;
        this.fullReduce[this.flag].reduce = this.reduce;
      } else {
        this.fullReduce.splice(num, 1);
      }
      this.filterData()
      this.com.post(
        this,
        "shop/update",
        { ids: this.id, fullReduce: JSON.stringify(this.fullReduce) },
        function(res) {
          if (res.code) {
            that.$Notice.success({
              title: res.msg
            });
            that.tempIndex = -1;
          }
        }
      );
    }
  }
};
</script>