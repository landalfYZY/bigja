import Vue from 'vue'
import Router from 'vue-router'

import login from '../components/login'
import main from '../components/main'
import overview from '../components/overview'
import register from '../components/register'
import wxuser from '../components/wxuser'

import receiptPanel from '../components/receipt/receiptPanel'

import printSet from '../components/setup/printSet'

import power from '../components/role/power'
import powerInsert from '../components/role/power_insert'
import powerCategory from '../components/role/power_category'
import roleInsert from '../components/role/role_insert'
import role from '../components/role/role'

import gallery from '../components/gallery/gallery'

import shop from '../components/shop/shop'
import shopInsert from '../components/shop/shop_insert'
import shopDetail from '../components/shop/shopDetail'
import distribution from '../components/shop/distribution'
import shopCoupon from '../components/shop/coupon'

import category from '../components/goods/category'
import goods from '../components/goods/goods'
import specifications from '../components/goods/specifications'
import goodsInsert from '../components/goods/goodsInsert'

import coupon from '../components/coupon/coupon'
import couponChange from '../components/coupon/couponChange'

import orgnizationUser from '../components/orgnization/user'
import orgnizationUserInsert from '../components/orgnization/userInsert'

import getorder  from '../components/getOrder/getOrder'
import tableexpend from '../components/template/tableexpend'
import goodsorder from '../components/order/goodsorder'
import cardorder from '../components/order/cardorder'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', name: '登录', component: login },
    { path: '/register', name: '注册', component: register },
    { path: '/', name: '--', component: main ,children:[
      { path: '/overview', name: '概览', component: overview },
      { path: '/receiptPanel', name: '接单面板', component: receiptPanel },

      { path: '/printSet', name: '打印设置', component: printSet },

      { path: '/power', name: '权限列表', component: power },
      { path: '/powerInsert', name: '新增权限', component: powerInsert },
      { path: '/powerCategory', name: '新增权限分类', component: powerCategory },
      { path: '/roleInsert', name: '新增角色', component: roleInsert },
      { path: '/role', name: '角色列表', component: role },

      { path: '/gallery', name: '图库', component: gallery },

      { path: '/shop', name: '店铺列表', component: shop },
      { path: '/shopDetail', name: '店铺详情', component: shopDetail ,children:[
        { path: '/goods_1', name: '商品列表', component: goods },
        { path: '/category_1', name: '分类列表', component: category },
        { path: '/specifications_1', name: '规格列表', component: specifications },
        { path: '/goodsInsert_1', name: '新增商品', component: goodsInsert },
        { path: '/distribution', name: '配送地址', component: distribution },
        { path: '/shopCoupon', name: '店铺优惠', component: shopCoupon },
        { path: '/getorder_1', name: '接单列表', component: getorder },
        { path: '/tableexpend', name: 'table expend', component: tableexpend },
      ]},

      { path: '/shopInsert', name: '店铺信息', component: shopInsert },
      { path: '/wxuser', name: '微信用户', component: wxuser },

      { path: '/coupon', name: '优惠券列表', component: coupon },
      { path: '/couponChange', name: '优惠券', component: couponChange },
      
      { path: '/orgnizationUser', name: '组织架构', component: orgnizationUser },
      { path: '/orgnizationUserInsert', name: '新增用户', component: orgnizationUserInsert },

      { path: '/getorder', name: '接单列表', component: getorder },

      { path: '/goodsorder', name: '商品订单列表', component: goodsorder },
      { path: '/cardorder', name: '购卡订单列表', component: cardorder },
    ]},
   
  ]
})
