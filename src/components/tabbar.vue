<template>
  <view class="box">
    <view class="TabBar">
      <view
        class="tab"
        v-for="(item, index) in TabBarList"
        :key="index"
        @tap="navigatorTo(item.url, item.type)"
      >
        <!-- 判断是否有点击，如果没有就不是激活样式，点击就是激活的样式 -->
        <image
          class="imgsize"
          v-if="item.type == 0"
          :src="current == index ? item.selectIcon : item.icon"
          mode="widthFix"
        ></image>
        <!-- 设置一个状态值（type），判断加号是否展示 -->
        <image
          class="addimgsize"
          v-if="item.type == 1"
          :src="item.icon"
          mode="widthFix"
        ></image>
        <view :class="current == index ? 'active' : 'text'">{{
          item.name
        }}</view>
        <view v-if="item.id == 0 && num>0" class="news">{{num}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      default: 0, //默认第一个页面tabbar激活
    },
     num:{
       type:Number,
       default:0
     }
  },
  data() {
    return {
      TabBarList: [
        {
          type: 0,
          icon: "/static/image/index.png",
          selectIcon: "/static/image/sindex.png",
          name: "首页",
          url: "/pages/index/index",
        },

        {
          type: 1,
          icon: "/static/image/addmsg.png",
          url: "/pages/add/add",
        },

        {
          id: 0,
          type: 0,
          icon: "/static/image/msg.png",
          selectIcon: "/static/image/smsg.png",
          name: "消息",
          url: "/pages/user/index",
        },
      ],
    };
  },
  methods: {
    navigatorTo(e, type) {
      switch (type) {
        case 1:
          uni.navigateTo({
            url: e,
          });
          break;
        default:
          uni.redirectTo({
            url: e,
          });
          break;
      }
    },
  },
};
</script>

<style scoped>
.TabBar {
  position: fixed;
  bottom: 0rpx;
  background: url("~@/static/image/tabbar.svg") no-repeat;
  background-size: 750rpx 170rpx;
  width: 100%;
  display: flex;
  z-index: 999;
  justify-content: space-around;
  align-items: center;
  border-top-left-radius: 38rpx;
  border-top-right-radius: 38rpx;
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.imgsize {
  margin-top: 40rpx;
  width: 42rpx;
  height: 42rpx;
}
.addimgsize {
  width: 116rpx;
  height: 116rpx;
   bottom: 16rpx;
}
.text {
  margin-top: 10rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #bfc4c8ff;
  line-height: 20rpx;
  z-index: 5;
}
.active {
  margin-top: 10rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #609eff;
  line-height: 20rpx;
}
.news {
  position: absolute;
  top: 45rpx;
  right: 78rpx;
  width: 25rpx;
  height: 25rpx;
  font-size: 22rpx;
  font-family: ArialMT;
  color: #ffffff;
  line-height: 22rpx;
  background: #fe684f;
  border-radius: 50%;
  text-align: center;
}
</style>
