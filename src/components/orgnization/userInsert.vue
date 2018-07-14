<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name" style="max-width:400px">
            <Input v-model="formValidate.name" placeholder="姓名"></Input>
        </FormItem>
        <FormItem label="职位" prop="type" style="max-width:400px">
            <Input v-model="formValidate.type" placeholder="职位"></Input>
        </FormItem>
        <FormItem label="登录名" prop="userName" style="max-width:400px">
            <Input v-model="formValidate.userName" placeholder="登录名"></Input>
        </FormItem>
        <FormItem label="登录密码" prop="passWord" style="max-width:400px">
            <Input v-model="formValidate.passWord" placeholder="登录密码"></Input>
        </FormItem>
        <FormItem label="角色" prop="groupId" style="max-width:400px">
            <Select v-model="formValidate.roleId" >
                <Option v-for="item in role" :value="item.sunwouId" :key="item.sunwouId">{{ item.des }}</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存提交</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>
<script>
var that;
    export default {
        data () {
            return {
                role:[],
                loading:false,
                formValidate: {
                    type:'',
                    name: '',
                    groupId: JSON.parse(sessionStorage.getItem("userId")),
                    userName:'',
                    passWord:'',
                    roleId:'',
                },
                ruleValidate: {
                    type: [  { required: true, message: '必填', trigger: 'blur' } ],
                    name: [  { required: true, message: '必填', trigger: 'blur' } ],
                    userName: [  { required: true, message: '必填', trigger: 'blur' } ],
                    passWord: [  { required: true, message: '必填', trigger: 'blur' } ],
                    roleId: [  { required: true, message: '必填', trigger: 'blur' } ]
                }
            }
        },
        mounted(){
            that = this;
            this.getRole();
        },
        methods: {
            getRole() {
                this.tableLoading = true;
                that.com.post(this,'role/find',{groupId:this.com.APPID},function(res){
                    if (res.code) {
                        that.role = res.params.msg;
                    }
                },'tableLoading')
                
                },
            handleSubmit (name) {
                this.loading = true;
                
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        that.formValidate.permission = that.formValidate.url;
                        that.com.post(that,'user/add',that.formValidate,function(res){
                            if(res.code){
                                that.$Notice.success({
                                    title:'添加成功'
                                })
                            }
                        },"loading")
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>