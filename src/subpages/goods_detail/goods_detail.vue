<template>
  <!-- 解决商品价格 简介等闪烁问题 
       判断goodsInfo是否存在数据,只有当存在的时候才会进行加载,不存在的话直接将代码清除掉 
       不会出现 undfine等空数据一闪而过
  -->
  <view v-if="goodsInfo.goods_name" class="goods-detail-container">
    <!-- 轮播图区域  -->
    <swiper indicator-dots autoplay circular interval="3000" duration="1000">
      <!-- 当前图片绑定点击事件,传递参数为索引,传递给preview()函数  为了浏览图片-->
      <swiper-item
        v-for="(item, i) in goodsInfo.pics"
        :key="i"
        @click="preview(i)"
      >
        <image :src="item.pics_big" mode="scaleToFill" />
      </swiper-item>
    </swiper>
    <!-- 商品信息区域  (搭建结构)-->
    <view class="goods-info-box">
      <!-- 商品的价格 -->
      <view class="goods-price">￥{{ goodsInfo.goods_price }}</view>
      <!-- 信息主体部分 -->
      <view class="goods-content">
        <!-- 商品简介 -->
        <view class="goods-intro">{{ goodsInfo.goods_name }}</view>
        <!-- 收藏图标 -->
        <view class="goods-icon">
          <!--通过矢量图标来进行实现 -->
          <uni-icons type="star" color="gray" size="25" />
          <view>收藏</view>
        </view>
      </view>
      <!-- 运费 -->
      <view class="goods-carriage">快递:免运费</view>
    </view>
    <!-- 商品使用展示区域 
        rich-text组价 中的node属性可以展示 html代码;当然 html代码来自于请求到的数据-->
    <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>

    <!-- 商品底部导航区域  
          通过组件 uni-goods-nav 来进行实现
          file为ture 表示 按钮的图标为圆角的 默认为宽角的 
    -->
    <view class="goods-nav"> 
      <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick"  @buttonClick="buttonClick" />
    </view>

  </view>
</template>

<script>
import {uniGoodsNav} from "@dcloudio/uni-ui";
//从 vuex中 按需导出 mapState 辅助方法
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
 
  components: {uniGoodsNav}, 
  /*
        *创建goodsInfo对象,接收数据(通过 get请求并且传递参数获得到的数据)
        *options数组 和 buttonGroup数组 --> 组件uni-goods-nav所需要的数据; 
                            options数组代表左侧图标 buttonGroup数组代表右侧按钮
  */
  data() {
    return {
      //创建商品详情的对象
      goodsInfo: {},

      //组件 uni-goods-nav 所需参数
      //左边标签 图标 参数
      options: [
        {
          icon: "shop",
          text: "店铺",
          info: 0,
          infoBackgroundColor: "#007aff",
          infoColor: "red",
    
        },
        {
          icon: "cart",
          text: "购物车",
          info: 0,
        },
      ],
      //右边标签 按钮 参数
      buttonGroup: [
        {
          text: "加入购物车",
          backgroundColor: "#ff0000",
          color: "#fff",
        },
        {
          text: "立即购买",
          backgroundColor: "#ffa200",
          color: "#fff",
        },
      ],
    };
  },
  /* 
        *页面刚加载,就会调用这个onLoad()函数  将其他页面数据传递给自定义的参数 goods_id
        *将参数 goods_id传递给 请求数据的方法 getGoodsDetail(),作为get请求的参数
  */
  onLoad: function (options) {
    //将其他页面的传递的参数赋值给goodsId
    const goods_id = options.goods_id || "";
    //调用请求商品详情数据的方法
    this.getGoodsDetail(goods_id);
  },
  /*
        *get请求数据三步: 1.发送带有参数的get请求 2.判断是否发送成功 3.将数据传递给goodsInfo
            在数据传递之前,需要将 goods_introduce中的所有 <img 替换--> <img style="display:block";
            将.web格式的图片转换成.jpg格式(ios系统无法识别 .web格式的图片)
        *点击事件preview(),调用 uni.previewImage() 方法实现预览图片;必须填写current属性值 和 urls图片地址值
        *点击事件 onClick() 实现向 购物车页面,tabBar页面的跳转;运用的是编程式导航(通过参数 e.content.text来进行判断是否为购物车页面)
  */
  methods: {
    // //请求数据 3 步
    async getGoodsDetail(goods_id) {
      const { data: res } = await uni.$http.get("/api/public/v1/goods/detail", {
        goods_id,
      });

      if (res.meta.status !== 200) return uni.$showMsg();

      // 处理接收到的代码存在间隙问题  给html代码中的所有img标签添加 block属性
      //ios 系统无法识别 .wep 结尾的图片;所有将所有.wep结尾的图片替换成 .jpg即为的图片
      res.message.goods_introduce = res.message.goods_introduce
        .replace(/<img /g, '<img style="display:block;" ')
        .replace(/webp/g, "jpg");
      this.goodsInfo = res.message;
    },

    //处理点击函数 preview()
    preview(i) {
      //调用 uni.previewImage() 方法预览图片
      uni.previewImage({
        //预览时显示图片的索引
        current: i,
        //所有图片 url 地址的数组; this.goodsInfo.pics是一个数组通过map来实现循环数组;
        //每循环一次都会获得 item项获取到 item.pics_big为图片的地址
        urls: this.goodsInfo.pics.map((parms) => parms.pics_big),
      });
    },
    
    //左侧按钮的点击事件,跳转到购物车
    onClick(e){
      console.log(e); //content: {icon: "cart", text: "购物车", info: 0}
      if(e.content.text === "购物车"){
          //实现 tabBar页面的跳转
          uni.switchTab({
            url:"/pages/cart/cart",
          })
      }
    },
    
    //将 m_cart 模块中的 addToCart 方法映射到当前页面使用
    ...mapMutations('m_cart',['addToCart']),

    //右侧点击事件处理函数
    buttonClick(e){
      if(e.content.text === '加入购物车'){
        //组织一个商品的信息对象
        const goods = { 
          goods_id: this.goodsInfo.goods_id, //商品的Id
          goods_name: this.goodsInfo.goods_name,   // 商品的名称
          goods_price: this.goodsInfo.goods_price, // 商品的价格
          goods_count: 1,                           // 商品的数量
          goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
          goods_state: true                         // 商品的勾选状态
        }
        //通过调用 addToCart()方法来进行实现
        this.addToCart(goods);
      }
    },


  },

  /*
        *在计算属性中,调用mapSate方法,把 m_cart 模块中的 cart 数组映射到当前页面中,作为计算属性使用 
  */
  computed:{
    //语法 ...mapState('模块名称',[需要映射的数据1,数据2,...])
    ...mapState('m_cart',['cart']),
    ...mapGetters('m_cart',['total']),
  },

  /* 
        通过监听属性来,检测数据的变化,将total的数值赋值给 options数值中的info
  */
  watch:{
      // 定义 total 侦听器，指向一个配置对象
   total: {
      // handler 属性用来定义侦听器的 function 处理函数
      handler(newVal) {
         const findResult = this.options.find(x => x.text === '购物车')
         if (findResult) {
            findResult.info = newVal
         }
      },
      // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
      immediate: true
   }
  }

};
</script>
<style lang='scss' scoped>
.goods-detail-container{
  padding-bottom: 10px;
// 轮播图样式
swiper {
  height: 750rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
// 商品信息区域
.goods-info-box {
  display: flex;
  flex-direction: column;
  padding: 15px 10px;

  //  价格
  .goods-price {
    font-size: 25px;
    color: #c00000;
  }
  //  内容
  .goods-content {
    display: flex;
    justify-content: space-between;
    height: 100rpx;
    .goods-intro {
      width: 100%;
      font-size: 13px;
      padding-right: 10px;
    }
    .goods-icon {
      width: 150rpx;
      vertical-align: middle;
      text-align: center;
      color: grey;
      border-left: 1px solid #efefef;
    }
  }
  //  运费
  .goods-carriage {
    margin-top: 20px;
    font-size: 12px;
  }
}
//底部导航栏区域
.goods-nav{
  //设置为粘性定位
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
}
}

</style>