<template>
    <div>
        <div class="panel-start" style="background:#f3f3f3;padding:15px" v-for="item in shopDetail" :key="item.sunwouId">
            <div>
                <img v-if="item.shopImage"  height="120px" :src="item.shopImage" style="border:1px solid #000">
                <div v-if="!item.shopImage"  style="width:200px;height:120px;background:#f3f3f3"></div>
            </div>
            <div style="margin-left:20px">
                <div class="font-title-mini">{{item.shopName}}</div>
                <div  style="margin-top:5px">{{item.address}}</div>
                <div  style="margin-top:5px">坐标：{{item.lat}},{{item.lng}}</div>
                <div  style="margin-top:5px">电话：{{item.phone}}</div>
                
            </div>
            <div style="margin-left:40px">
                <div  style="margin-top:0px">营业状态：<i-switch v-model="item.openStatus"></i-switch></div>
                <div style="margin-top:10px">配送模式：<i-switch v-model="item.sendMode"></i-switch></div>
                <div style="margin-top:10px">接单模式：<i-switch v-model="item.getMode"></i-switch></div>
            </div>
        </div>
        <Menu mode="horizontal" theme="light" active-name="/goods_1" @on-select="tabsClick">
            <MenuItem name="/goods_1">
                <Icon type="ios-paper"></Icon>
                商品
            </MenuItem>
            <MenuItem name="/category_1">
                <Icon type="ios-people"></Icon>
                类目
            </MenuItem>
            <MenuItem name="2">
                <Icon type="ios-people"></Icon>
                规格
            </MenuItem>
            <MenuItem name="4">
                <Icon type="settings"></Icon>
                综合设置
            </MenuItem>
        </Menu>
        <div style="margin-top:20px">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import category from '../goods/category';
import goods from '../goods/goods'
var that;
export default {
  components:{
      category,goods
  },
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
    tabsClick(e){
        this.$router.push({path:e,query:{id:this.$route.query.id}})
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
