<template>
  <view>
      <!--  搜索页面的搭建 
        uni-ui中的组件服务于整个页面
              顶部搜索框区域
              * 创建顶部搜索框,通过 uni-ui框架 的uni-search-bar组件 和 uni-icon组件来进行实现
              * 当搜索表单的 value 值发送改变的时候,触发input事件 返回参数为value值.
              * 自动获取焦点 修改uni-search-bar.vue组件 在node_modules/@dcloudio/uni-search-bar -> 修改data中的show,showSync为ture,即可
              * 实现搜索框的防抖处理 -> 在input事件中进行实现 等用户500毫秒中未输入新的数据时,才确定为真正的搜素内容.

              搜索结果区域
              * 当确定关键词后,触发事件 getSearchList() 发送get请求参数为 确定的keyvalue值.返回内容存放到searchResults数组中.
              * 根据searchResults数组来实现搜索结果区域结果的渲染,而且点击每个search-results-item结果实现页面的跳转,传递的参数为 item.goods_id号;跳转的方式为
                编程式跳转

              搜索历史区域
              * 定义历史搜索的数组 historyList[];数组的内容来自于查询的数据 keyvalue值
              * histotyList[]数组中的内容唯一,通过saveSearchHistory()方法进行实现;
              * 实现展示数据的顺序为 倒叙 通过计算属性进行实现,防止改变原数组数据;渲染数组为 计算属性获得的数组 historys

              * 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
              * 给组件uni-tag 绑定点击事件,gotoGoodsList(item) 实现带参跳转页面
              * 通过点击事件,将本地存储的数据 和 historyList[]数组的数据 进行清空
      -->

      <!-- 顶部搜索框区域 -->
      <view class="search-box">
        <!-- 使用uni-ui提供的组件 (官方文档 组件 -> 扩展组件) -->
          <!-- 矢量图标组件 -->
          <uni-icons  type="search" size="30" ></uni-icons>
          <!-- 表单组件 -->
          <uni-search-bar  @input="input" placehodler="请进行搜索" > </uni-search-bar>
      </view>

      <!--搜索结果区域  当searchResults数组长度为0的时候,进行省略-->
      <view class="search-results" v-if="searchResults.length !== 0">
        <!-- 通过 searchResults数组实现结果的渲染  点击每个search-results-item结构实现页面跳转-->
            <view class="search-results-item" v-for="(item,i) in searchResults" :key="i" @click="gotogotoDetail(item.goods_id)">
                  <!-- 展示出满足条件的文本 -->
                   <view class="content">{{item.goods_name}}</view>

                   <uni-icons type="arrowright" size="16"></uni-icons>
            </view>
      </view>

      <!--搜索历史区域  否则历史区域进行省略-->
      <view class="search-history" v-else>
          <!-- 标题区域 -->
          <view class="search-history-title">
            <text>搜索历史</text>
            <uni-icons  type="trash" size="17" @click="cleanHistory"></uni-icons>
          </view>
          <!--列表区域 通过循环遍历数组 historyList[] 进而构建uni-tag组件结构 -->
          <view class="search-history-list">
              <view class="uni-tag" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)">{{item}}</view>
          </view>

      </view>

  </view>
</template>

<script>
/**
      * 配置vue.config.js文件
      * 导入uni-ui框架,选取需要的组件 uniSearchbar进行使用
 */
import {uniSearchBar,uniIcons}  from  '@dcloudio/uni-ui'
export default {
  //组件服务于整体
  components:{uniSearchBar,uniIcons},
  data() {
    return {

      /** 顶部搜索区域
       * 创建定时器 搜索的关键字
      */
        timer : null,
        keyvalue:'',

        //搜索结果列表
        searchResults:[],

        //搜索历史列表
        historyList:[]

    };
  },
  /**
   *  uniSearchBar 的 value 改变时触发事件,返回参数为uniSearchBar的value 
   */
  methods:{
       /**  防抖的具体实现
             1.清除 定时器
             2.创建全新的定时器,当500毫秒内没有触发新事件,则为关键值赋值.
        */
      input(res){
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            this.keyvalue = res;
            //根据关键字,查询搜索列表 --> 搜索商品列表的实现
            this.getSearchList();
        },500);
        
      },

      /* 搜索商品列表的实现
          首先进行判断是否为空,为空 直接返回空数据结果;
          非空情况下将关键词为参数发送get请求,将请求回来的数据存放到searchResults数组中;
          之后进行页面的渲染.
      */ 
      async getSearchList(){
        if(this.keyvalue === ""){
          this.searchResults = [];
          return 
        }
        const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.keyvalue})
        if(res.meta.status !== 200) return uni.$showMsg();
        this.searchResults = res.message;
        //实现完成查询之后,调用 saveSearchHistory()方法 将搜索关键词放入historyList数组中
        this.saveSearchHistory()
      },
      // 编程式导航 实现页面跳转 跳转的页面为 分包下的 goods_detail页面(之前创建完成的页面)
      gotogotoDetail(goods_id){
         uni.navigateTo({
            // 指定详情页面的 URL 地址，并传递 goods_id 参数
           url: '/subpages/goods_detail/goods_detail?goods_id=' + goods_id
            })
      },


      /*  搜索历史数据的实现
          
          *通过 Set方法进行实现数组内容的唯一性
          *将查询的数据 keyvalue数据 存放到historyList数组中,
          *将历史记录的数据进行持久化存储到本地
              通过 setStorageSync('keyvalue', JSON.stringify(this.historyList)将数组转化成字符串) 
              转换完成的字符串放入到 定义的'keyvalue'中
              当页面一加载的时候,调用JSON.parse(uni.getStorageSync('keyvalue') || '[]')赋值给this.historyList
              JSON.parse() 将keyvalue中的字符串数据 转化成 数组 
          *通过计算属性,将historyList数组中的内容进行位置的修改赋值给 historys;避免修改原数组中元素的顺序
          *组件绑定 非tabbar 编程式导航带参跳转
          *将本地数据 和 data中的 historyList[] 进行清除
      */
      saveSearchHistory(){

          // 1. 将 Array 数组转化为 Set 对象
          const set = new Set(this.historyList)
          // 2. 调用 Set 对象的 delete 方法，移除对应的元素
          set.delete(this.keyvalue)
          // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
          set.add(this.keyvalue)
          // 4. 将 Set 对象转化为 Array 数组
          this.historyList = Array.from(set)

          // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
          uni.setStorageSync('keyvalue', JSON.stringify(this.historyList))
      },
      //实现清除 按钮
      cleanHistory(){
        // 清空 data 中保存的搜索历史
        this.historyList = []
        // 清空本地存储中记录的搜索历史
        uni.setStorageSync('keyvalue', '[]')
      },
      //实现历史标题的跳转
      gotoGoodsList(keyvalue) {
          uni.navigateTo({
    url: '/subpages/goods_list/goods_list?query=' + keyvalue
  })
}

  },
  //将 historyList[]数组进行翻转后,赋值给 historys[]
  computed:{
     historys(){
       return [...this.historyList].reverse()
     }
  },

  onLoad(options) {
    //将记录存储到本地
    this.historyList = JSON.parse(uni.getStorageSync('keyvalue') || '[]')
  }

};
</script>
<style lang='scss' scoped>
// 顶部搜索框区域样式
.search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #c00000;
  padding: 16rpx;
  //实现页面吸顶效果
  position: sticky;
  top: 0;
  z-index: 999;
  uni-search{
    vertical-align: middle;
  }
  uni-search-bar{
    width: 100%;
  }
}
// 搜索结果区域的样式
.search-results{
  padding: 0 5px;
  .search-results-item{
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;

    display: flex;
    align-items: center;
    justify-content: space-between;
   .content{
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
  }
  }
}
//搜索历史区域的样式
.search-history{
  padding: 0 5px;

  .search-history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 2px solid #efefef;
  }

  .search-history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      width: 120rpx;
      height: 75rpx;
      text-align: center;
      line-height: 75rpx;
      border: 1px solid #efefef;

      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>