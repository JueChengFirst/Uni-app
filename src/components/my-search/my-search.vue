<template>
<!--  * 创建组件结构  
      * 动态绑定属性值 
      * 添加点击事件实现页面跳转 
-->

  <view class="my-search-container" :style="{'background-color': bgcolor}"  >
        <view class="my-serach-box" :style="{'border-radius': bradius +'px'}"  @click="searchBoxHandler" >
      
            <uni-icons  type="search" size="21" ></uni-icons>
            <!-- text文本 -->
            <view class="text">搜索</view>
        
        </view>
  </view>


</template>
<script>
import {uniIcons} from '@dcloudio/uni-ui'
export default {

  components: {
      uniIcons
  },
  /*   
      props接收外部传递的数据,实现对搜索组件局部样式的更改
      设置数据类型 和 默认属性值 
  */
  props:{
      bgcolor:{
        type:String,
        default:"#C00000"
      },
      bradius:{
        type:Number,
        default:18
      }

  },
  data() {
    return {

    };
  },
  methods:{
    searchBoxHandler(){

       this.$emit('click');
       
    }
  }
};
</script>
<style lang='scss' scoped>
.my-search-container{
    display: flex;
    justify-content: center;
    height: 40px;
    //  背景颜色 通过动态绑定 background: #C00000;
    margin-bottom: 10px;
    padding: 5px 10px; 
     .my-serach-box{
         width: 100%;
        // 圆角弧度动态绑定  border-radius: 18px;
         background-color:#ffffff;
         display: flex;
         justify-content: center;
         line-height: 40px;
        .text{
            font-size: 15px;
            margin-left: 10px;
        }
     
     }
}
</style>