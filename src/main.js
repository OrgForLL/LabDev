// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

// 使用ElementUI
Vue.use(ElementUI)

// 导入axios
import axios from "axios"
// 导入babel-polyfill兼容IE
import 'babel-polyfill'
const http = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

const httpPost = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(config => {
  if (config.method === 'get') {
    //  给data赋值以绕过if判断
    config.data = true 
  }

  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return config
})

httpPost.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json'
  return config
})

// 设置基础URL地址
// 方法1.http.defaults.baseURL = './api'
// 方法2.
const APIUTL = '../../service/HttpRequestSkill.ashx'
// const APIUTL = './api'
window.APIUTL = APIUTL;

// 导入babel-polyfill兼容IE
import 'babel-polyfill'

// 使用axios
Vue.prototype.$axios = http
Vue.prototype.$axiosPost = httpPost

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})




