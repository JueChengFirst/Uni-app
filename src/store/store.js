/* 
      创建全局 vueX  实现数据的共享
      1.导入 vue 和 vuex 
      2.在vue中配置 插件 vuex
      3.实例化 store 对象
      4.将store实例化 对象 进行导出
*/
import  Vue from 'vue'
import Vuex from "vuex"
//1.导入 购物车的 Vuex模块
import moduleCart from './cart.js'
//导入  用户收货地址 Vuex模块
import moduleUser from "./user.js"

Vue.use(Vuex);

const store = new Vuex.Store({
    //共享的数据
    modules:{
        //2.挂载购物车的 Vuex模块,模块内成员的访问路径被调整为 m_cart;
        m_cart: moduleCart,
        //挂载用户收货地址的 Vuex模块,将模块内成员的访问路径被调整为 m_user;
        m_user: moduleUser,
    },
});

export default  store ;