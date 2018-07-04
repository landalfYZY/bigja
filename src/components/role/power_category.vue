<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="权限类名" prop="name" style="max-width:400px">
            <Input v-model="formValidate.name" placeholder="权限类名"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存提交</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>
<script>
var that;
    export default {
        data () {
            return {
                loading:false,
                formValidate: {
                    groupId: this.com.APPID,
                    name: '',
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '权限类名必填', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted(){
            that = this
        },
        methods: {
            handleSubmit (name) {
                this.loading = true
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        that.com.post(that,'role/addcategory',that.formValidate,function(res){
                            if(res.code){
                                that.$Notice.success({
                                    title:res.msg
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