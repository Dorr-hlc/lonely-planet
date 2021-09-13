<template>
  <view>
    <view class="contain">
      <textarea
        placeholder="写些什么和大家分享"
        class="text"
        v-model="topic_content"
        maxlength="500"
      />
      <view class="tit"> 最多500字 </view>
    </view>
    <!-- 上传图片 -->
    <view class="uppic">
      <view class="scroll_item">
        <view class="upbtn" @click="uppic">
          <view class="content">
            <image src="/static/image/addpic.png" mode="widthFix" />
            <text>添加图片</text>
          </view>
        </view>

        <view class="myimg">
          <view class="img" v-for="(item, index) in localpath" :key="index">
            <image :src="item" mode="" class="pics" />
            <image
              src="/static/image/delete.png"
              mode=""
              @click="deletepic(index)"
              class="deletepic"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="pictips">
      <view class="tipsicon">
        <image src="/static/image/tishi.png" mode="" />
        <text>最多添加3张图片</text>
      </view>
    </view>
    <view class="release" @click="releasebtn"> 话题发布 </view>
  </view>
</template>
<script>
import { h5Url } from "@/config/config.js";
import { share_yp } from "../../config/share";
export default {
  data() {
    return {
      imgarr: [],
      tempFileList: [], //临时存储上传后的图片
      imgurl: h5Url,
      topic_content: "",
      imgs: [],
      localpath: [],
    };
  },
  onLoad() {
    if (
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger"
    ) {
      share_yp();
    }
  },
  methods: {
    //上传图片
    uppic() {
      if (this.localpath.length < 3) {
        // this.$api.uploadfile(res => {
        //   this.tempFileList = res.datas;
        //   this.imgarr.push(this.tempFileList.name);
        //   this.imgs.push(this.tempFileList.file);
        // });
        uni.chooseImage({
          sizeType: ["compressed"],
          success: (chooseImageRes) => {
            uni.showLoading({
              title: "上传中...",
            });
            const tempFilePaths = chooseImageRes.tempFilePaths;
            this.localpath.push(...chooseImageRes.tempFilePaths)
            console.log(this.localpath);
            const uploadTask = uni.uploadFile({
              url: h5Url + "tree_hole&op=image_header", //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              fileType: "image",
              name: "file",
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
              formData: {
                key: this.$db.get("token"),
                file: tempFilePaths[0],
              },
              success: (res) => {
                this.tempFileList  = JSON.parse(res.data);
                console.log(this.tempFileList);
                this.imgarr.push(this.tempFileList.datas.name);
                this.imgs.push(this.tempFileList.datas.file);
              },
              fail: (error) => {
                if (error && error.message) {
                  showError(error.message);
                }
              },
              complete: () => {
                setTimeout(function () {
                  uni.hideLoading();
                }, 500);
              },
            });
          },
        });
      } else {
        uni.showToast({
          icon:'none',
          title: '最多上传3张图片',
          duration: 2000
        });
        return false;
      }
    },
    // 删除图片
    deletepic(i) {
      console.log(i);
      this.$api.picdelete(
        {
          key: this.$db.get("token"),
          file_name: this.imgarr,
        },
        (res) => {
          this.imgs.splice(i, 1);
          this.imgarr.splice(i,1);
          this.localpath.splice(i, 1);
        }
      );
    },

    // 话题发布
    releasebtn() {
      if (this.topic_content == "") {
        uni.showToast({
          icon: "none",
          title: "请输入您要分享的内容",
          duration: 2000,
        });
        return false;
      } else {
        this.$api.add(
          {
            key: this.$db.get("token"),
            describes: this.topic_content.replace("",'\n'),
            fileid_route: this.imgarr,
          },
          (res) => {
            this.topic_content=""
            uni.showToast({
              title: "发布成功",
              duration: 2000,
            });
            // uni.navigateTo({
            //    url: '/pages/index/index'
            // });
        setTimeout(function(){
              uni.reLaunch({
              url: "/pages/index/index",
            });
        },1000)
          }
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.contain {
  margin: 32rpx;
  position: relative;
  .text {
    width: 686rpx;
    height: 400rpx;
    background: #f7f9fa;
    border-radius: 10rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #333333ff;
    line-height: 28rpx;
    padding: 24rpx 0 0 24rpx;
    box-sizing: border-box;
  }
  .tit {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #6e7275;
    line-height: 24rpx;
  }
}
.uppic {
  margin: 56rpx 0 0 32rpx;
  .scroll_item {
    display: flex;
    box-sizing: border-box;
    .upbtn {
      // position: fixed;
      width: 160rpx;
      height: 160rpx;
      background: #f2f5f7;
      border-radius: 6rpx;
      z-index: 99;
      .content {
        display: flex;
        flex-direction: column;
        image {
          width: 50rpx;
          height: 33rpx;
          margin-top: 53rpx;
          margin-left: 55rpx;
        }
        text {
          text-align: center;
          margin-top: 16rpx;
          font-size: 14rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #babdc0;
          line-height: 24rpx;
        }
      }
    }
    .myimg {
      white-space: nowrap;
      .img {
        display: inline-block;
        margin-left: 16rpx;
        position: relative;
        .pics {
          width: 160rpx;
          height: 160rpx;
        }
        .deletepic {
          width: 30rpx;
          height: 30rpx;
          position: absolute;
          right: 0rpx;
          top: 0rpx;
        }
      }
    }
  }
}
.pictips {
  display: flex;
  margin-left: 32rpx;

  .tipsicon {
    image {
      width: 20rpx;
      height: 20rpx;
    }
    text {
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 24rpx;
      margin-left: 5rpx;
    }
  }
}
.release {
  width: 686rpx;
  height: 96rpx;
  background: #66a1ff;
  box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(42, 108, 213, 0.3);
  border-radius: 46rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 32rpx;
  text-shadow: 0rpx 2rpx 8rpx rgba(42, 108, 213, 0.3);
  text-align: center;
  padding-top: 32rpx;
  margin: 140rpx auto;
}
</style>