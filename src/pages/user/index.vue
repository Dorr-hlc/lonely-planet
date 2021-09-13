<template>
  <view class="container">
    <tabbar :current="2" :num="readnum"></tabbar>
    <view class="contain">
      <view class="checkbtn">
        <view
          :class="index == checkindex ? 'active' : 'no'"
          v-for="(item, index) in checklist"
          :key="index"
          @click="checktab(index)"
        >
          <view class="text">
            {{ item.title }}
          </view>
        </view>
      </view>
      <!-- 回复我的 -->
      <view class="other_review" v-if="this.checkindex == 0">
        <view v-if="otherdata != ''">
          <view
            class="content"
            v-for="(item1, index1) in otherdata"
            :key="index1"
          >
            <view class="userinfo">
              <view class="nicknum">
                星球编号{{ item1.comment_memberid }}
              </view>
              <view class="orreview"> 回复了你的话题 </view>
              <!-- <view
                class="reviewbtn"
                @click="
                  othershowpop(
                    item1.comment_memberid,
                    item1.comment_id,
                    item1.hole_info.user_id
                  )
                "
              >
                回复Ta
              </view> -->
            </view>
            <view class="reviewtime"> {{ item1.comment_addtime }} </view>
            <!-- 回复内容 -->
            <view class="reviewcontent">
              {{ item1.comment_content }}
            </view>
            <!-- 帖子内容 -->
            <view class="post" @click="othergodetail(item1.hole_info.ID)">
              <view class="text">
                {{ item1.hole_info.describes | cubsub(50) }}
              </view>
              <view class="a" v-if="item1.hole_info.file_list != 0">
                <view
                  class="pic"
                  v-for="(pic1, fileindex1) in item1.hole_info.file_list"
                  :key="fileindex1"
                >
                  <image
                    :src="pic1.fileid_route"
                    mode="aspectFill"
                    class="mypic"
                    @click.stop="
                      previewpic(item1.hole_info.file_list, fileindex1)
                    "
                  />
                </view>
              </view>
            </view>
            <!-- 当有回复内容时 -->
            <view class="reviews" v-if="item1.comment_sub_info">
              <view
                class="own"
                v-for="(item3, index3) in item1.comment_sub_info.info"
                :key="index3"
                v-show="item1.flag || index3 < max"
              >
                <view class="line"></view>
                <view class="info">
                  <view class="left">
                    <view
                      class="name"
                      :class="item3.oneself == 'no' ? '' : 'main'"
                    >
                      星球编号{{ item3.comment_memberid }}
                    </view>
                    <view class="logo" v-if="item3.oneself != 'no'">
                      洞主
                    </view>
                    <view class="time"> {{ item3.time_info }} </view>
                  </view>
                  <view class="right">
                    <view
                      class="mybtn"
                      @click="
                        othershowpop(
                          item1.comment_memberid,
                          item1.comment_id,
                          item1.hole_info.user_id,
                          item3.comment_memberid
                        )
                      "
                    >
                      <image src="/static/image/review.png" class="reviewbtn" />
                      <text>回复</text>
                    </view>
                  </view>
                </view>
                <view class="review">
                  {{ item3.comment_content }}
                </view>
              </view>
              <!-- 查看更多 -->
              <view
                class="getmore"
                v-show="othermore"
                v-if="item1.flag && item1.comment_sub_info.page_count > 4"
                @click="getmoreother(index1, item1.comment_id)"
                >点击加载更多</view
              >
              <view
                class="readmore"
                v-if="
                  item1.comment_sub_info.info &&
                  item1.comment_sub_info.page_count != 1
                "
                @click.stop="othershowTag(index1, item1.comment_id)"
              >
                <text v-if="!item1.flag">查看全部回复</text>
                <text v-else>已显示全部回复</text>
                <image
                  :class="item1.flag ? 'down' : 'up'"
                  src="/static/image/arrowtop.png"
                  mode="widthFix"
                />
              </view>
            </view>
          </view>
          <view :class="this.otherdata.length < 2 ? 'moretext1' : 'moretext2'">
            <u-loadmore :status="opage.status" />
          </view>
        </view>
        <view v-else class="null">
          <image class="nullpic" src="/static/image/nomore.png" mode="" />
        </view>
      </view>
      <!--我的回复-->
      <view class="mine_review" v-else>
        <view v-if="mymsgdata != ''">
          <view
            class="content"
            v-for="(item2, index2) in mymsgdata"
            :key="index2"
          >
            <view class="userinfo">
              <!-- 如果是本人，添加样式fontcolor改变颜色 -->
              <view class="nicknum fontcolor">
                星球编号{{ item2.comment_memberid }}
              </view>
              <view class="logo">
                <image
                  src="/static/image/mine.png"
                  mode="widthFix"
                  class="mine"
                />
              </view>
              <view class="orreview"> 你回复的话题 </view>
            </view>
            <view class="reviewtime">
              {{ item2.comment_addtime }}
            </view>
            <!-- 回复内容 -->
            <view class="reviewcontent">
              {{ item2.comment_content }}
            </view>
            <!-- 帖子内容 -->
            <view>
              <view class="post" @click="mygodetail(item2.hole_info.ID)">
                <view class="text">{{ item2.hole_info.describes | cubsub(50) }}</view>
                <view v-if="item2.hole_info.file_list != 0">
                  <view
                    class="pic"
                    v-for="(pic2, fileindex) in item2.hole_info.file_list"
                    :key="fileindex"
                  >
                    <image
                      :src="pic2.fileid_route"
                      class="mypic"
                      mode="aspectFill"
                      @click.stop="
                        previewpic(item2.hole_info.file_list, fileindex)
                      "
                    />
                  </view>
                </view>
              </view>
            </view>
            <!-- 当有回复内容时 -->
            <view class="reviews">
              <!-- 默认第一页的评论 -->
              <view
                class="own"
                v-for="(item4, index4) in item2.comment_sub_info.info"
                :key="index4"
                v-show="item2.flag || index4 < max"
              >
                <view class="line"></view>
                <view class="info">
                  <view class="left">
                    <view
                      class="name"
                      :class="item4.oneself != 'no' ? 'main' : ''"
                    >
                      星球编号{{ item4.comment_memberid }}</view
                    >
                    <!-- 普通用户取消logo -->
                    <view class="logo" v-if="item4.oneself == 'no'">
                      洞主
                    </view>
                    <u-icon
                      name="/static/image/mine.png"
                      size="30"
                      v-else
                      style="margin-left: 10rpx"
                    ></u-icon>
                    <view class="time"> {{ item4.time_info }} </view>
                  </view>
                  <view class="right">
                    <view
                      class="mybtn"
                      @click="
                        showpop(
                          item2.comment_memberid,
                          item2.comment_id,
                          item2.hole_info.user_id,
                          item4.comment_memberid
                        )
                      "
                    >
                      <image src="/static/image/review.png" class="reviewbtn" />
                      <text>回复</text>
                    </view>
                  </view>
                </view>
                <view class="review">
                  {{ item4.comment_content }}
                </view>
              </view>
              <!-- 查看更多 -->
              <view
                class="getmore"
                v-show="mymore"
                v-if="item2.flag && item2.comment_sub_info.page_count > 4"
                @click="getmoremy(index2, item2.comment_id)"
                >点击加载更多</view
              >
              <view
                class="readmore"
                v-if="
                  item2.comment_sub_info.info &&
                  item2.comment_sub_info.page_count != 1
                "
                @click.stop="myshowTag(index2, item2.comment_id)"
              >
                <text v-if="!item2.flag">查看全部回复</text>
                <text v-else>已显示全部回复</text>
                <image
                  :class="item2.flag ? 'down' : 'up'"
                  src="/static/image/arrowtop.png"
                  mode="widthFix"
                />
              </view>
            </view>
          </view>
          <view :class="this.mymsgdata.length < 2 ? 'moretext1' : 'moretext2'">
            <u-loadmore :status="mpage.status" />
          </view>
        </view>
        <view v-else class="null">
          <image class="nullpic" src="/static/image/nomore.png" mode="" />
        </view>
      </view>
      <!-- 我的回复 输入回复内容弹窗 -->
      <u-popup v-model="oshow" mode="bottom" border-radius="30">
        <view class="pop">
          <textarea
            class="ipt"
            :placeholder="mvpcPlaceholder"
            v-model="rcontent"
          />
          <view class="surebtn" @click="sendother">回复</view>
        </view>
      </u-popup>
      <!-- 回复我的 输入回复内容弹窗 -->
      <u-popup v-model="mshow" mode="bottom" border-radius="30">
        <view class="pop">
          <textarea
            class="ipt"
            :placeholder="ovpcPlaceholder"
            v-model="mcontent"
          />
          <view class="surebtn" @click="sendme">回复</view>
        </view>
      </u-popup>
    </view>
    <!-- 弹窗 -->
    <view>
      <u-popup v-model="popshow" mode="center" border-radius="30">
        <view class="pop">
          <image src="/static/image/hug1.png" class="pic" />
          <view class="text1"
            >在你离开孤独宇宙的时间里 你被
            <text class="num">{{ hugnum }}</text> 位同路人抱了一下</view
          >  
          <image src="/static/image/wave.png" class="wave" />
<!-- <view class="a">
   <lottie :options="defaultOptions"  :width="220" :height="70" v-on:animCreated="handleAnimation" />
</view> -->
        </view>
      </u-popup>
    </view>
  </view>
</template>
<script>
import { share_yp } from "../../config/share";
import * as animationData from "../../config/pic.json"
import lottie from 'vue-lottie'
export default {
  name:'test',
  components:{
 'lottie':lottie
  },
  data() {
    return {
      popshow: false,
      max: 2,
      oshow: false,
      mshow: false,
      rcontent: "",
      mcontent: "",
      checklist: [
        {
          id: 0,
          title: "回复我的",
        },
        {
          id: 1,
          title: "我的回复",
        },
      ],
      checkindex: 0,
      // 回复我的分页
      opage: {
        pageindex: 1,
        pagenum: 4,
        status: "loadmore",
      },
      // 我的回复
      mpage: {
        pageindex: 1,
        pagenum: 4,
        status: "loadmore",
      },
      // 回复我的加载更多分页
      omorepage: {
        pageindex: 2,
        pagenum: 4,
        status: "loadmore",
      },
      // 我的回复加载更多
      morepage: {
        pageindex: 2,
        pagenum: 4,
        status: "loadmore",
      },
      // 我的回复
      mymsgdata: [],
      // 回复我的
      otherdata: [],
      // 我的回复话题id
      mid: 0,
      // 我的回复会员id
      cmid: 0,
      // 回复我的会员id
      oid: 0,
      // 回复我的话题id
      coid: 0,
      // 回复我的附属评论
      mycomment: [],
      datalist: [],
      pageList: [],
      curpage: 0,
      pageNum: 0,
      mcurpage: 0,
      mpageNum: 0,
      mpagecount: 0,
      opagecount: 0,
      //首次评论阅读的id
      onereadid: {},
      // 二次评论阅读的id
      tworeadid: {},
      unumber: 0,
      noid: 0,
      moid: 0,
      readnum: 0,
      timer: null,
      othermore: true,
      mymore: true,
      hugnum: 0,
      mrid:0,
      orid:0,
    defaultOptions: { animationData: animationData.default }, 
    };
  },
  onLoad() {
    // this.popshow = true;
    this.getmy();
    this.getother();
    this.getnews();
    this.hugnum = Math.ceil(Math.random() * 10);
    if (
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger"
    ) {
      share_yp();
    }
    // 刚进入页面 1607484711876 1607484752268
    let timestampNew = new Date().getTime();
    console.log(timestampNew);
    let timestamp = uni.getStorageSync("timestamps");
    console.log(timestamp);
    if (parseInt(timestamp) > parseInt(timestampNew)) {
      this.popshow = false;
    } else {
      this.popshow = true;
    }
  },
  onPullDownRefresh() {
    this.opage.pageindex = 1;
    this.mpage.pageindex = 1;
    this.otherdata = [];
    this.mymsgdata = [];
    this.getmy();
    this.getother();
    // 停止下拉刷新
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    if (this.checkindex == 0 && this.opage.status == "loadmore") {
      this.getother();
    }
    if (this.checkindex == 1 && this.mpage.status == "loadmore") {
      this.getmy();
    }
  },
  computed: {
    ovpcPlaceholder() {
      return "回复@" + "星球编号" + this.mrid;
    },
    mvpcPlaceholder() {
      return "回复@" + "星球编号" + this.orid;
    },
  },
  methods: {
      handleAnimation(anim){
        this.defaultAnim = anim;
      },
    checktab(id) {
      this.checkindex = id;
      console.log(this.checkindex);
    },
    showTag() {
      this.flag = !this.flag;
    },
    othershowpop(oid, coid, noid,rid) {
      this.oshow = true;
      this.oid = oid;
      this.noid = noid;
      this.coid = coid;
      this.orid=rid
    },
    showpop(mid, cmid, nmid,rid) {
      this.mshow = true;
      this.mid = mid;
      this.nmid = nmid;
      this.cmid = cmid;
      this.mrid=rid
    },
    // 我的回复
    getmy() {
      let param = {
        key: this.$db.get("token"),
        curpage: this.mpage.pageindex,
        num: this.mpage.pagenum,
        type_topic: 2,
      };
      this.$api.mytopic(param, (res) => {
        this.pagecount = res.datas.page_count;
        let list = res.datas.info;
        let onenewdata = [];
        if (list != null) {
          list.map((item) => {
            item.flag = false;
            onenewdata.push(item.comment_id);
            this.onereadid = onenewdata;
            if (item.read_state == 1) {
              this.onereadstatus();
            }
            let twonewdata = [];
            let twolist = item.comment_sub_info.info;
            if (twolist != null) {
              twolist.map((item2) => {
                twonewdata.push(item2.comment_id);
                this.tworeadid = twonewdata;
                if (item2.read_state == 1) {
                  this.tworeadstatus();
                } else {
                  return;
                }
              });
            }
          });
        } else {
          return;
        }
        // this.mymsgdata = res.datas.info;
        let listdata = res.datas.info;
        for (const item of listdata) {
          item.mcurpage = 1;
        }
        this.mymsgdata = [...this.mymsgdata, ...listdata];
        if (this.mpage.pageindex < parseInt(res.datas.page_count)) {
          this.mpage.pageindex = parseInt(this.mpage.pageindex) + 1;
          this.mpage.status = "loadmore";
        } else {
          this.mpage.status = "nomore";
        }
      });
    },
    myshowTag(index) {
      this.mymsgdata[index].flag = !this.mymsgdata[index].flag;
      console.log(this.mymsgdata[index].flag);
    },
    // 回复我的
    getother() {
      let param = {
        key: this.$db.get("token"),
        curpage: this.opage.pageindex,
        num: this.opage.pagenum,
        type_topic: 1,
      };
      this.$api.mytopic(param, (res) => {
        this.opagecount = res.datas.page_count;
        let list = res.datas.info;
        let onenewdata = [];
        if (list != null) {
          list.map((item) => {
            item.flag = false;
            onenewdata.push(item.comment_id);
            this.onereadid = onenewdata;
            if (item.read_state == 1) {
              this.onereadstatus();
            }
            let twonewdata = [];
            let twolist = item.comment_sub_info.info;
            if (twolist != null) {
              twolist.map((item2) => {
                twonewdata.push(item2.comment_id);
                this.tworeadid = twonewdata;
                if (item2.read_state == 1) {
                  this.tworeadstatus();
                } else {
                  return;
                }
              });
            }
          });
        } else {
          return;
        }
        let listdata = res.datas.info;
        for (const item of listdata) {
          item.curpage = 1;
        }
        this.otherdata = [...this.otherdata, ...listdata];
        if (this.opage.pageindex < parseInt(res.datas.page_count)) {
          this.opage.pageindex = parseInt(this.opage.pageindex) + 1;
          this.opage.status = "loadmore";
        } else {
          this.opage.status = "nomore";
        }
      });
    },
    othershowTag(index) {
      this.otherdata[index].flag = !this.otherdata[index].flag;
      console.log(this.otherdata[index].flag);
    },
    // 回复我的——回复接口
    sendother() {
      let param = {
        key: this.$db.get("token"),
        type_state: 1,
        ID: this.oid,
        comment_course: this.coid,
        comment_content: this.rcontent,
      };
      if (this.rcontent != "") {
        this.$api.comment(param, (res) => {
          this.opage.pageindex = 1;
          this.otherdata = [];
          this.getother()
          // let param2 = {
          //   key: this.$db.get("token"),
          //   curpage: this.opage.pageindex,
          //   num: this.opage.pagenum,
          //   type_topic: 1,
          // };
          // this.$api.mytopic(param2, (res) => {
          //   this.otherdata = res.datas.info;
          // });
          this.rcontent = "";
          this.oshow = false;
        });
      } else {
        uni.showToast({
          icon: "none",
          title: "回复内容不能为空",
          duration: 2000,
        });
        return;
      }
    },
    // 我的回复-回复接口
    sendme() {
      let param = {
        key: this.$db.get("token"),
        type_state: 2,
        ID: this.mid,
        comment_course: this.cmid,
        comment_content: this.mcontent,
      };
      if (this.mcontent != "") {
        this.$api.comment(param, (res) => {
          this.mpage.pageindex = 1;
          this.mymsgdata = [];
          this.getmy();
          // let param2 = {
          //   key: this.$db.get("token"),
          //   curpage: this.mpage.pageindex,
          //   num: this.mpage.pagenum,
          //   type_topic: 2,
          // };
          // this.$api.mytopic(param2, (res) => {
          //   this.mymsgdata = res.datas.info;
          // });
          this.mcontent = "";
          this.mshow = false;
        });
      } else {
        uni.showToast({
          icon: "none",
          title: "回复内容不能为空",
          duration: 2000,
        });
        return;
      }
    },
    // 回复我的加载更多
    getmoreother(index, id) {
      let curpage = this.otherdata[index].curpage + 1;
      console.log(curpage, "comment_sub_info.");
      let page = this.otherdata[index].comment_sub_info.page_count % 4;
      if (page != 0) {
        this.pageNum =
          parseInt(this.otherdata[index].comment_sub_info.page_count / 4) + 1;
      } else {
        this.pageNum = parseInt(
          this.otherdata[index].comment_sub_info.page_count / 4
        );
      }
      console.log(this.pageNum, this.omorepage.pageindex, "pp");
      if (curpage > this.pageNum) {
        uni.showToast({
          icon: "none",
          title: "已加载全部回复",
          duration: 2000,
        });
        this.othermore = false;
        return;
      }
      // 点击加载剩余评论
      let param = {
        key: this.$db.get("token"),
        ID: id,
        curpage,
        num: this.omorepage.pagenum,
      };
      if ((this.otherdata[index].flag = true)) {
        this.$api.lookcomment(param, (res) => {
          this.otherdata[index].comment_sub_info.info = this.otherdata[
            index
          ].comment_sub_info.info.concat(res.datas.info);
          this.otherdata[index].curpage = curpage;
        });
      }
    },
    // 我的回复加载更多
    getmoremy(index, id) {
      let mcurpage = this.mymsgdata[index].mcurpage + 1;
      console.log(mcurpage, "comment_sub_info.");
      let page = this.mymsgdata[index].comment_sub_info.page_count % 4;
      if (page != 0) {
        this.mpageNum =
          parseInt(this.mymsgdata[index].comment_sub_info.page_count / 4) + 1;
      } else {
        this.mpageNum = parseInt(
          this.mymsgdata[index].comment_sub_info.page_count / 4
        );
      }
      console.log(this.mpageNum, this.morepage.pageindex, "pp");
      if (mcurpage > this.mpageNum) {
        uni.showToast({
          icon: "none",
          title: "已加载全部回复",
          duration: 2000,
        });
        this.mymore = false;
        return;
      }
      // 点击加载剩余评论
      let param = {
        key: this.$db.get("token"),
        ID: id,
        curpage: mcurpage,
        num: this.morepage.pagenum,
      };
      if (this.mymsgdata[index].flag) {
        this.$api.lookcomment(param, (res) => {
          this.mymsgdata[index].comment_sub_info.info = this.mymsgdata[
            index
          ].comment_sub_info.info.concat(res.datas.info);
          this.mymsgdata[index].mcurpage = mcurpage;
        });
      }
    },
    // 改变第一次
    onereadstatus() {
      let param = {
        key: this.$db.get("token"),
        type: "one",
        arr_comment_id: this.onereadid,
      };
      this.$api.read(param, (res) => {
        console.log("已阅读");
      });
    },
    // 改变二次评论状态
    tworeadstatus() {
      let param = {
        key: this.$db.get("token"),
        type: "two",
        arr_comment_id: this.tworeadid,
      };
      this.$api.read(param, (res) => {
        console.log("已阅读");
      });
    },
    // 回复我的点击跳转详情页
    othergodetail(id) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      });
    },
    // 我的回复点击跳转详情
    mygodetail(id) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${id}`,
      });
    },
    // 回复我的预览图片
    // 点击预览图片
    previewimg(image, index) {
      let picArr = [];
      image.map((item) => {
        picArr.push(item.fileid_route);
      });
      uni.previewImage({
        urls: picArr,
        current: index,
        indicator: "default",
      });
    },
    // 我的回复预览
    previewpic(image, index) {
      let picArr = [];
      image.map((item) => {
        picArr.push(item.fileid_route);
      });
      uni.previewImage({
        urls: picArr,
        current: index,
        indicator: "default",
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
  // //这里需要在data里面写timer:null
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
@import "../../static/css/msg.scss";
</style>