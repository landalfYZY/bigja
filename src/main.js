// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import $ from 'jquery';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueQuillEditor from 'vue-quill-editor';
import com from './assets/js/common';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';


Vue.use(vueQuillEditor);
Vue.prototype.com = com;
Vue.prototype.webso = null;
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(ElementUI);
sessionStorage.setItem('API','https://www.sunwou.com/jf/')
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
