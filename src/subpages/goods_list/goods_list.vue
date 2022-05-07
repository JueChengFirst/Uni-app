<template>
  <view>
        <!-- 渲染 goodsList数组,创建页面 -->
        <view class="goods-list">
          <!-- block组件,只是起到包裹的作用,不会在页面中显示 -->
            <view v-for="(item,i) in goodsList" :key="i"  @click="gotoDetail(item)">
                  <my-goods :goods="item"></my-goods>
            </view>

        </view>
    </view>
</template>

<script>
import myGoods from '../../components/my-goods/my-goods.vue';
export default {
  components: { myGoods },
  data() {
    return {
      /*  定义参数对象
            *创建发送请求的参数
            *获取其他页面跳转传递的参数

            *创建商品列表的数据值
            *总数量,来实现分页
            *从后端获取数据,进行分别存放到 goodsList 和 total 
            *创建节流阀,防止数据重复请求
      */
      queryObj: {
        //接收传递的字符串和数字
        query: "",
        cid: "",
        //请求的页数和 每页中的数据
        pagenum: 1,
        pagesize: 10,
      },

      //商品列表的数据 和 总数量
      goodsList: [],
      total: 0,

      //设置 loading值
      loading : false
    };
  },
  onLoad: function (options) {
    //options接收其他页面传递的参数 赋值给queryObj对象;当不存在值的时候,返回空字符串.
    this.queryObj.query = options.query || "";
    this.queryObj.cid = options.cid || "";
    //获取数据的方法
    this.getGoodsList();
  },
  methods: {
    /** 1.发送请求 2.判断错误 3.赋值数据 */
    async getGoodsList(cb) {
      // 发送请求开启 节流阀
      this.loading = true;
      const { data: res } = await uni.$http.get("/api/public/v1/goods/search",this.queryObj);
      //请求数据完毕关闭 节流阀
      this.loading = false;
      //只要数据请求完毕,就通过短路运算符进行判断,如果这个值存在就 立即按照需求调用 cb 回调函数 --> 停止下拉刷新事件
      cb && cb();

      if (res.meta.status !== 200) return uni.$showMsg();
      // 不直接将 数据直接传递给 goodsList数组,将旧数据和新数据通过 ... 扩展运算符将数据合并再进行赋值.
      this.goodsList = [...this.goodsList,...res.message.goods];
      this.total = res.message.total;
    },
    // 通过 编程式导航实现 非tabBar页面跳转
    gotoDetail(item){
        uni.navigateTo({
             url:'/subpages/goods_detail/goods_detail?goods_id='+item.goods_id
        })
    }


  },
  onReady: function () {},

  //下拉 刷新事件
  onPullDownRefresh: function () {
      // 1.重置 请求数据
      this.queryObj.pagenum = 1;
      this.total = 0;
      this.isloading = false;
      this.goodsList = []
      //2.重新发送请求
      this.getGoodsList(()=> uni.stopPullDownRefresh());
  },

  //上拉 触底事件
  onReachBottom: function () {
     //判断当前页面的数据是否全部加载完成  
     if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total)  return uni.$showMsg('数据加载完毕');  

    //数据正在请求,直接进行返回
    if(this.loading) return; 
      //将页面加一
      this.queryObj.pagenum += 1;
      //调用 getGoodsList() 方法实现数据的更新
      this.getGoodsList();
  },
};
</script>
<style lang='scss' scoped>
</style>