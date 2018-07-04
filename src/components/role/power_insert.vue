<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="权限名称" prop="des" style="max-width:400px">
            <Input v-model="formValidate.des" placeholder="权限名称"></Input>
        </FormItem>
        <!-- <FormItem label="权限" prop="permission" style="max-width:400px">
            <Input v-model="formValidate.permission" placeholder="权限"></Input>
        </FormItem> -->
        <FormItem label="接口地址" prop="url" style="max-width:400px">
            <Select v-model="formValidate.url" filterable >
                <Option v-for="item in urls" :value="item.url" :key="item.url">{{ item.des }}</Option>
            </Select>
        </FormItem>
        <FormItem label="所属分类" prop="groupId" style="max-width:400px">
            <Select v-model="formValidate.groupId" >
                <Option v-for="item in category" :value="item.sunwouId" :key="item.sunwouId">{{ item.name }}</Option>
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
                urls:[],
                category:[],
                loading:false,
                formValidate: {
                    des: '',
                    permission: '',
                    groupId:'',
                    url:''
                },
                ruleValidate: {
                    des: [
                        { required: true, message: '权限名称必填', trigger: 'blur' }
                    ],
                    // permission: [
                    //     { required: true, message: '权限对应接口必填', trigger: 'blur' },
                    // ],
                   groupId: [
                        { required: true, message: '请选择一个类别', trigger: 'blur' },
                    ],
                    url: [
                        { required: true, message: '接口地址必选', trigger: 'blur' },
                    ],
                }
            }
        },
        mounted(){
            that = this;
            this.com.find(that,'role/findcategory',"category",{groupId:this.com.APPID});
            this.com.find(that,'role/findurl',"urls",{});
        },
        methods: {
            
            handleSubmit (name) {
                this.loading = true;
                
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        that.formValidate.permission = that.formValidate.url;
                        that.com.post(that,'role/addperm',that.formValidate,function(res){
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