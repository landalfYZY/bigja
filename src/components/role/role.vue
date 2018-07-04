<template>
    <transition name="el-fade-in-linear">
        <div>
            <div class="panel-between">
                <div class="panel-start item-center">
                    <ButtonGroup>
                        <Button type="ghost" @click="navTo('/roleInsert')"><Icon type="android-add"></Icon> 新增角色</Button>
                    </ButtonGroup>
                    <span class="font-grey" style="margin-left:10px">可以按回车进行筛选</span>
                </div>
                
            </div>
          
            <Table ref="selection" border :columns="columns" :data="data" style="margin-top:15px" :loading="tableLoading"></Table>
          
        </div>
    </transition>
</template>

<script>
var that;
export default {
  data() {
    return {
      tableLoading: false,
      columns: [
        { type: "selection", width: 60, align: "center" },
        { title: "ID", key: "sunwouId" },
        { title: "角色名称", key: "des" },
        { title: "角色", key: "role" },
        { title: "创建时间", key: "createTime" },
      ],
      data: []
    };
  },
  mounted() {
    that = this;
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      that.com.post(this,'role/find',{groupId:this.com.APPID},function(res){
          if (res.code) {
            that.data = res.params.msg;
          }
      },'tableLoading')
      
    },
    navTo(path) {
      this.$router.push({ path: path });
    }
  }
};
</script>
