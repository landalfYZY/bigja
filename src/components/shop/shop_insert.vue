<template>
    <div>
        <div v-if="id != ''" class="panel-start item-center" style="margin-bottom:40px">
            <Button type="primary" @click="navTo('/shopDetail')"><Icon type="ios-arrow-back"></Icon> 返回</Button>
            <div class="font-title-mini" style="margin-left:100px;" >
                修改店铺信息
            </div>
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <FormItem label="店铺名称" prop="shopName" style="max-width:400px">
                <Input v-model="formValidate.shopName" placeholder="店铺名称"></Input>
            </FormItem>
            <FormItem label="店铺图片" prop="shopImage" style="max-width:400px">
                <div class="shopImgar panel-center item-center" @click="centerDialogVisible = true">
                    <div v-if="formValidate.shopImage == ''">添加图片</div>
                    <div v-if="formValidate.shopImage" :style="'height:100%;width:100%;background-image:url('+formValidate.shopImage+');background-size:cover;background-position:center;'"></div>
                </div>
            </FormItem>
            <FormItem label="城市" prop="city" style="max-width:400px">
                <Select v-model="formValidate.city" placeholder="城市" >
                    <Option v-for="(option, index) in cityList" :value="option" :key="index">{{option}}</Option>
                </Select>
            </FormItem>
            <FormItem label="输入地点" prop="address" style="max-width:600px">
                {{formValidate.address}}
                <Select v-model="formValidate.address" filterable remote :remote-method="locationInput" :label-in-value="true" @on-change="getLocation">
                    <Option v-for="(option, index) in addressFilter" :value="option.name" :label="option.name+','+option.location.lat+','+option.location.lng" :key="index">{{option.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="店铺电话" prop="phone" style="max-width:400px">
                <Input v-model="formValidate.phone" placeholder="店铺电话"></Input>
            </FormItem>
            <FormItem label="餐盒费" prop="boxPrice" style="max-width:400px">
                <Input v-model="formValidate.boxPrice" placeholder="餐盒费"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
        <el-dialog title="店铺图片" :visible.sync="centerDialogVisible" width="1000px" center>
            <gallery></gallery>
            <span slot="footer" class="dialog-footer" >
                <Button type="primary" @click="getImage()" long>确定</Button>
            </span>
        </el-dialog>
    </div>
    
</template>
<script>
import gallery from "../gallery/gallery";
var that;
export default {
  components: {
    gallery
  },
  data() {
    return {
      id: "",
      shopDetail:[],
      centerDialogVisible: false,
      loading: false,
      addressFilter: [],
      cityList: [
        "杭州",
        "湖州",
        "上海",
        "宁波",
        "北京",
        "南京",
        "苏州",
        "嘉兴"
      ],
      formValidate: {
        userId: JSON.parse(sessionStorage.getItem("userId")),
        city: "",
        openStatus: false,
        shopName: "",
        shopImage: "",
        phone: "",
        address: "",
        lat: "",
        lng: "",
        boxPrice:0,
        sendMode: false,
        getMode: false,
      },
      ruleValidate: {
        shopName: [
          { required: true, message: "店铺名称必填", trigger: "blur" }
        ],
        address: [{ required: true, message: "地址必填", trigger: "blur" }],
        shopImage: [{ required: true, message: "图片必填", trigger: "blur" }],
        phone: [{ required: true, message: "店铺电话必填", trigger: "blur" }],
        city: [{ required: true, message: "必填", trigger: "blur" }],
        boxPrice: [{ required: true, message: "必填", trigger: "blur" }],
      }
    };
  },
  mounted() {
    that = this;
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getShop();
    }
  },
  methods: {
    getShop(){
        this.com.find(this, "shop/find", "shopDetail", {
        query: JSON.stringify({
          fields: [],
          wheres: [
            {
              value: "sunwouId",
              opertionType: "equal",
              opertionValue: this.$route.query.id
            }
          ],
          sorts: [{ value: "createTime", asc: false }],
          pages: {
            currentPage: 1,
            size: 1
          }
        })
      },null,function(res){
          if(res.code){
              that.formValidate = res.params.msg[0]
              that.locationInput(res.params.msg[0].address)
          }
      });
    },
    locationInput(e) {
      this.com.http(
        "get",
        "https://api.map.baidu.com/place/v2/suggestion",
        {
          query: e,
          region: this.formValidate.city,
          ak: "5w3ODGXuLmKOkGgsDVsZ8Q5wguwKf1Xu",
          output: "json",
          ret_coordtype:'db09'
        },
        "jsonp",
        function(res) {
          that.addressFilter = res.result;
        }
      );
    },
    getLocation(e) {
      this.formValidate.address = e.value;
      var li = e.label.split(",");
      this.formValidate.lat = li[1];
      this.formValidate.lng = li[2];
    },
    getImage() {
      this.formValidate.shopImage = this.com.globleData.tempImages[0];
      this.centerDialogVisible = false;
    },
    handleSubmit(name) {
      this.loading = true;
      var url = 'add';
      if(this.id){
          url = 'update',
          delete this.formValidate.userId;
          delete this.formValidate.createTime;
          delete this.formValidate.createDate;
          delete this.formValidate.sort;
          delete this.formValidate.range;
          this.formValidate.ids = this.formValidate.sunwouId
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          that.formValidate.permission = that.formValidate.url;
          that.com.post(
            that,
            "shop/"+url,
            that.formValidate,
            function(res) {
              if (res.code) {
                that.$Notice.success({
                  title: "店铺添加成功"
                });
                that.$router.push({ path: "/shop" });
              }
            },
            "loading"
          );
        } else {
          this.$Message.error("Fail!");
          that.loading = false;
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