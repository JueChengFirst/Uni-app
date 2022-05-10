<template>
  <view>
    <!-- 选择收货地址的盒子  
                *将address对象转换成字符串,判断是否为空对象,如果为空展示收货地址盒子,
                否则展示收货地址;

                *绑定点击事件实现选择收货地址的功能
        -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="min" @click="selectAddress">
        请选择收货地址+
      </button>
    </view>

    <!-- 渲染收货信息的盒子  绑定点击事件,selectAddress实现可以切换和更改地址信息-->
    <view v-else class="address-info-box" @click="selectAddress"> 
        <view class="top-box">
                <view class="left">
                        <view class="consignee">收货人: </view>
                        <view class="consignee-name"> {{address.userName}}</view>
                </view>

                <view class="right">
                        <view class="phone">电话: </view>
                        <view class="phone-detail">
                            <text> {{address.telNumber}}</text>
                             <uni-icons type="arrowright" size="16"/>
                        </view>
                </view>
        </view>

        <view class="bottom-box">
            <view class="address">收货地址 : </view>
            <view class="address-detail"> {{addstr}}</view>
        </view>

    </view>

    <!-- 底部边框样式 -->
    <view class="address-bottom">
      <image src="../../static/addres-bottom-img.jpg" />
    </view>
  </view>
</template>

<script>
/* 
    按需导入 mapState 和 mapMutations mapGetters三个辅助函从Vuex模板中
*/
import {mapState,mapMutations,mapGetters} from 'vuex'

export default {
  data() {
    return {};
  },
  /*
   *在selectAddress()方法中,调用小程序提供的API chooseAddress()可以实现选择地址的功能
      1.返回值是一个数组,第一项为错误对象 ,第二项为成功之后的收货地址对象;
      2.当第一项的数据为null 和 第二项中的errMsg为 chooseAddress:ok 表示用户成功的选择了收货地址;
      3.成功后为 调用 updateAddress()方法将数据传递给 store/user.js文件中的state属性的address数据
   */
  methods: {
    //将 updateAddress()方法 映射到页面
    ...mapMutations( 'm_user',['updateAddress']),
    async selectAddress() {
   
      //返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
      const [err, succ] = await uni.chooseAddress().catch((err) => err);

      //用户成功的选择了收货地址
      if (err === null && succ.errMsg === "chooseAddress:ok") {
        // // 为 data 里面的收货地址对象赋值
        // this.address = succ;

         //调用这个方法,将 succ传递给user.js中的state中的address对象
         this.updateAddress(succ)
      }
    },
  },
  /* 通过计算属性,将用户的详细地址通过字符串拼接获得 赋值给 addstr */
 computed: {
     //将 user.js中的 address属性映射到页面
     ...mapState('m_user',['address']),
    //将 addstr字符串在user.js文件中的 getters属性下进行封装;实现数据的赋值
    ...mapGetters('m_user',['addstr'])

}
};
</script>

<style lang='scss' scoped>
//选择收货地址的盒子
.address-choose-box {
  width: 100%;
  height: 180rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
//渲染收货信息盒子
.address-info-box{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 5px;
    font-size: 14px;
    .top-box{
        display: flex;
        justify-content: space-between;
        padding: 10px 0 ;
    .left{
        display: flex;
    }
    .right{
        display: flex;
    }
    }
    .bottom-box{
        display: flex;
        padding: 5px 0 ;
    }
}
//底部边框样式
.address-bottom {
  width: 100%;
  height: 5px;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>