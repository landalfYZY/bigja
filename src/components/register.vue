<template>
    <transition name="el-fade-in-linear">
        <div style="width:100%">
            <div style="width:100%;text-align:center;margin-top:50px"> 
                <img src="../assets/logo/logo.png" width="50px" alt="">
                <div class="font-title bold">大家地理后台管理系统</div>
            </div>
            <div class="login-panel" >
                <div style="width:100%;text-align:Center" class="font-title-mini">用户注册</div>
                <Input v-model="login.userName" size="large" style="margin-top:15px" placeholder="用户名" />
                <Input v-model="login.passWord" type="password" size="large" style="margin-top:15px" placeholder="密码" />
                <Input v-model="login.rpassWord" type="password" size="large" style="margin-top:15px" placeholder="确认密码" />
                <Button type="primary" size="large" style="margin-top:15px" :loading="registLoading" @click="registSubmit()" long>立即注册</Button>
                <div class="panel-between" style="margin-top:15px">
                   
                    <router-link to="/login"><a href="#" >返回登录</a></router-link>
                     <a href="#"  ></a>
                </div>
            </div>
            <div style="width:100%;text-align:center;margin-top:40px" class="font-grey">version 2018 版权归 浙江大家地理信息科技有限公司 所有</div>
            <div style="width:100%;text-align:center;margin-top:5px" class="font-grey" @click="showModal = true"><a href="#" >联系开发人员</a></div>

            <Modal v-model="showModal" title="温馨提示" width="400">
                <p>开发人员太辛苦</p>
                <p><img src="../assets/img/wxp.jpg" width="100%" alt=""></p>
            </Modal>

        
        </div>
    </transition>
</template>
<style>
body {
  background: #f3f3f3;
}
</style>

<script>
var that;
export default {
  data() {
    return {
      login: {
        groupId:this.com.APPID,
        roleId:'500b4-20180704151639812',
        userName: "",
        passWord: "",
        rpassWord:''
      },
      remember:false,
      autoLogin:false,
      registLoading: false,
      regModal: false,
      showModal: false
    };
  },
  mounted() {
    that = this;
  },
  methods: {
    registSubmit() {
      this.registLoading = true
      if(this.passWord != '' && this.passWord == this.rpassWord){
          this.com.post(that,'user/add',this.login,function(res){
              if(res.code){
                  that.$Notice.success({
                      title:'注册成功'
                  })
              }
          },'registLoading')
      }
    },

  }
};
</script>

