<template>
  <view>
  <!--搜索组件区域  -->
    <view class="my-search">
      <my-search @click="gotoSearch"></my-search>
    </view>
  <!-- 轮播图区域   -->
    <swiper
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="1000"
      :circular="true"
    >
      <!-- 循环渲染轮播图 的 item 项  -->
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <!-- 
            点击轮播图实现跳转页面  声明式导航 跳转到subpages/goods_detail/goods_detail/item.goods_id 页面下 
            以后根据传递的参数 item.goods_id 来进行判断页面 从后端获取的数据.实现页面内容的不同展现
        -->
        <navigator
          class="swiper-item"
          :url="
            '/subpages/goods_detail/goods_detail?goods_id=' + item.goods_id
          "
          open-type="navigate"
        >
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src" mode="scaleToFill" />
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 导航栏区域 -->
    <view class="nav-list">
      <!-- 
          将navList 进行循环渲染 
          添加点击事件,navClickHandler 传入参数 item ==> 实现声明式导航跳转
      -->
      <view
        class="nav-item"
        v-for="(item, i) in navList"
        :key="i"
        @click="navClickHandler(item)"
      >
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>

    <!-- 楼层区域 -->
    <!-- 
      floor-main 需要进行循环 三次; 因为 floorList[] 数组结构为 [{0} {1} {2}]
   -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <!-- 楼层标题区域 -->
        <view class="floor-title">
          <image :src="item.floor_title.image_src" />
        </view>

        <!-- 楼层图片区域 -->
        <view class="floor-images">
          <!-- 左边图片部分 通过声明式导航 实现页面的跳转-->
          <navigator class="floor-image-left" :url="item.product_list[0].url" >
            <image
              :src="item.product_list[0].image_src"
              :style="{ width: item.product_list[0].image_width + 'rpx' }"
              mode="widthFix"
            ></image>
          </navigator>

          <!-- 右边图片部分 通过声明式导航 实现页面的跳转-->
          <view class="floor-image-right">
            <navigator class="floor-image-item" v-for="(item2, i2) in item.product_list" :key="i2" 
            v-show="i2 !== 0"
            :url="item2.url">
              <image
                :src="item2.image_src"
                :style="{ width: item2.image_width + 'rpx'}"
                 mode="widthFix"></image>
            </navigator>
          </view>

        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 导入自己封装的 mixin 模块
import badgeMix from '@/mixins/tabbar-badge.js'

export default {
   // 将 badgeMix 混入到当前的页面中进行使用
  mixins: [badgeMix],
  data() {
    return {
      //轮播图的数据列表,默认为空数组
      swiperList: [],
      //分类导航的数据的数据列表
      navList: [],
      //楼层的数据列表
      floorList: [],
    };
  },
  onLoad: function (options) {
    //页面刚加载的时候,调用获取轮播图数据的方式
    this.getswiperList();
    //页面刚加载的时候,调用获取导航栏数据的方式
    this.getnavList();
    //页面刚加载的时候,调用获取楼层数据的方式
    this.getFloorList();
  },

  methods: {
    //轮播图实现的方法
    async getswiperList() {
      //发送get请求获取数据
      const { data: res } = await uni.$http.get(
        "/api/public/v1/home/swiperdata"
      );
      //发送请求失败
      if (res.meta.status !== 200) {
        //调用 $showMsg() 全局方法 -->  全局配置的showToast()方法
        return uni.$showMsg();
      }
      //数据请求成功,将 data中的数据 存放到 swiperList中.
      this.swiperList = res.message;
    },
    //分类导航实现的方法
    async getnavList() {
      //发送get请求
      const { data: res } = await uni.$http.get("/api/public/v1/home/catitems");
      //请求失败调用 全局 方法 $showMsg()
      if (res.meta.status !== 200) return uni.$showMsg();
      //将成功的数据进行返回
      this.navList = res.message;
    },
    //分类导航中,触发点击事件 实心编程式导航
    navClickHandler(item) {
      //判断点击的是那个 nav 进而实现具体的跳转
      if (item.name === "分类") {
        //跳转的是 tabBar 标签
        uni.switchTab({
          url: "/pages/cate/cate",
        });
      }
    },
    //定义获取楼层列表数据的方式
    async getFloorList() {
      //获取数据的实现步骤 和 轮播图 导航栏相同
      const { data: res } = await uni.$http.get(
        "/api/public/v1/home/floordata"
      );
      if (res.meta.status !== 200) return uni.$showMsg();
      /* 
         为了方便实现点击图片实现向分包页面的跳转,获取数据后自定义添加url属性为跳转页面值.
          通过 双层 for循环来进行实现;
          第一层循环为获取对象 product_list
          第二层循环给 对象 product_list添加自定义属性 url
          prod.navigator_url.split('?')[1] 将prod的navigator_url属性通过?分割为两部分获取下标为[1]的部分
      */
  res.message.forEach(floor => {
    floor.product_list.forEach(prod => {
      prod.url = '/subpages/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
    })
  })
      this.floorList = res.message;
    },

    //搜索实现导航栏的跳转
    gotoSearch(){
      uni.navigateTo({
            url:"/subpages/search_list/search_list"
        })
    }
  },
};
</script>
<style lang='scss' scoped>
// 轮播图的样式
swiper {
  height: 340rpx;
  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}
//导航栏的样式
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15rpx 0;
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
//楼层区域的样式
.floor-list {
  .floor-title {
    height: 60rpx;
    width: 100%;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .floor-images {
    display: flex;
    justify-content: space-between;
    .floor-image-left{
      flex: 33.3%;
    }
    .floor-image-right{
      flex: 65.7%;
      flex-wrap: wrap;
      display: flex;
      justify-content: space-around;
      .floor-image-item{
        padding-left: 10rpx;
      }

    }
  }
}
.my-search{
  // 设置定位效果为“吸顶”
  position: sticky;
  // 吸顶的“位置”
  top: 0;
  // 提高层级，防止被轮播图覆盖
  z-index: 999;
  margin-top: -20px;
}
</style>