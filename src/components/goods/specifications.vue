<template>
    <transition name="el-fade-in-linear">
        <div>
            
            <div class="panel-between">
                <div class="panel-start item-center">
                    <ButtonGroup>
                        <Button type="ghost" @click="changeUpdate(null,'isDelete',true)"><Icon type="trash-a"></Icon> 删除</Button>
                        <Button type="ghost" @click="centerDialogVisible = true,dialogTitle = '新增规格类目'"><Icon type="android-add"></Icon> 新增规格类目</Button>
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
                        <Input v-model="search1" placeholder="类目 查找" @input="search('name',1)"  @keydown.enter.native="changePageSize()" />
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
                    <FormItem label="规格类目名称">
                        <Input v-model="formValidate.name" placeholder="规格类目名称" />
                    </FormItem>
                    <FormItem label="描述">
                        <Input v-model="formValidate.des" placeholder="描述" />
                    </FormItem>
                    <FormItem label="序号">
                        <Input v-model="formValidate.sort" placeholder="序号" />
                    </FormItem>
                </Form>
            </Modal>

            <Modal v-model="dialogVisible" :title="canTitle"
                width="500" @on-ok="canSubmit">
                <Form :model="canValue" label-position="top">
                    <FormItem label="参数名">
                        <Input placeholder="参数名" v-model="canValue.name"  />
                    </FormItem>
                    <FormItem label="需加价格">
                        <Input placeholder="需加价格" v-model="canValue.add"  />
                    </FormItem>
                    <FormItem label="序号">
                        <Input placeholder="序号" v-model="canValue.sort"  />
                    </FormItem>
                </Form>
            </Modal>

            <Modal v-model="dialogSd" title="提示"
                width="400">
                <ButtonGroup>
                    <Button type="default" @click="dialogSd = false">取消</Button>
                    <Button type="error" @click="dialogSd = false,delCan()">删除</Button>
                    <Button type="primary" @click="dialogSd = false,dialogVisible = true,canTitle = '修改参数'">修改</Button>
                </ButtonGroup>
            </Modal>
        </div>
    </transition>
</template>

<script>
var that;
export default {

  data() {
    return {
      formValidate:{
          name:'',
          sort:0,
          parentId:JSON.parse(sessionStorage.getItem("user")).groupId ? JSON.parse(sessionStorage.getItem("user")).parentId:JSON.parse(sessionStorage.getItem("user")).sunwouId,
          des:''
      },
      canValue:{
          name:'',add:'',sort:0,parentid:''
      },
      dialogSd:false,
      canTitle:'新增参数',
      dialogTitle:'新增规格类目',
      centerDialogVisible:false,
      dialogVisible:false,
      tableLoading:false,
      total: 0,
      selection:[],
      pageSizeList: this.com.config.pageSizeList,
      search1: "",
      columns: [
        { type: "selection", width: 60, align: "center"},
        { title: "序号", key: "sort" },
        { title: "类目名称", key: "name" },
        { title: "描述", key: "des" },
        { title: "参数", render(h,params){
            var str = [];
            for(var i in params.row.attributes){
                str.push(h("Button",{
                    props:{type:params.row.attributes[i].add > 0 ? "primary":"warning",size:'small'},
                        on:{
                            click(){
                                console.log(i)
                                that.dialogSd = true;
                                that.canValue = params.row.attributes[i]
                            }
                        },
                        domProps: {
                            innerHTML: params.row.attributes[i].name
                        }
                    }))
            }
            return h("ButtonGroup",str)
        } },
        {
          title: "操作",
          key: "action",
          width: 170,
          align: "center",
          render: (h, params) => {
            return h("ButtonGroup", [
                
                h("Button",{
                    props:{type:'ghost',size:"small"},
                    on:{
                        click(){
                            that.dialogTitle = "修改类目";
                            that.centerDialogVisible = true;
                            that.formValidate = params.row
                        }
                    }
                },"修改"),
                h("Button",{props:{type:'ghost',size:"small"},
                    on:{
                        click(){
                            that.dialogVisible = true;
                            that.canTitle = "新增参数";
                            that.canValue.parentid = params.row.sunwouId;
                        }
                    }
                },"参数"),
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
          { value: "parentId", opertionType: "equal", opertionValue: JSON.parse(sessionStorage.getItem("user")).groupId ? JSON.parse(sessionStorage.getItem("user")).parentId:JSON.parse(sessionStorage.getItem("userId")) },
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
    that.getList();
  },
  methods: {
    canSubmit(){
        var url = "productattribute/add";
        var data = this.canValue;
        if(this.canTitle != "新增参数"){
            url = "productattribute/update";
            data.ids = data.sunwouId
        }
        this.com.post(this,url,data,function(res){
            if(res.code){
                that.$Notice.success({
                    title:res.msg
                })
                that.getList();
            }
        })
    },
    onDialogSubmit(){
        var url = "productattributecategory/add";
        var data = this.formValidate;
        if(this.dialogTitle != "新增规格类目"){
            url = "productattributecategory/update";
            data.ids = data.sunwouId
        }
        this.com.post(this,url,data,function(res){
            if(res.code){
                that.$Notice.success({
                    title:res.msg
                })
                that.getList();
            }
        })
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
                that.$Message.info("还没选类目呢")
            }
        }
    },
    delCan(){
        this.com.post(this,'productattribute/update',{
            ids:this.canValue.sunwouId,
            isDelete:true
        },function(res){
            if(res.code){
                that.$Notice.success({
                    title:res.msg
                })
                that.getList();
            }
        })
    },
    doUpdate(id,name,value){
        var data = {ids:id}
        data[name] = value
        this.com.post(this,'productattributecategory/update',data,function(res){
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
      var li = ['name']
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
      this.com.post(this,'productattributecategory/find',{ query: JSON.stringify(this.query) },function(res){
          if(res.code){
              that.data = res.params.msg;
              that.total = res.params.total;
          }
      },"tableLoading")
      
    },
    navTo(path) {
      this.$router.push({ path: path });
    }
  }
};
</script>
