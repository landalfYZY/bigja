<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="角色名称" prop="des" style="max-width:400px">
                <Input v-model="formValidate.des" placeholder="角色名称"></Input>
            </FormItem>
            <FormItem label="角色" prop="role" style="max-width:400px">
                <Input v-model="formValidate.role" placeholder="角色"></Input>
            </FormItem>
            <FormItem label="选择权限" prop="permissionId" style="max-width:400px">
                <Button type="ghost" @click="centerDialogVisible = true">选择权限</Button> <span v-if="formValidate.permissionId">已选</span>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('formValidate')">保存提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
        <el-dialog title="选择权限" :visible.sync="centerDialogVisible" width="500px" center>
            <power></power>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false,selectPower()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import power from './power'
var that;
    export default {
        components:{
            power
        },
        data () {
            return {
                centerDialogVisible:false,
                loading:false,
                formValidate: {
                    groupId: this.com.APPID,
                    des: '',
                    permissionId:'',
                    role:'',
                },
                ruleValidate: {
                    des: [
                        { required: true, message: '角色名称必填', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: '角色必填', trigger: 'blur' }
                    ],
                    permissionId:[
                        { required: true, message: '权限必选', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted(){
            that = this
        },
        methods: {
            selectPower(){
                console.log(this.com.config.tempPower)
                this.formValidate.permissionId = this.com.config.tempPower
            },
            handleSubmit (name) {
                this.loading = true
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        that.com.post(that,'role/add',that.formValidate,function(res){
                            if(res.code){
                                that.$Notice.success({
                                    title:'角色添加成功'
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