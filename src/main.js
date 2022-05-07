import Vue from 'vue'
import App from './App'

//配置网络请求
//按需 从 @escook/request-miniprogram包中 导入 $http 对象
import { $http } from "@escook/request-miniprogram"

//在 uni-app 项目中,将 $http 挂载到 uni 顶级对象上,方便全局调用
uni.$http = $http;

//配置请求的 根路径
$http.baseUrl = "https://www.uinav.com";

// 配置请求拦截器    请求开始之前做一些事情
$http.beforeRequest = function (options) {

  uni.showLoading({
    title: '数据加载中...',
  })

}
//配置响应拦截器  请求完成之后做一些事情
$http.afterRequest = function () {
  //关闭 showLoading() 
  uni.hideLoading();
}

/*
    封装uni.$showMsg()方法, 用户请求失败后直接调用$showMsg()方法,$showMsg()方法就是全局封装的uni.showToat()方法;
    正因为全局封装uni.$showMsg()方法,简化了uni.showToast()方法的调用.
*/
uni.$showMsg = function (title = "数据加载失败", duration = 1500, icon = "none") {
  //可以传递三个 参数  标题 出现的时间 是否展示图标,可以自己更改否则就是默认行为
  uni.showToast({
    title,
    duration,
    icon
  })

}

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
