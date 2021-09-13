<template>
  <view>
    <tabbar :current="0" :num="readnum"></tabbar>
    <view class="box">
      <view class="contain" v-for="(item, index) in datalist" :key="index">
        <view class="post" @click="godetail(item.ID)">
          <view class="userinfo">
            <u-icon name="/static/image/putong.png" :size="80"></u-icon>
            <view class="rightinfo">
              <view class="top">
                <!-- main判断字体颜色 -->
                <view
                  class="number"
                  :class="item.oneself == 'no' ? '' : 'main'"
                >
                  星球编号{{ item.user_id }}
                </view>
                <view class="logo" v-if="item.oneself !== 'no'"> UP </view>
              </view>
              <view class="release"> {{ item.time_info }} </view>
            </view>
          </view>
          <view class="content" >
            {{ item.describes | cubsub(50)}}
           <text  v-show="item.describes.length>50" class="qw">全文</text>
          </view>
 
          <view class="pic" v-if="item.file_list != 0">
            <view
              class="upimg"
              v-for="(item1, index1) in item.file_list"
              :key="index1"
            >
              <image
                :class="item.file_list.length > 1 ? 'three' : 'one'"
                :src="item1.fileid_route"
                @click.stop="previewimg(item.file_list, index1)"
                mode="aspectFill"
              />
            </view>
          </view>
          <view class="bottom">
            <view class="comment">
              <u-icon name="/static/image/xiaoxi.png" :size="38"></u-icon>
              <view class="commentnum" v-if="item.count_comment > 0">
                {{ item.count_comment }}
              </view>
            </view>
            <view
              class="rightbtn"
              @click.stop.once="givehug(index, item.ID, item.give_me)"
              v-if="item.user_id != userid"
            >
              <!-- 判断是谢谢你还是抱一抱 -->
              <view>
                <image
                  v-if="item.give_me != 'no'"
                  src="/static/image/thank.png"
                  mode=""
                  class="thank"
                />
                <image
                  v-else
                  src="/static/image/hug.png"
                  mode=""
                  class="thank"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="more">
        <u-loadmore :status="page.status" />
      </view>
    </view>
    <!-- 弹出面板 -->
    <view>
      <u-popup v-model="popshow" mode="center" border-radius="30" z-index=99 :mask-close-able="false">
        <view class="pop">
          <view class="title">叮~来自孤独星球宇宙的悄悄话!</view>
          <view class="tip1 pd2">你好，这里是孤独星球树洞~</view>
          <view class="tip1 tip1color pd1">请先别急着跳过噢，花30秒听听树洞的悄悄话吧</view>
          <view class="tip1">孤独星球树洞是什么</view>
          <view class="des">
            孤独星球树洞是医教宝专门为各位星星引路人建立的社区。<br>
    你的信息仅会被用于验证登陆，而不会在社区中被展示；通过后台加密算法，除了在严重违反社区规范的情况下且运营者认为有必要时，任何人（包括我们）都无法获知你的发言身份。在这里，你可以真正地畅所欲言。
          </view>
          <view class="tip1">我们的初衷</view>
          <view class="des">
    敲下几行文字，孤独星球树洞可以满足你任何的交流需求：<br>
    倾诉自己内心深处的伤感或喜悦，分享星星最新的大小趣事，寻找拥有相同经历的星星引路人，寻求有经验的引路人给自己的建议，交流对于家庭问题的看法......
          </view>
          <button @click="close" class="close">知道啦</button>
        </view>
      </u-popup>
    </view>
  </view>
</template>
<script>
import uIcon from "../../uview-ui/components/u-icon/u-icon.vue";
import umask  from "../../uview-ui/components/u-mask/u-mask.vue"
import upop from "../../uview-ui/components/u-popup/u-popup.vue"
 import { share_yp } from "../../config/share";
export default {
  components: { uIcon ,upop,
  umask},

  data() {
    return {
      picindex: 0,
      showpic: false,
      ismain: "",
      page: {
        pageindex: 1,
        perPage: 4,
        status: "loadmore",
      },
      datalist: [],
      readnum: 0,
      orpic: true,
      userid: 0,
      imgurls: [],
      timer: null,
      popshow: false,
    };
  },

  onLoad(parm) {
    if (parm.key) {
      this.$db.set("token", parm.key);
    }
    if (this.$db.get("token")) { 
      this.popshow=false
      this.getlistdata();
      this.getnews();
      let timestamps = new Date().getTime() + 86400 * 1000;
      console.log(timestamps);
      uni.setStorageSync("timestamps", String(timestamps));
      this.$api.getid(
        {
          key: this.$db.get("token"),
        },
        (res) => {
          this.userid = res.datas;
          uni.setStorageSync("key", res.datas);
          // const once=uni.getStorageSync("key",res.datas);
        }
      );
    } else {
      this.popshow=true
    }
    if (
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger"
    ) {
      share_yp();
    }
  },
  onPullDownRefresh() {
    this.page.pageindex = 1;
    this.datalist = [];
    this.getnews();
    this.getlistdata();
    setTimeout(function () {
      uni.stopPullDownRefresh(); //停止下拉刷新
    }, 1000);
  },
  onReachBottom() {
    if (this.page.status == "loadmore") {
      this.getlistdata();
    } else {
      return;
    }
  },
  methods: {
    close() {
      this.popshow = false;
      window.location.href = "http://m.yijiaobao.com.cn/hole.php";
    },
    godetail(id) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      });
    },
    //获取广场数据
    getlistdata() {
      let param = {
        key: this.$db.get("token"),
        curpage: this.page.pageindex,
        num: this.page.perPage,
      };
      this.$api.getlist(param, (res) => {
        let list = res.datas.info;
        this.datalist = [...this.datalist, ...list];
        if (this.page.pageindex < parseInt(res.datas.page_count)) {
          this.page.pageindex = parseInt(this.page.pageindex) + 1;
          this.page.status = "loadmore";
        } else {
          this.page.status = "nomore";
          this.page.pageindex = 1;
        }
      });
    },
    //点击抱一抱TA
    givehug(index, id, or) {
      this.datalist[index].give_me = "yes";
      console.log(index);
      this.picindex = index;
      console.log(or);
      if (or == "no") {
        this.$api.hug(
          {
            key: this.$db.get("token"),
            clock_id: id,
          },
          (res) => {}
        );
      } else {
        return;
      }
    },
    // 点击预览图片
    previewimg(image, index) {
      let piclist = image.map((item) => {
        return item.fileid_route;
      });
      uni.previewImage({
        urls: piclist,
        current: index,
        indicator: "number",
        loop: false,
      });
    },
    // 获取未读消息
    getnews() {
      this.$api.noread(
        {
          key: this.$db.get("token"),
        },
        (res) => {
          this.readnum = res.datas;
        }
      );
    },
    // // item.message html标签反转义
    // HTMLEncode(text) {
    //   let temp = document.createElement("br");
    //   temp.innerHTML = text;
    //   let output = temp.innerText || temp.textContent;
    //   temp = null;
    //   return output;
    // }
  },
    filters: {
    cubsub(value, num) {
      if (value.length > num) {
        return value.substr(0, num) + '...'
      } else {
        return value
      }
    },
    }
  //这里是我调用的接口，接口是在methods里面写的，这里就不写了
  //这里需要在data里面写timer:null
  // created() {
  //   this.timer = setInterval(() => {
  //     this.getnews();
  //     console.log(111);
  //   }, 3000);
  // },
  // //销毁定时器
  // beforeDestroy() {
  //   if (this.timer) {
  //     console.log("销毁定时器");
  //     clearInterval(this.timer); //在Vue实例销毁前，清除我们的定时器
  //   }
  // },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/index.scss";
</style>

