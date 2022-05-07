<template>
  <view>
    <!-- 创建组件页面 -->
    <view class="goods-list"  >
      <!-- 左边商品图片区域 -->
      <view class="goods-item-left">
        <image :src="goods.goods_small_logo || default_img" class="goods-img" />
      </view>

      <!-- 右边商品信息区域 -->
      <view class="goods-item-right">
        <!-- 商品标题-->
        <view class="goods-name">{{ goods.goods_name}}</view>

         <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price}}</view>
        </view>

      </view>
    </view>
  </view>
</template>

<script>
export default {
  // props接收外部传递的参数,来实现页面的动态更新
  props: {
    goods: {
      //数据类型为对象
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      //有些商品图片不存在,为了美观放入默认图片
      default_img:
        "https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png",
    };
  },
};
</script>
<style lang='scss' scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  border: 1px solid #f0f0f0;
  padding: 10px 5px;
  .goods-item-left {
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

    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>