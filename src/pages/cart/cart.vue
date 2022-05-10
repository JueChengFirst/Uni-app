<template>
<view>
<!-- 购物车存在内容 -->
  <view class="cart-container" v-if="cart.length !== 0">
      <!-- 收货地址区域 -->
      <view class="cart-address">
          <my-address></my-address>
      </view>

      <!-- 购物车标题区域 -->
      <view class="cart-title">
        <!-- 左侧图标区域 -->
        <uni-icons type="shop" size="18" />
        <!-- 右侧文本区域 -->
        <text class="cart-title-text">购物车</text>
      </view>

      <!-- 购物车商品区域  
            添加滑动删除效果 通过组件 uni-swipe-action 和子组件 uni-swipe-action-item共同实现
      -->
      <uni-swipe-action>
            <block v-for="(goods,i) in cart" :key="i">
              <uni-swipe-action-item :right-options="options"  @click="swipeActionClickHandler(goods)" >
                        <!--通过自定义 my-goods 组件来进行实现页面的渲染;
                               *showRadio参数 showNumberBox参数 为Boolean值 用来判断是否展示 raido组件/uni-number-box组件
                               *传递的参数为 goods对象,对象goods为cart数组里的每个对象
                               *组件my-goods 自定义事件 radio-change绑定的函数为 radioChange;
                                radio-change自定义事件需要组件my-goods进行处理返回数据 (e.goods_id e.goods_state)
                               *组件my-goods 自定义事件 num-change 绑定的函数为  numChange;
                                num-change自定义事件需要组件my-goods进行处理返回数据 (e.goods_id e.goods_count)
                          -->
                  <my-goods :goods="goods" :showRadio="true" :showNumberBox="true"  @radio-change="radioChange" @num-change="numChange"></my-goods>
              </uni-swipe-action-item>
              
          </block>
      </uni-swipe-action>
     
      <!-- 结算区域 -->
      <my-settle></my-settle>

  </view>

<!-- 购物车空空如也 -->
<view class="null-container" v-else>
    <image src="../../static/cart_empty.png" mode="scaleToFill"/>
    <text>空空如也</text>
</view>


</view>


</template>

<script>
/* 
      * badgeMix 为 mixins/tabbar-badge.js文件,实现tabBar页面徽标的显示
      * uniIcons 为 uni-ui组件库的矢量图标
      * mapState mapMutations 从vux中导入需要的辅助函数;
      (显然易见 mapState函数就是将vuex中模块的数据导入当前页面中,mapMutations函数就是将vuex中模块的方法导入当前页面中)
      * myGoods  为components文件夹中的 自定义组件my-goods
*/
import badgeMix from '@/mixins/tabbar-badge.js'
// 导入的 uni-ui 组件库中的 矢量图标组件  滑动删除组件
import {uniSwipeAction} from "@dcloudio/uni-ui"
// 从vuex中按需导入 mapState 这个辅助函数
import {mapState,mapMutations} from "vuex"
//导入自定义组件 my-goods my-address
import {myGoods}  from "../../components/my-goods/my-goods.vue"
import {MyAddress} from '../../components/my-address/my-address.vue'
import MySettle from '../../components/my-settle/my-settle.vue'

export default {
  /*
      使用在mixins文件夹中,tabbar-badge.js文件封装的数据
  */
  mixins: [badgeMix],
  /*
      所需要的组件 uniIcons uniSwipeAction  myGoods 
  */
  components:{myGoods,uniSwipeAction,MyAddress,MySettle},
  /*
      计算属性,将vuex中m_cart模块中的 cart数据导入页面中使用
  */
  computed:{
      //语法为 ...mapState('vuex中模块名称',['需要导入的模块数据1',......])
      ...mapState('m_cart',['cart']),
  },
  /*  
      data中的数据为 uni-swipe-action-item组件中需要的参数,
      text为文本内容, backgroundColor为背景颜色
      绑定在 right-options属性中
  */
  data() {
    return {
      options:[
        {
            text: '删除',
            style: {
                backgroundColor: '#C00000'
            }
        }
      ]
    };
  },
  /* 
        *自定义事件 raido-change可以调用 radioChange函数,
        接收到 my-goods组件中radioClick()函数传递的数据,将参数传递给 updateGoodsState()方法实现数据的改变
        *自定义事件 num-change 可以调用 numChange函数
        接收到my-goods组件中 numChange()函数传递的数据,将参数传递给 updateGoodsCount()方法实现数据的改变(这里的改变的就是cart数值中真实的数据)
        *swipeActionClickHandler()方法直接传递参数,将参数传递给clearGoods方法实现数据的删除
  */
  methods:{
    ...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','clearGoods'],),

   radioChange(e){
     //e.goods_id 和 e.goods_state 直接将cart数组中的 goods_state进行修改
     this.updateGoodsState(e);
   },
   
    //e.goods_id 和 e.goods_count 直接将cart数组中的 goods_count进行修改
   numChange(e){
        this.updateGoodsCount(e);
       
   },
  //根据 goods.goods_id 删除数组中的数据
  swipeActionClickHandler(goods){
       this.clearGoods(goods.goods_id);
    }

  }
};
</script>

<style lang='scss' scoped>
// 购物车标题区域样式
.cart-container{
    padding-bottom: 100rpx;
.cart-title{
  height: 80rpx;
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;

  .cart-title-text{
    margin-left: 10rpx;
    font-size: 14px;
  }
}
}
//没有内容下的购物车区域
.null-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 150rpx;
  image{
    display: block;
    width: 180rpx;
    height: 180rpx;
  }
  text{
    display: block;
    color: grey;
    font-size: 14px;
    margin-top: 15px;
  }
}
</style>