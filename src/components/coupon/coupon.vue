<template>
    <transition name="el-fade-in-linear">
        <div>
            
            <div class="panel-between">
                <div class="panel-start item-center">
                    <ButtonGroup>
                        <Button type="ghost" @click="changeUpdate(null,'isDelete',true)"><Icon type="trash-a"></Icon> 删除</Button>
                        <Button type="ghost" @click="navTo('/couponChange')"><Icon type="android-add"></Icon> 新增优惠券</Button>
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
                        <Input v-model="search1" placeholder="获取方式 查找" @input="search('getType',1)"  @keydown.enter.native="changePageSize()" />
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
            <Modal v-model="centerDialogVisible" :title="dialogTitle"
                width="400" @on-ok="onDialogSubmit">
                <Form :model="formValidate" label-position="top">
                    <FormItem label="数量">
                        <Input v-model="count" placeholder="数量" />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    </transition>
</template>

<script>
var that;
export default {

  data() {
    return {
      tableLoading:false,
      total: 0,
      selection:[],
      pageSizeList: this.com.config.pageSizeList,
      search1: "",
      centerDialogVisible:false,
      count:0,
      sunwouId:'',
      columns: [
        { type: "selection", width: 60, align: "center"},
        { title: "描述", key: "des" },
        { title: "获取方式", key: "getType" },
        { title: "满价格", key: "full" },
        { title: "优惠", key: "reduce" },
        { title: "期限", key: "day" },
        { title: "数量", render(h,params){
            return h("div",[
                h("div",{
                    style:{display:'inline-block',marginRight:'5px'}
                },params.row.count),
                h("a",{
                    props:{href:'javascript:;'},
                    on:{
                        click(){
                            that.centerDialogVisible = true;
                            that.count = params.row.count;
                            that.sunwouId = params.row.sunwouId;
                        }
                    }
                },"修改"),
            ])
        }},
        { title: "max耗资", render(h,params){
            return h("span",(parseFloat(params.row.reduce)*parseFloat(params.row.count)).toFixed(1))
        } },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("ButtonGroup", [
                h("Button",{props:{type:'ghost',size:"small"},
                    on:{
                        click(){
                            that.changeUpdate(params.row.sunwouId,'isDelete',true)
                        }
                    }
                },"删除"),
            ]);
          }
        }
      ],
      data: [],
      query: {
        fields: [],
        wheres: [
          { value: "shopId", opertionType: "equal", opertionValue: '' },
          { value: "isDelete", opertionType: "equal", opertionValue: false }
        ],
        sorts: [{ value: "sort", asc: true }],
        pages: {
          currentPage: 1,
          size: 10
        }
      }
    };
  },
  mounted() {
    that = this;
    this.query.wheres[0].opertionValue = this.$route.query.id;
    that.getList();
  },
  methods: {
    onDialogSubmit(){
        this.changeUpdate(this.sunwouId,'count',this.count)
    },
    changeUpdate(id,name,value){
        if(name == "isDelete"){
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>删除后将无法找回，确认要删除？</p>',
                    onOk: () => {
                        that.doChangeUpdate(id,name,value)
                    },
                    onCancel: () => {
                        
                    }
                });
        }else{
            this.doChangeUpdate(id,name,value)
        }
        
    },
    doChangeUpdate(id,name,value){
        if(id != null){
            that.doUpdate(id,name,value)
        }else{
            if(this.selection.length > 0){
                that.doUpdate(this.selection.toString(),name,value)
            }else{
                that.$Message.info("还没选商品呢")
            }
        }
    },
    doUpdate(id,name,value){
        var data = {ids:id}
        data[name] = value
        this.com.post(this,'coupon/update',data,function(res){
            if(res.code){
                that.$Notice.success({
                    title:res.msg
                })
                that.getList();
            }
        })
    },
    getSelected(e) {
      var li = [];
      for (var i in e) {
        li.push(e[i].sunwouId);
      }
      that.selection = li;
    },
    
    outputData() {
      if(this.data.length == 0){
        this.$Message.warning("无数据可导出");
      }else{
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
    clearFilter(){
      var li = ['getType']
      for(var i=0;i<1;i++){
          this['search'+parseInt(i+1)] = '';
          this.search(li[i],parseInt(i+1))
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
      this.tableLoading = true;
      this.com.post(this,'coupon/find',{ query: JSON.stringify(this.query) },function(res){
          if(res.code){
              that.data = res.params.msg;
              that.total = res.params.total;
          }
      },"tableLoading")
      
    },
    navTo(path) {
      this.$router.push({ path: path,query:{id:this.$route.query.id} });
    }
  }
};
</script>
