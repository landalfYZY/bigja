var API = 'http://192.168.31.250/jf/';
var APPID = 'wx9676e5a723951d1a';

var config = {
    pageSize:10,
    pageSizeList:[
        {label:'每页 10 条',value:10}, {label:'每页 20 条',value:20},{label:'每页 30 条',value:30},
        {label:'每页 50 条',value:50},{label:'每页 100 条',value:100},{label:'每页 150 条',value:150},
        {label:'每页 200 条',value:200},{label:'每页 500 条',value:500},{label:'每页 1000 条',value:1000},
        {label:'每页 5000 条',value:5000},{label:'每页 10000 条',value:10000}
    ]
};

var globleData = {
    userInfo:null,
    token:''
}

function login(that,url,username,password,methods,loading){
    post(that,url,{
        userName:username,
        passWord:password
    },function(res){
        methods(res);
        globleData.userInfo = res.params.msg;
        globleData.token = res.params.token;
    },loading)
}

/**
 * 通用查找方法
 */
function query(that,url,query,loading){
    post(that,url,{query:query},function(res){
        that.list = res.params.msg;
        that.total = res.params.total;
    },loading)
}
function find(that,url,name,data){
    post(that,url,data,function(res){
        if(res.code){
            that[name] = res.params.msg
        }
    })
}


/**
 * http请求接口 post类型
 * @param {*} that 
 * @param {地址} url 
 * @param {参数} data 
 * @param {回调函数} method 
 */
function post(that,url,data,method,loading){
    $.ajax({
        url: API+url,
        data:data,
        method:'post',
        dataType:'json',
        complete(res){
            if(loading){
                that[loading] = false;
            }
            if(res.status == 200){
                if(res.responseJSON.code){
                    method(res.responseJSON);
                }else{
                    that.$Message.error(res.responseJSON.msg);
                }
            }else {
                method({code:res.status,msg:res.statusText});
                that.$Message.error(res.status + res.statusText);
            }
        }
    })
}


module.exports = {
    API:API,
    config:config,
    post:post,
    globleData:globleData,
    query:query,
    find:find,
    login:login,
    APPID:APPID
}