<template>
    <div>
        <div class="panel-between" style="margin-bottom:20px">
            <div class="panel-start item-center">
                <ButtonGroup>
                    <Button type="ghost" @click="dialogTitle = '新增地址',tempIndex=-1,centerDialogVisible = true"><Icon type="android-add"></Icon> 新增地址</Button>
                </ButtonGroup>
            </div>
        </div>
        <ul style="padding-left:30px">
            <li class="sfk" v-for="(item,index) in range" :key="index">
                <div class="panel-between item-center" style="max-width:400px">
                    <div style="width:300px;">{{item}}</div>
                    <div>
                        <ButtonGroup>
                            <Button type="text" size="small" @click="dialogTitle = '修改地址',name=item,centerDialogVisible = true,tempIndex = -2,flag=index" >修改</Button>
                            <Button type="text" size="small" @click="onDialogSubmit(index)">删除</Button>
                        </ButtonGroup>
                    </div>
                </div>
            </li>
        </ul>
        <Modal v-model="centerDialogVisible" :title="dialogTitle"
                width="400" @on-ok="onDialogSubmit(tempIndex)">
                <Form label-position="top">
                    <FormItem label="输入地址">
                        <Input v-model="name" placeholder="输入地址" />
                    </FormItem>
                </Form>
        </Modal>
    </div>
</template>
<style>
.sfk:hover {
  background: #f3f3f3;
}
</style>

<script>
var that;
export default {
  data() {
    return {
      shopDetail:'',
      tempIndex: -1,
      flag: 0,
      centerDialogVisible: false,
      dialogTitle: "新增地址",
      name: "",
      range: [],
      id: ""
    };
  },
  mounted() {
    that = this;
    this.id = this.$route.query.id;
    this.range = JSON.parse(this.$route.query.range);
    that.getShop()
  },
  methods: {
    getShop() {
      this.com.find(this, "shop/find", "shopDetail", {
        query: JSON.stringify({
          fields: [],
          wheres: [
            {
              value: "sunwouId",
              opertionType: "equal",
              opertionValue: this.$route.query.id
            },
            { value: "isDelete", opertionType: "equal", opertionValue: false }
          ],
          sorts: [{ value: "createTime", asc: false }],
          pages: {
            currentPage: 1,
            size: 1
          }
        })
      },null,function(res){
          if(res.code){
              that.range = res.params.msg[0].range ? res.params.msg[0].range:[]
          }
      });
    },
    onDialogSubmit(num) {
      if (num == -1) {
        this.range.push(this.name);
      } else if (num == -2) {
        this.range[this.flag] = this.name;
      } else {
        this.range.splice(num, 1);
      }

      this.com.post(
        this,
        "shop/update",
        { ids: this.id, range: this.range.toString() },
        function(res) {
          if (res.code) {
            that.$Notice.success({
              title: res.msg
            });
            that.tempIndex = -1;
            
          }
        }
      );
    }
  }
};
</script>

