<template>
    <div>
        <div class="panel-between">
            <div class="panel-start">
                <ButtonGroup>
                    <Button type="ghost">删除</Button>
                    <Button type="ghost" @click="centerDialogVisible = true">导入图片</Button>
                    <Button type="ghost">分类标签</Button>
                </ButtonGroup>
            </div>
            <Button type="ghost">刷新</Button>
        </div>
        <el-dialog title="上传图片" :visible.sync="centerDialogVisible" width="400px" center>
            <Upload multiple :action="api + 'file/fileup'">
                <Button type="ghost" icon="ios-cloud-upload-outline">点击上传图片</Button>
            </Upload>
            <span slot="footer" class="dialog-footer">
                <Button type="primary" @click="centerDialogVisible = true" long>确定</Button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            api:this.com.API,
            centerDialogVisible:false
        }
    }
}
</script>
