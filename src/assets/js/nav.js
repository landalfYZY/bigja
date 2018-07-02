var nav = {
    config:{},
    items:[
        {icon:'speakerphone',label:'通知广告',zt:true,children:[
            {label:'广告列表',path:'/carousel'},
            {label:'公告列表',path:'/notice'},
        ]},
        {icon:'speakerphone',label:'图库管理',zt:true,children:[
            {label:'图库列表',path:'/carousel'},
        ]},
        {icon:'speakerphone',label:'接单管理',zt:true,children:[
            {label:'接单面板',path:'/receiptPanel'},
            {label:'接单记录',path:'/carousel'},
        ]},
        {icon:'network',label:'角色管理',zt:true,children:[
            {label:'角色列表',path:'/school'},
            {label:'新增角色',path:'/schoolAdd'},
            {label:'权限列表',path:'/wxuser'},
            {label:'新增权限',path:'/wxuser'},
        ]},
        {icon:'ios-book',label:'收银管理',children:[
            {label:'收银员',path:'/student'},
            {label:'排班',path:'/studentAdd'},
        ]},
        {icon:'social-hackernews',label:'进销存管理',children:[
            {label:'缴费项列表',path:'/payList'},
            {label:'新增缴费项',path:'/payAdd'}
        ]},
        {icon:'social-python',label:'店铺管理',children:[
            {label:'店铺列表',path:'/bankCard'},
            {label:'新增店铺',path:'/bankCardAdd'}
        ]},
        {icon:'record',label:'款项记录',children:[
            {label:'订单记录',path:'/orderRecord'},
            {label:'退款记录',path:'/bankCardAdd'},
            {label:'提现记录',path:'/bankCardAdd'}
        ]},
        // {icon:'ios-paper',label:'日志',children:[
        //     {label:'操作日志',path:'#'},
        //     {label:'系统日志',path:'#'},
        //     {label:'系统更新日志',path:'#'},
        //     {label:'异常分析',path:'#'}
        // ]},
        // {icon:'ios-gear',label:'系统设置',children:[
        //     {label:'个人操作设置',path:'#'},
        //     {label:'系统基础设置',path:'#'}
        // ]},
    ]
}

module.exports = {
    nav:nav
}