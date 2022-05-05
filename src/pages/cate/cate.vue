<template>

<view>
  <!-- 自定义的组件 
         自定义事件,实现页面的跳转;在组件页面必须配置触发事件;
         触发事件中添加 this.$emit('自定义事件名称')
  -->
  <view class="my-search" @click="gotoSearch">
          <my-search ></my-search>
  </view>

 <!-- 搭建分类页面 -->
  <view class="scroll-view-container">

    <!--  左侧的滚动视图区域  一级列表区域
                 使用组件 scroll-view实现滑动效果,必须配置 scroll-y滑动方向和高度;
                 获取设备页面可用高度 方法uni.getSystemInfo().windowHeight实现 
                通过遍历cateList[]数组,实现页面结构的渲染  
      -->
    <scroll-view
      scroll-y
      class="left-scroll-view"
      :style="{height: ht + 'px'}">
    <!-- 触发点击事件changeActive 传递参数 i1 为索引,将i1赋值给active.
         :class ="['left-scroll-items', i1 === active ? 'active' : '']"
         类名为 left-scroll-items 当 i1 和 active 的数值相同的时候,添加类名 highlight 添加样式.
     -->
     <block  v-for="(item1, i1) in cateList" :key="i1">
         <view @click="changeActive(i1)" :class="['left-scroll-items', i1 === active ? 'highlight' : '']">
                   {{ item1.cat_name }}
        </view>
     </block>
     
    </scroll-view>

<!-- 右侧的滚动视图区域   二级三级列表区域-->
   <scroll-view class="right-scroll-view" scroll-y :style="{height:ht+'px'}" :scroll-top="scrollTop">
            <block v-for="(item2 ,i2) in cateLevelTwo" :key="i2">
                  <!-- 二级列表区域 -->
                  <view class="right-scroll-title">/{{item2.cat_name}}/</view>
                  <!-- 三级列表区域 -->
                  <view class="right-scroll-images" >
                        <view class="right-scroll-iamges-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
                        <!-- 图片 -->
                        <image :src="item3.cat_icon"></image>
                         <!-- <image src="https://notebook-img.oss-cn-shanghai.aliyuncs.com/test/202205040947300.png"></image> -->
                         <!-- 文本 -->
                        <text>{{item3.cat_name}}</text>

                        </view>
                       
                  </view>
            </block>
   </scroll-view>
  </view>

</view>
 
</template>

<script>
// 导入组件 
import mySearch from '../../components/my-search/my-search.vue';

export default {
  components: { mySearch },
  data() {
    return {
      //分类数据列表  所有分类列表数据
      cateList: [],
      //设备可用高度
      ht: 0,
      //当前选中项的数值
      active: 0,
      //二级列表数据
      cateLevelTwo:[],
      //滚动条距离顶部的距离
      scrollTop:0
    };
  },
  onLoad: function (options) {
    //页面加载的时候,直接进行调用getCateList()方法 --> 发送get请求数据.
    this.getCateList();
    //获取 设备信息 --> 调用 uni.getSystemInfoSync()方法
    const systemInfo = uni.getSystemInfoSync();
    //将设备可用高度 赋值给 height
    this.ht = systemInfo.windowHeight - 60;

  },
  methods: {
      /*
           获取数据三步 : 1.get请求 2.判断是否获取 3.转存数据 
      */
    async getCateList() {
      const { data: res } = await uni.$http.get("/api/public/v1/categories");
      if (res.meta.status !== 200) return uni.$showMsg();
      this.cateList = res.message;
      //二级列表数据初识化
      this.cateLevelTwo =  this.cateList[0].children;
    },
     //改变 active 的值
    changeActive(i1) {
      this.active = i1;
      //动态的更新二级列表数据 --> 将cateList[i1].children属性赋值给cateLevelTwo
      this.cateLevelTwo=this.cateList[i1].children

      /*
          当触发changeActive事件,表示一级列表选中位置发生改变;
          需要将左侧列表区域回到最顶端( 1px 和 0px 之间具有很小的差距可以忽视)
      */
      this.scrollTop = this.scrollTop ===0  ? 1 : 0;
    },

    //实现页面跳转,编程式导航
   gotoGoodsList(item3){
        uni.navigateTo({ 
          url: '/subpages/goods_list/goods_list?cid='+item3.cat_id 
        })
    },

    //实现搜索组件的页面跳转
    gotoSearch(){
      
      uni.navigateTo({
            url:"/subpages/search_list/search_list"
        })
    }
 
  } 
};
</script>
<style lang='scss' scoped>
.scroll-view-container {
 display: flex;
  .left-scroll-view {
    width: 120px;
    .left-scroll-items {
      line-height: 60rpx;
      text-align: center;
      font-size: 12px;
      background-color: #f7f7f7;
      // 触碰的样式 &表示当前元素
      &.highlight {
        background-color: #ffffff;
        position: relative;
        //触碰样式后添加其他样式
        &::before {
          content: " ";
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }

  .right-scroll-view{
              
        .right-scroll-title{
              text-align: center;
              font-size: 15px;
              font-weight: 900;
        }
        .right-scroll-images{
              display: flex;
              flex-wrap:wrap;
              justify-content: space-around;
            .right-scroll-iamges-item{
                  width: 33.3%;
                  margin-bottom: 10px;
                  display: flex;
                  flex-direction: column;
                  align-content: center;
                  justify-content: center;
                  image{
                        width: 60px;
                        height: 60px;
                        margin: 0 auto;
                  }
                  text{
                        text-align: center;
                        font-size: 12px;
                  }
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
}
</style>