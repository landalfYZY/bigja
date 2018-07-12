<template>
    <div>
        <div v-if="id != ''" class="panel-start item-center" style="margin-bottom:40px">
            <Button type="primary" @click="navTo('/coupon')"><Icon type="ios-arrow-back"></Icon> 返回</Button>
            <div class="font-title-mini" style="margin-left:100px;" >
                修改店铺信息
            </div>
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <FormItem label="优惠券描述" prop="des" style="max-width:400px">
                <Input v-model="formValidate.des" placeholder="优惠券描述" />
            </FormItem>
            <FormItem label="超过此金额" prop="full" style="max-width:400px">
                <Input v-model="formValidate.full" placeholder="超过此金额" />
            </FormItem>
            <FormItem label="优惠金额" prop="reduce" style="max-width:400px">
                <Input v-model="formValidate.reduce" placeholder="优惠金额" />
            </FormItem>
            <FormItem label="发放数量" prop="count" style="max-width:400px">
                <Input v-model="formValidate.count" placeholder="发放数量" />
            </FormItem>
            <FormItem label="获取方式" prop="getType" style="max-width:400px">
                <Select v-model="formValidate.getType" style="width:200px">
                    <Option v-for="item in getStyle" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>
            <FormItem label="期限" prop="day" style="max-width:400px">
                <Input v-model="formValidate.day" placeholder="期限（天）" />
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
    
</template>
<script>
var that;
export default {
  data() {
    return {
      coupon:'',
      id:'',
      getStyle:[
          "手动发放","首次登录","分享","每下五单","每下十单"
      ],
      loading: false,
      formValidate: {
        full: null,
        reduce: null,
        count: null,
        stopTime: "",
        des: "",
        day: ""
      },
      ruleValidate: {
        full: [ { required: true, message: "必填", trigger: "blur" } ],
        reduce: [{ required: true, message: "必填", trigger: "blur" }],
        count: [{ required: true, message: "必填", trigger: "blur" }],
        stopTime: [{ required: true, message: "必填", trigger: "blur" }],
        des: [{ required: true, message: "必填", trigger: "blur" }],
        day:[{ required: true, message: "必填", trigger: "blur" }]
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
        this.com.find(this, "coupon/find", "coupon", {
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
          }
      });
    },
    handleSubmit(name) {
      this.loading = true;
      var url = 'add';
      if(this.id){
          url = 'update',
          delete this.formValidate.createTime;
          delete this.formValidate.createDate;
          delete this.formValidate.sort;
          this.formValidate.ids = this.formValidate.sunwouId
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          that.formValidate.permission = that.formValidate.url;
          that.com.post(
            that,
            "coupon/"+url,
            that.formValidate,
            function(res) {
              if (res.code) {
                that.$Notice.success({
                  title: res.msg
                });
                that.$router.push({ path: "/coupon" });
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
      this.$router.push({ path: path});
    }
  }
};
</script>