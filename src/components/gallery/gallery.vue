<template>
    <div>
        <div class="panel-between">
            <div class="panel-start">
                <ButtonGroup>
                    <Button type="ghost">删除</Button>
                    <Button type="ghost" @click="centerDialogVisible = true">上传图片</Button>
                    <Button type="ghost" @click="folderDialogVisible = true">新建文件夹</Button>
                </ButtonGroup>
            </div>
            <div>
                <ButtonGroup>
                    <Button type="ghost">回收站</Button>
                    <Button type="ghost" @click="refresh()">刷新</Button>
                </ButtonGroup>
            </div>
        </div>

        <el-dialog title="上传图片" :visible.sync="centerDialogVisible" width="400px" center>
            <Upload multiple :action="api + 'file/upload'" :data="{userId:'1sss1',groupId:this.groupId}" :max-size="2048" :on-success="beforeUpload">
                <Button type="ghost" icon="ios-cloud-upload-outline">点击上传图片</Button>
            </Upload>
            <span slot="footer" class="dialog-footer" >
                <Button type="primary" @click="centerDialogVisible = false" long>确定</Button>
            </span>
        </el-dialog>

        <el-dialog title="新建文件夹" :visible.sync="folderDialogVisible" width="400px" center>
            <Form label-position="top">
                <FormItem label="文件名">
                    <Input v-model="tempFolder.name" placeholder="文件名" />
                </FormItem>
                <FormItem label="是否公开">
                    <el-switch v-model="tempFolder.isPublic" active-text="公开" inactive-text="隐私"> </el-switch>
                </FormItem>
            </Form>
            <span slot="footer" class="dialog-footer" >
                <Button type="primary" :loading="newFolderLoading" @click="newfolder()" long>确定</Button>
            </span>
        </el-dialog>

        <div class="ult-wiss" id="pwidth">
            <div class="panel-between item-center" style="height:40px">
                <div class="panel-start item-center">
                    <Checkbox >全选</Checkbox>
                    <div style="margin-left:20px">
                        <Breadcrumb separator=">">
                            <BreadcrumbItem v-for="(item,index) in breadcrumb" :key="index"><div  @click="breadClick(index)" style="cursor:pointer;display:inline-block">{{item.name}}</div></BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </div>
                <div>占用空间 1.5M</div>
            </div>
        </div>
        <div style="width:100%">
            <Row :gutter="10">
                <Col :span="span" class="colWidth" v-for="(item,index) in folderList" :key="item.sunwouId+index">
                    <div class="backpanel" :style="{height:panelWidth+'px'}">
                        <Checkbox v-model="item.checked"></Checkbox>
                        <div class="folder" @click="clickFolder(item.name,item.sunwouId)">
                            <Icon type="folder" style="margin:auto" size="80"></Icon>
                        </div>
                    </div>
                    <div class="ell">{{item.name}}</div>
                </Col>
                <Col :span="span" class="colWidth" v-for="(item,index) in fileList" :key="item.sunwouId+index">
                    <div class="backpanel" @mouseover="textLinemouseover()" @mouseout="textLinemouseout()" :style="'background-image:url('+item.host+item.path+');height:'+panelWidth+'px'">
                        <div class="panel-between">
                            <Checkbox v-model="item.checked" @on-change="imageSessChecked()"></Checkbox>
                            <div class="sizeshow">{{(item.size/1024).toFixed(1)}}k</div>
                        </div>
                        <div v-if="textLine" class="ell dispanel panel-between" :style="{marginTop:(panelWidth-48)+'px',height:'30px'}">
                            <div class="bitems" title="重命名"><Icon type="edit"></Icon></div>
                            <div class="bitems" title="复制"><Icon type="reply"></Icon></div>
                            <div class="bitems" title="删除"><Icon type="trash-a"></Icon></div>
                        </div>
                    </div>
                    <div class="ell">{{item.fileName}}</div>
                </Col>
            </Row>
        </div>
        <div class="ult-wiss panel-end item-center" >
            <Page :total="total" size="small" show-elevator ></Page>
        </div>
    </div>
</template>
<script>
var that;
export default {
  data() {
    return {
      breadcrumb:[{name:'主目录',id:'ne'}],
      groupId: "ne",
      folderDialogVisible: false,
      tempFolder: {
        name: "",
        isPublic: false
      },
      total:0,
      newFolderLoading: false,
      span: 3,
      panelWidth: 0,
      api: this.com.API,
      centerDialogVisible: false,
      textLine: false,
      folderList:[],
      fileList:[],
      fileQuery:{
          fields: [],
        wheres: [
            {value:'groupId',opertionType:'equal',opertionValue:'ne'},
            {value:'isDelete',opertionType:'equal',opertionValue:false}
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 30
        }
      },
      folderQuery: {
        fields: [],
        wheres: [
            {value:'groupId',opertionType:'equal',opertionValue:'ne'},
            {value:'isDelete',opertionType:'equal',opertionValue:false}
        ],
        sorts: [],
        pages: {
          currentPage: 1,
          size: 1000
        }
      }
    };
  },
  mounted() {
    that = this;
    that.refresh();
  },
  methods: {
    //刷新
    refresh(){
        that.findFolder();
    },
    imageSessChecked(){
        this.com.globleData.tempImages = [];
        var li = [];
        for(var i in this.fileList){
            if(this.fileList[i].checked){
                li.push(this.fileList[i].host + this.fileList[i].path)
            }
        }
        this.com.globleData.tempImages = li;
    },
    //新建文件夹
    newfolder() {
      this.newFolderLoading = true;
      if (this.groupId != "") {
        this.tempFolder.groupId = this.groupId;
      }
      this.com.post(
        this,
        "folder/add",
        this.tempFolder,
        function(res) {
          that.folderDialogVisible = false;
          if (res.code) {
            that.$Notice.success({
              title: "新建成功"
            });
            that.findFolder();
          }
        },
        "newFolderLoading"
      );
    },
    //点击文件夹
    clickFolder(name,id){
        this.breadcrumb.push({name:name,id:id});
        this.folderQuery.wheres[0].opertionValue = id;
        this.fileQuery.wheres[0].opertionValue = id;
        this.groupId = id;
        this.findFolder();
    },
    breadClick(index){
        if(index != this.breadcrumb.length-1){
            this.breadcrumb.splice(index+1,this.breadcrumb.length-(index+1));
            this.groupId = this.breadcrumb[index].id;
            this.folderQuery.wheres[0].opertionValue = this.breadcrumb[index].id;
            this.fileQuery.wheres[0].opertionValue = this.breadcrumb[index].id;
            this.findFolder();
        }
    },
    findImages(){
        this.com.find(this,'file/find','fileList',{query:JSON.stringify(this.fileQuery)},'total',function(res){
            if(res.code){
                for(var i in res.params.msg){
                    res.params.msg[i].checked = false;
                }
                that.fileList =  res.params.msg
                that.windowResize();
            }
        });
    },
    findFolder() {
        this.com.find(this,'folder/find','folderList',{query:JSON.stringify(this.folderQuery)},false,function(res){
            if(res.code){
                for(var i in res.params.msg){
                    res.params.msg[i].checked = false;
                }
                that.folderList =  res.params.msg
                that.findImages();
            }
        });
    },
    beforeUpload(e) {
      this.centerDialogVisible = false;
      this.findImages();
    },
    textLinemouseover() {
      this.textLine = true;
    },
    textLinemouseout() {
      this.textLine = false;
    },
    windowResize() {
      that.setSize();
      $(window).resize(function() {
        that.setSize();
      });
    },
    setSize() {
    //   console.log($(".colWidth")[0])
      var pw = $("#pwidth").innerWidth();
      if (pw >= 1000) {
        that.span = 3;
      } else if (pw < 1000 && pw > 700) {
        that.span = 4;
      } else {
        that.span = 6;
      }
      that.panelWidth = 
         $(".colWidth")[0].clientWidth - 10;
    }
  }
};
</script>