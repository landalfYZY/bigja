<template>
    <div>
        <Tree :data="data" show-checkbox @on-check-change="onCheckChange"></Tree>
    </div>
</template>
<script>
var that = this;
export default {
  data() {
    return {
      data: []
    };
  },
  mounted() {
    that = this;
    this.getList();
  },
  methods: {
    onCheckChange(e){
      var ids = [];
      for(var i in this.data){
        for(var j in this.data[i].children){
          if(this.data[i].children[j].checked){
            ids.push(this.data[i].children[j].sunwouId)
          }
        }
      }
      this.com.config.tempPower = ids.toString();
    },
    getList() {
      that.com.post(that, 'role/findcategory', {groupId:this.com.APPID}, function(res) {
        if (res.code) {
          for(var i in res.params.msg){
            res.params.msg[i].title = res.params.msg[i].name;
            res.params.msg[i].expand = false;
            res.params.msg[i].children = []
            for(var j in res.params.msg[i].perms){
              res.params.msg[i].children.push({title:res.params.msg[i].perms[j].des+" "+res.params.msg[i].perms[j].url,sunwouId:res.params.msg[i].perms[j].sunwouId})
            }
          }
          that.data = res.params.msg;
          if(that.data.length != 0){
            that.data[0].expand = true
          }
          
        }
      });
    }
  }
};
</script>

