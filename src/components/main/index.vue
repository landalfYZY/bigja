<template>
    <transition name="el-fade-in-linear">
        <div>
            <BackTop></BackTop>
            <Layout >
                <Header>
                    <Menu mode="horizontal" theme="dark"  @on-select="meunSelect">
                        <div class="panel-between">
                            <div class="panel-start item-center">
                                <!-- logo st -->
                                <div class="panel-start item-center">
                                    <div class="logo-img panel-center item-center" ><img src="../../assets/logo/logo.png" alt=""></div>
                                    <div class="logo-text font-title-sm">大家地理达咖管理系统</div>
                                </div><!-- logo end -->
                                <div class="layout-nav" style="margin-left:20px">
                                    <MenuItem name="overview">
                                        <Icon type="ios-navigate"></Icon>
                                        操作文档
                                    </MenuItem>
                                </div>
                            </div>
                            <div class="panel-end item-center">
                                <Badge count="0">
                                    <Button type="ghost" icon="ios-chatboxes-outline" size="small" style="color:#fff;font-size:16px"></Button>
                                </Badge>
                                <Badge count="0" style="margin-left:20px">
                                    <Button type="ghost" icon="ios-bell-outline" size="small" style="color:#fff;font-size:16px"></Button>
                                </Badge>
                                <Dropdown trigger="click"  style="margin-left:50px">
                                    <a href="javascript:void(0)" style="display:block">
                                        <div class="panel-start item-center">
                                            <Avatar icon="person" size="small" />
                                            <div class="font-white" style="margin-left:10px">{{user.userName}}</div>
                                            <Icon class="font-white" style="margin-left:10px" type="arrow-down-b"></Icon>
                                        </div>
                                    </a>
                                    <DropdownMenu slot="list" >
                                        <DropdownItem>
                                            <div class="smeun-item panel-start item-center" @click="meunSelect('/own')">
                                                <Icon type="ios-gear-outline" size="16"></Icon>
                                                <div style="margin-left:10px">主体信息</div>
                                            </div>
                                        </DropdownItem>
                                        <!-- <DropdownItem>
                                            <div class="smeun-item panel-start item-center">
                                                <Icon type="ionic" size="16"></Icon>
                                                <div style="margin-left:10px">安全中心</div>
                                            </div>
                                        </DropdownItem> -->
                                        <DropdownItem>
                                            <div class="smeun-item panel-start item-center" @click="meunSelect('/login')">
                                                <Icon type="log-out" size="16"></Icon>
                                                <div style="margin-left:10px">退出登录</div>
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </Menu>
                </Header>
                <Layout :style="{padding: '0 50px'}">
                    <Breadcrumb :style="{margin: '16px 0'}">
                        <BreadcrumbItem v-for="(item,index) in routes" :key="index">{{item.name}}</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px 0', minHeight: contentHeight+'px', background: '#fff'}">
                        <Layout>
                            <Sider hide-trigger :style="{background: '#fff'}">
                            <!-- <Cascader v-model="searchNavText" :data="navUrl.items" filterable></Cascader> -->
                                <Menu :active-name="activeName" theme="light" width="auto" :open-names="[]" :style="{minHeight: (contentHeight-50)+'px'}" accordion @on-select="meunSelect">
                                    <MenuItem name="/overview">
                                        <Icon type="ios-home"></Icon>
                                        首页
                                    </MenuItem>
                                    <Submenu v-for="(item,index) in navUrl.items" :key="index" :name="index" v-show="user.appid || !item.zt">
                                        <template slot="title">
                                            <Icon :type="item.icon"></Icon>
                                            {{item.label}}
                                        </template>
                                        <MenuItem  v-for="(item2,index2) in item.children" v-if="item2.path" :key="index2" :name="item2.path">{{item2.label}}</MenuItem>
                                        <Submenu v-for="(item2,index2) in item.children" v-if="!item2.path" :key="index2" :name="item2.label" >
                                            <template slot="title">
                                                {{item2.label}}
                                            </template>
                                            <MenuItem  v-for="(item3,index3) in item2.children"  :key="index3" :name="item3.path">{{item3.label}}</MenuItem>
                                        </Submenu>
                                    </Submenu>
                                </Menu>
                            </Sider>
                            <Content :style="{padding: '0 24px', background: '#fff',}">
                                <router-view/>
                            </Content>
                        </Layout>
                    </Content>
                </Layout>
                <Footer class="layout-footer-center">2018 &copy; 浙江大家地理信息科技有限公司</Footer>
            </Layout>
        </div>
    </transition>
</template>
<script>
var navUrl = require("../../assets/js/nav.js");
var that;
export default {
  data() {
    return {
      activeName: "/overview",
      user: "",
      searchNavText: "",
      contentHeight: 0,
      routes: [],
      navUrl: navUrl.nav
    };
  },
  watch: {
    $route() {
      this.routes = this.$route.matched;
      if (this.$route.fullPath == "/main" || this.$route.fullPath == "/") {
        this.meunSelect("/overview");
        this.activeName = "/overview";
      } else {
        this.activeName = this.$route.fullPath;
      }
    }
  },
  mounted() {
    that = this;
    that.initMain();
    that.connectSocket();
  },
  methods: {
    connectSocket(){
        // var socket = new WebSocket(url, [protocol] );
    },
    initMain() {
      if (sessionStorage.getItem("user")) {
        this.user = JSON.parse(sessionStorage.getItem("user"));
        this.windowResize();
        this.routes = this.$route.matched;
        if (this.$route.fullPath == "/main" || this.$route.fullPath == "/") {
          this.meunSelect("/overview");
        } else {
          this.activeName = this.$route.fullPath;
        }
      } else {
        this.$router.push("/login");
      }
    },
    windowResize() {
      this.contentHeight = window.innerHeight - 64 - 62 - 60;
      $(window).resize(function() {
        that.contentHeight = window.innerHeight - 64 - 62 - 60;
      });
    },
    meunSelect(e) {
      if (e == "/login") {
        sessionStorage.removeItem("user");
        localStorage.setItem("autoLogin", false);
      }
      this.$router.push(e);
    }
  }
};
</script>
