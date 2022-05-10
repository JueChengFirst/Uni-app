<template>
    <view class="my-settle-container">
        <!-- radio按钮区域 -->
        <view class="radio" > 
            <radio :checked="isFullCheck" color="#C00000" @click="selectAll">
                <text>全选</text>
            </radio>
        </view>
        <!-- 价钱总和区域 -->
        <view class="amount-box">
            合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
        </view>

        <!-- 结算按钮 -->
        <view class="btn-settle">
                 结算({{checkedCount}})
        </view>
            
    </view>
</template>

<script>
//从 vuex中导入 mapGetters  mapMutations 辅助函数
import {mapGetters,mapMutations} from 'vuex'

export default {
    data() {
        return {}
    },
    //通过计算属性获得 被勾选数据的总和
    computed:{
        //将 模块 m_cart 中的 checkedCount total checkedGoodsAmount 数据映射到当前页面上
        ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
        //判断是否全选
        isFullCheck() {
        return this.total === this.checkedCount
        },
    },
    methods:{
        //将 m_cart模块下的,updateAllGoodsState方法映射到页面使用
        ...mapMutations('m_cart',['updateAllGoodsState']),
        /* 当触发点击事件后,传递的参数为 isFullCheck的相反数;因为点击之后必然会产生相反的结果*/
        selectAll(){
            this.updateAllGoodsState(!this.isFullCheck);
        }
    }
   
}
</script>
<style lang='scss' scoped>
.my-settle-container{
    position: fixed;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 100rpx;
    background-color:#efefef;
    font-size: 14px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    .radio{
        flex: 33.3%;
    }
    .amount-box{
        flex: 33.3%;
        .amount{
            color: red;
        }
    }
    .btn-settle{
         flex: 33.3%;
         height: 100rpx;
         text-align: center;
         line-height: 100rpx;
         background: #C00000;
         color: #ffff;

    }

}
</style>