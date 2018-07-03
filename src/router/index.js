import Vue from 'vue'
import Router from 'vue-router'

import login from '../components/login'
import main from '../components/main'
import overview from '../components/overview'

import receiptPanel from '../components/receipt/receiptPanel'

import printSet from '../components/setup/printSet'

import power from '../components/role/power'



Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', name: '登录', component: login },
    { path: '/', name: '--', component: main ,children:[
      { path: '/overview', name: '概览', component: overview },
      { path: '/receiptPanel', name: '接单面板', component: receiptPanel },

      { path: '/printSet', name: '打印设置', component: printSet },

      { path: '/power', name: '权限列表', component: power },
    ]}
  ]
})
