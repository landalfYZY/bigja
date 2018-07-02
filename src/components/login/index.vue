<template>
    <transition name="el-fade-in-linear">
        <div style="width:100%">
            <div style="width:100%;text-align:center;margin-top:50px"> 
                <img src="../../assets/logo/logo.png" width="50px" alt="">
                <div class="font-title bold">大家地理后台管理系统</div>
            </div>
            <div class="login-panel" >
                <div style="width:100%;text-align:Center" class="font-title-mini">登录后台开始你的工作</div>
                <Input v-model="login.userName" size="large" style="margin-top:15px" placeholder="账号" />
                <Input v-model="login.passWord" type="password" size="large" style="margin-top:15px" placeholder="密码" />
                <div class="panel-between" style="margin-top:15px"> 
                    <Checkbox v-model="remember">记住密码</Checkbox>
                    <Checkbox v-model="autoLogin">自动登录</Checkbox>
                </div>
                <Button type="primary" size="large" style="margin-top:15px" :loading="registLoading" @click="registSubmit()" long>登录</Button>
                <div class="panel-between" style="margin-top:15px">
                    <a href="#" @click="showModal = true" >忘记密码?</a>
                    <router-link to="/register"><a href="#" >注册</a></router-link>
                </div>
            </div>
            <div style="width:100%;text-align:center;margin-top:40px" class="font-grey">version 2018 版权归 浙江大家地理信息科技有限公司 所有</div>
            <div style="width:100%;text-align:center;margin-top:5px" class="font-grey" @click="showModal = true"><a href="#" >联系开发人员</a></div>

            <Modal v-model="showModal" title="温馨提示" width="400">
                <p>开发人员太辛苦</p>
                <p><img src="../../assets/img/wxp.jpg" width="100%" alt=""></p>
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
        userName: "",
        passWord: ""
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
    if(localStorage.getItem('userName')){
      this.login.userName = localStorage.getItem('userName')
      this.login.passWord = localStorage.getItem('passWord')
    }
    if(localStorage.getItem('remember')){
      this.remember = true
    }
    if(localStorage.getItem('autoLogin') && localStorage.getItem('autoLogin') == true){
      this.remember = true
      this.autoLogin = true
      this.registSubmit()
    }
  },
  methods: {
    registSubmit() {
      this.registLoading = true
      $.ajax({
        url: sessionStorage.getItem("API") + "app/login",
        data: this.login,
        dataType: "json",
        method: "post",
        success(res) {
          that.registLoading = false
          if (res.code) {
            sessionStorage.setItem("user", JSON.stringify(res.params.msg));
            sessionStorage.setItem("token", res.params.token);
            that.$router.push({ path: "/" });

            localStorage.setItem('remember',that.remember)
            localStorage.setItem('autoLogin',that.autoLogin)

            if(that.remember){
              localStorage.setItem('userName',that.login.userName)
              localStorage.setItem('passWord',that.login.passWord)
            }
          }
        }
      });
    },
    registReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>

