/*
        创建购物车的 Vuex --> cart.js
*/
import Vue from 'vue'
import Vuex from "vuex"

Vue.use(Vuex);

export default {
    //为当前模块开启命名空间
    namespaced: true,
    // 模块的 state 数据
    state: () => ({
        /*   购物车的数组，用来存储购物车中每个商品的信息对象
             每个商品的信息对象，都包含如下 6 个属性：
             { goods_id(id号), goods_name(商品名称), goods_price(价格), 
             goods_count(数量), goods_small_logo(图片), goods_state(状态 勾选/为勾选) }
        */
        cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
    }),

    // 模块的 mutations 方法
    mutations: {
        /* 
            *创建 addToCart()方法 根据提交商品的Id,来进行查询购物车中是否存在这件商品;
             存在的话(找到的为商品信息对象)直接进行数量++ , 不存在的话(findReuslt为undefined)进行商品的添加;
             判断的变量为 findResult 通过find()方法循环数组,item为数组的每一项;判断是否item.id和goods.id相同
        */
        addToCart(state, goods) {
            const findResult = state.cart.find((item) => item.goods_id === goods.goods_id);

            if (!findResult) {
                //购物车中不存在这件商品,调用数组的push方法进行添加
                state.cart.push(goods);
            } else {
                //存在这件商品,更新数量即可
                findResult.goods_count++;
            }
            this.commit('m_cart/saveToStorage')
        },
        /*  
            *更新购物车中商品的勾选状态,创建 updateGoodsState()方法,根据提交商品的id,来进行确定对哪一件商品进行操作,
             将找的的对象赋值给 findReuslt;
             判断对象findResult 是否存在,存在的化更改商品勾选的状态;
             并且持久化存储到本地
        */
        updateGoodsState(state, goods) {
            // 根据 goods_id 查询购物车中对应商品的信息对象
            const findResult = state.cart.find(items => items.goods_id === goods.goods_id);
            // 有对应的商品信息对象
            if (findResult) {
                // 更新对应商品的勾选状态
                findResult.goods_state = goods.goods_state
                // 持久化存储到本地
                this.commit('m_cart/saveToStorage')
            }
        },
        /* 
            *更新购物车中商品的数量,创建updateGoodsCount()方法,还是根据商品的id,来进行寻找;
             做法和updateGoodsState()方法相同,不过是更改商品的状态
        */
        updateGoodsCount(state, goods) {
            // 根据 goods_id 查询购物车中对应商品的信息对象
            const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

            if (findResult) {
                // 更新对应商品的数量
                findResult.goods_count = goods.goods_count
                // 持久化存储到本地
                this.commit('m_cart/saveToStorage')
            }
        },
        /*
            *删除购物车中的商品,通过数组的 filter()方法将满足条件的数据保留下拉传递给 state.cart数组;
            不满足的数据直接过滤掉.
         */
        clearGoods(state, goods_id) {
            // 调用数组的 filter 方法进行过滤
            state.cart = state.cart.filter(x => x.goods_id !== goods_id)
            // 持久化存储到本地
            this.commit('m_cart/saveToStorage')
        },
        /* 
            *更新所有商品的勾选状态
        */
       updateAllGoodsState(state,newState){

           state.cart.forEach(item=>item.goods_state = newState);
           // 持久化存储到本地
           this.commit('m_cart/saveToStorage')
       },
        // 将购物车中的数据持久化存储到本地
        saveToStorage(state) {
            uni.setStorageSync('cart', JSON.stringify(state.cart))
        },

    },

    // 模块的 getters 属性
    getters: {
        //统计购物车中商品的数量
        total(state) {
            let sum = 0;
            //循环统计商品的数量,累加到 sum中
            state.cart.forEach(goods => sum += goods.goods_count);

            return sum
        },
        //购车中已经勾选的商品数量
        checkedCount(state){
            //1.首先将勾选的数据进行filter筛选出来,传递给参数 res数组
            const res =  state.cart.filter(x => x.goods_state);
            //2.将通过数组的 reduce()方法 将已勾选的商品总数量进行累加 
            const Sum =  res.reduce((sum,item)=> {return sum +=item.goods_count},0);
            //3.所以现在checkedCount数据为 为sum的数据
            return Sum;
        },
        //计算出所有选中商品的价格
        checkedGoodsAmount(state){
            /* 
                *筛选出所有选中状态的商品;
                *将每个选中的商品,数目*价格 计算出总价钱
                *保留两位小数.
            */
            return state.cart.filter(item => item.goods_state)
                             .reduce((total,items) => {return total+= items.goods_count * items.goods_price} ,0)
                             .toFixed(2);
        }
    },

}