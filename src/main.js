// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole

// let vConsole = new VConsole() // 初始化

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
const APIUTL = '../ErpScan/HttpRequestSkill.ashx'
window.APIUTL = APIUTL;

const APIUTLFile = '../ErpScan/HttpRequestSkillFile.ashx'
window.APIUTLFile = APIUTLFile;

//从哪里获取数据标签信息，正式的时候从tm下面，测试的时候从231
let NetUrl = 'http://tm.lilanz.com/'

if (process.env.type == 'test') {
  NetUrl='http://192.168.35.231/'
}
window.NetUrl = NetUrl;

//上传路径，tm下面不能访问myupload的只能跳到9001
let NetUrlUpload = 'http://webt.lilang.com:9001/'
if (process.env.type == 'test') {
  NetUrlUpload='http://192.168.35.231/'
}
window.NetUrlUpload = NetUrlUpload;

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