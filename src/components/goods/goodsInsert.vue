<template>
    <div>
        <div class="panel-start">
            <Button type="primary" @click="navTo('/goods_1')"><Icon type="ios-arrow-back"></Icon> 返回</Button>
            <div class="font-title-mini" style="margin-left:50px">{{title}}</div>
        </div>
        <div style="max-width:600px;margin-top:20px">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="所属类目" prop="productCategoryId">
                    <Select v-model="formValidate.productCategoryId" placeholder="选择类目">
                        <Option v-for="item in category" :key="item.sunwouId" :value="item.sunwouId">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="商品名称" prop="productName">
                    <Input v-model="formValidate.productName" placeholder="商品名称"></Input>
                </FormItem>
                <FormItem label="商品图片" prop="productImage" style="max-width:400px">
                    <div class="shopImgar panel-center item-center" @click="centerDialogVisible = true">
                        <div v-if="formValidate.productImage == ''">添加图片</div>
                        <div v-if="formValidate.productImage" :style="'height:100%;width:100%;background-image:url('+formValidate.productImage+');background-size:cover;background-position:center;'"></div>
                    </div>
                </FormItem>
                <FormItem label="商品标价" prop="amount">
                    <Input v-model="formValidate.amount" placeholder="商品标价"></Input>
                </FormItem>
                <FormItem label="商品售价" prop="discount">
                    <Input v-model="formValidate.discount" placeholder="商品售价"></Input>
                </FormItem>
                <FormItem label="虚拟销量" >
                    <Input v-model="formValidate.sale" placeholder="虚拟销量"></Input>
                </FormItem>
                
                <FormItem label="规格" >
                    <Select v-model="attributeCategorys" filterable multiple>
                        <Option v-for="item in gui" :value="item.sunwouId" :key="item.sunwouId">{{ item.name }}</Option>
                    </Select>
                </FormItem> 
                <FormItem label="描述">
                    <Input v-model="formValidate.des" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="描述..."></Input>
                </FormItem>
                <FormItem label="上下架" >
                    <i-switch v-model="formValidate.able"></i-switch>
                </FormItem>
                <FormItem label="序号" >
                    <Input v-model="formValidate.sort" placeholder="序号"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')" :loading="loading">保存提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </div>
        <el-dialog title="商品图片" :visible.sync="centerDialogVisible" width="1000px" center>
            <gallery></gallery>
            <span slot="footer" class="dialog-footer" >
                <Button type="primary" @click="getImage()" long>确定</Button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
var that;
import gallery from '../gallery/gallery'
export default {
  components:{
    gallery
  },
  data() {
    return {
      title:'新增商品',
      category: [],
      gui:[],
      loading:false,
      centerDialogVisible:false,
      attributeCategorys:[],
      formValidate: {
        shopId:'',
        productName: "",
        productCategoryId: "",
        productImage:"",
        amount: "",
        sale: 0,
        boxPrice:false,
        discount:"",
        attributes:"",
        able: true,
        des: "",
        sort:0
      },
      ruleValidate: {
        productName: [{ required: true, message: "必填", trigger: "blur" }],
        productCategoryId: [ { required: true, message: "必选", trigger: "blur" } ],
        productImage: [{ required: true, message: "必填", trigger: "blur" }],
        amount: [{ required: true, message: "必填", trigger: "blur" }],
        discount: [{ required: true, message: "必填", trigger: "blur" }],
      }
    };
  },
  mounted() {
    that = this;
    this.getCategory();
    this.getGui();
    if(this.$route.query.title){
        this.title = this.$route.query.title;
        this.getGoods()
    }
  },
  methods: {
    getImage(){
        this.formValidate.productImage = this.com.globleData.tempImages[0];
        this.centerDialogVisible = false;
    },
    getCategory() {
      this.com.post(
        this,
        "productcategory/find",
        {
          query: JSON.stringify({
            fields: [],
            wheres: [
              {
                value: "shopId",
                opertionType: "equal",
                opertionValue: this.$route.query.id
              },
              { value: "isDelete", opertionType: "equal", opertionValue: false }
            ],
            sorts: [{ value: "sort", asc: true }],
            pages: {
              currentPage: 1,
              size: 1000
            }
          })
        },
        function(res) {
          if (res.code) {
            that.category = res.params.msg;
          }
        }
      );
    },
    getGoods(){
        this.com.post(
        this,
        "product/find",
        {
          query: JSON.stringify({
            fields: [],
            wheres: [
              {
                value: "sunwouId",
                opertionType: "equal",
                opertionValue: this.$route.query.gid
              }
            ],
            sorts: [],
            pages: {
              currentPage: 1,
              size: 1
            }
          })
        },
        function(res) {
          if (res.code) {
            that.formValidate = res.params.msg[0];
          }
        }
      );
    },
    getGui() {
      this.com.post(
        this,
        "productattributecategory/find",
        {
          query: JSON.stringify({
            fields: [],
            wheres: [
              {
                value: "parentId",
                opertionType: "equal",
                opertionValue: JSON.parse(sessionStorage.getItem("userId"))
              },
              { value: "isDelete", opertionType: "equal", opertionValue: false }
            ],
            sorts: [{ value: "sort", asc: true }],
            pages: {
              currentPage: 1,
              size: 1000
            }
          })
        },
        function(res) {
          if (res.code) {
            that.gui = res.params.msg;
          }
        }
      );
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          
          that.formValidate.attributes = that.attributeCategorys.toString();
          that.formValidate.shopId = that.$route.query.id;
          if(that.$route.query.title){
            delete that.formValidate.attributeCategorys
          
            that.formValidate.ids = that.formValidate.sunwouId
            delete that.formValidate.sunwouId;
          }
          
          var url = "add";
          if(that.$route.query.title){
              url = "update"
          }
          that.com.post(that,'product/'+url,that.formValidate,function(res){
              if(res.code){
                  that.$Notice.success({
                      title:res.msg
                  })
                  that.navTo('/goods_1')
              }
          },'loading')
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    navTo(path) {
      this.$router.push({ path: path, query: { id: this.$route.query.id } });
    }
  }
};
</script>
