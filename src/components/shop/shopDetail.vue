<template>
    <div>
        <div class="panel-start" style="background:#f3f3f3;padding:15px" v-for="item in shopDetail" :key="item.sunwouId">
            <div>
                <div style="height:100px;min-width:120px;background:#ffffff" v-if="item.shopImage">
                    <img   height="100px" :src="item.shopImage" style="border:1px solid #000">
                </div>
                <div v-if="!item.shopImage"  style="width:200px;height:120px;background:#f3f3f3"></div>
            </div>
            <div style="margin-left:20px">
                <div class="font-title-mini">{{item.shopName}}</div>
                <div  style="margin-top:5px">{{item.address}}</div>
                <div  style="margin-top:5px">坐标：{{item.lat}},{{item.lng}}</div>
                <div  style="margin-top:5px">电话：{{item.phone}}</div>
                
            </div>
            <div style="margin-left:40px">
                <div  style="margin-top:0px">营业状态：<i-switch v-model="item.openStatus" @on-change="changeUpdate(item.sunwouId,'openStatus',item.openStatus)" size="small"></i-switch></div>
                <div style="margin-top:10px">配送模式：<i-switch v-model="item.sendMode" @on-change="changeUpdate(item.sunwouId,'sendMode',item.sendMode)" size="small"></i-switch></div>
                <div style="margin-top:10px">接单模式：<i-switch v-model="item.getMode" @on-change="changeUpdate(item.sunwouId,'getMode',item.getMode)" size="small"></i-switch></div>
                <div style="margin-top:10px"><a @click="navTo('/shopInsert')" href="javascript:;">修改基础信息</a></div>
            </div>
        </div>
        <Menu mode="horizontal" theme="light" active-name="/goods_1" @on-select="tabsClick">
            <MenuItem name="/goods_1">
                <Icon type="coffee"></Icon>
                商品
            </MenuItem>
            <MenuItem name="/category_1">
                <Icon type="grid"></Icon>
                类目
            </MenuItem>
            <MenuItem name="/specifications_1">
                <Icon type="steam"></Icon>
                规格库
            </MenuItem>
            <MenuItem name="/distribution">
                <Icon type="settings"></Icon>
                配送支持
            </MenuItem>
            <MenuItem name="/shopCoupon">
                <Icon type="settings"></Icon>
                店铺优惠
            </MenuItem>
        </Menu>
        <div style="margin-top:20px">
            <router-view></router-view>
        </div>
        
    </div>
</template>
<script>
var that;
export default {
  data() {
    return {
      shopDetail: []
    };
  },
  mounted() {
    that = this;
    this.getShopDetail();
    this.tabsClick("/goods_1")
  },
  methods: {
    navTo(path) {
      this.$router.push({ path: path ,query:{id:this.$route.query.id}});
    },
    changeUpdate(id,name,value){
        if(name == "isDelete"){
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>删除后将无法找回，确认要删除？</p>',
                    onOk: () => {
                        that.doChangeUpdate(id,name,value)
                    },
                    onCancel: () => {
                        
                    }
                });
        }else{
            this.doChangeUpdate(id,name,value)
        }
        
    },
    doChangeUpdate(id,name,value){
        if(id != null){
            that.doUpdate(id,name,value)
        }else{
            if(this.selection.length > 0){
                that.doUpdate(this.selection.toString(),name,value)
            }else{
                that.$Message.info("还没选类目呢")
            }
        }
    },
    doUpdate(id,name,value){
        var data = {ids:id}
        data[name] = value;
        this.com.post(this,'shop/update',data,function(res){
            if(res.code){
                that.$Notice.success({
                    title:res.msg
                })
            }
        })
    },
    tabsClick(e){
        if(e == '/distribution'){
            this.$router.push({path:e,query:{id:this.$route.query.id,range:this.shopDetail[0].range ? JSON.stringify(this.shopDetail[0].range):JSON.stringify([])}})
        }else if(e == '/shopCoupon'){
            this.$router.push({path:e,query:{id:this.$route.query.id,fullReduce:this.shopDetail[0].fullReduce}})
        }else{
            this.$router.push({path:e,query:{id:this.$route.query.id}})
        }
        
    },
    getShopDetail() {
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
      });
    }
  }
};
</script>
