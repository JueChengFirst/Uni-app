<template>
  <view>
    <!-- 创建组件页面 -->
    <view class="goods-list"  >
      <!-- 左边商品图片区域 -->
      <view class="goods-item-left" >
        <!--
              *radio组件, 通过if判断是否进行隐藏,判断的条件通过页面外界传入的showRadio值来决定,默认情况下为隐藏状态;
              *通过 goods_state属性来进行判断 商品是否被选中
            
              *给radio组件添加绑定事件,当raido按钮被点击时,改变goods_state的状态 向自定义事件 @radio-change 传递数据;
        -->
        <radio v-if="showRadio" :checked="goods.goods_state" color="#C00000"  @click="radioClick"></radio>

        <image :src="goods.goods_small_logo || default_img" class="goods-img" />

      </view>

      <!-- 右边商品信息区域 -->
      <view class="goods-item-right">
        <!-- 商品标题-->
        <view class="goods-name">{{ goods.goods_name}}</view>

         <view class="goods-info-box">
        <!-- 商品价格 -->
         <view class="goods-price">￥{{goods.goods_price}}</view>

        <!-- 商品购买的数量,通过uni-ui的 NumberBox组件来实现
              *uni-number-box组件,通过if判断是否进行隐藏,判断的条件通过页面外界传入的showNumberBox值来决定,默认情况下为隐藏状态
              *min为商品最少的数量  max为商品最多的数量
              *value值表示当前商品选购的数量  

              *给uni-number-box组件添加绑定事件,当组件数据发生改变时,获取到goods_count数值为 vla 向自定义事件 @radio-change 传递数据; 
         -->
         <uni-number-box v-if="showNumberBox" :min="1" :value="goods.goods_count" @change="numClick"></uni-number-box>

        </view>

      </view>
    </view>
  </view>
</template>

<script>
import {uniNumberBox} from '@dcloudio/uni-ui'
export default {
  components:{uniNumberBox},
  /* 
      props接收外部传递的参数,来实现页面的动态更新 
        *goods 接收cart数组中的每一对象,默认值为空
        *showRadio     接收 传递的bool值 默认为 false 
        *showNumberBox 接收 传递的bool值 默认为 false
  */
  props: {
    goods: {
      //数据类型为对象
      type: Object,
      default: {},
    },
    showRadio:{
      type:Boolean,
      default:false
    },
    showNumberBox:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      //有些商品图片不存在,为了美观放入默认图片
      default_img:
        "https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png",
    };
  },
  methods:{
  /*  radio 组件的点击事件处理函数
      *通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
      *同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
      num-box组件的点击事件处理函数
      *通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件，
      *将商品的Id 和 商品数值 的数据传递给 num-change 事件处理函数
  */
  radioClick() {
  
    this.$emit('radio-change', {
      //被点击的商品 Id 
      goods_id: this.goods.goods_id,
      //商品最新的勾选状态 点击之后和默认状态进行取反
      goods_state: !this.goods.goods_state
      })
    },
  numClick(val){
      this.$emit('num-change',{
        //改变的商品 Id
        goods_id:this.goods.goods_id,
        //商品当前的数量
        goods_count: +val
      })
  }
  }
 
};
</script>
<style lang='scss' scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  border: 1px solid #f0f0f0;
  padding: 10px 5px;
  .goods-item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-left: 5px;
    .goods-img {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    .goods-name {
      font-size: 13px;
    }
.goods-info-box{
   display: flex;
   justify-content: space-between;
  .goods-price {
      font-size: 16px;
      color: #c00000;
    }
}
    
  }
}
</style>