<template>
    <div>
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
                <Select v-model="formValidate.address" filterable remote :remote-method="locationInput" :label-in-value="true" @on-change="getLocation">
                    <Option v-for="(option, index) in addressFilter" :value="option.name" :label="option.name+','+option.location.lat+','+option.location.lng" :key="index">{{option.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="店铺电话" prop="phone" style="max-width:400px">
                <Input v-model="formValidate.phone" placeholder="店铺电话"></Input>
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
import gallery from '../gallery/gallery'
var that;
    export default {
        components:{
            gallery
        },
        data () {
            return {
                centerDialogVisible:false,
                loading:false,
                addressFilter:[],
                cityList:["杭州","湖州","上海","宁波","北京","南京","苏州","嘉兴"],
                formValidate: {
                    userId:sessionStorage.getItem("userId"),
                    passWord:'',
                    userName:'',
                    city:'',
                    openStatus:false,
                    shopName: '',
                    shopImage: '',
                    phone:'',
                    address:'',
                    lat:'',
                    lng:'',
                    sendMode:false,
                    getMode:false,
                    roleId:''
                },
                ruleValidate: {
                    shopName: [
                        { required: true, message: '店铺名称必填', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '地址必填', trigger: 'blur' },
                    ],
                   shopImage: [
                        { required: true, message: '图片必填', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '店铺电话必填', trigger: 'blur' },
                    ],
                    userName:[
                        { required: true, message: '必填', trigger: 'blur' },
                    ],
                    passWord:[{ required: true, message: '必填', trigger: 'blur' }]
                }
            }
        },
        mounted(){
            that = this;
            
        },
        methods: {
            locationInput(e){
                this.com.http('get','https://api.map.baidu.com/place/v2/suggestion',{
                    query:e,
                    region:this.formValidate.city,
                    ak:'5w3ODGXuLmKOkGgsDVsZ8Q5wguwKf1Xu',
                    output:'json'
                },'jsonp',function(res){
                    that.addressFilter = res.result;
                })
            },
            getLocation(e){
                this.formValidate.address = e.value;
                var li = e.label.split(",");
                this.formValidate.lat = li[1];
                this.formValidate.lng = li[2];
            },
            getImage(){
                this.formValidate.shopImage = this.com.globleData.tempImages[0];
                this.centerDialogVisible = false;
            },
            handleSubmit (name) {
                this.loading = true;
                
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        that.formValidate.permission = that.formValidate.url;
                        that.com.post(that,'shop/add',that.formValidate,function(res){
                            if(res.code){
                                that.$Notice.success({
                                    title:'店铺添加成功'
                                })
                                that.$router.push({path:'/shop'})
                            }
                        },"loading")
                    } else {
                        this.$Message.error('Fail!');
                        that.loading = false
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>