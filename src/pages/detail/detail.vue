<template>
  <view>
    <view class="contain">
      <view class="post" @click="showdz">
        <view class="userinfo">
          <view class="avatar">
            <image src="/static/image/putong.png" mode="widthFix" />
          </view>
          <view class="rightinfo">
            <view class="top">
              <!-- main判断字体颜色 -->
              <view
                class="number"
                :class="dateiltop.oneself == 'no' ? '' : 'main'"
              >
                星球编号{{ dateiltop.user_id }}
              </view>
              <view class="logo"> 洞主 </view>
            </view>
            <view class="release"> {{ dateiltop.time_info }} </view>
          </view>
        </view>
        <view class="content" v-html="lastContent">
          <!-- {{ lastContent }} -->
        </view>
        <view class="pic" v-if="dateiltop.file_list != 0">
          <view
            class="upimg"
            v-for="(pic, index) in dateiltop.file_list"
            :key="index"
            @click.stop="previewimg(dateiltop.file_list, index)"
          >
            <image
              :class="dateiltop.file_list.length > 1 ? 'three' : 'one'"
              :src="pic.fileid_route"
              mode="aspectFill"
            />
          </view>
        </view>

        <view class="bottom">
          <view class="comment">
            <image
              src="/static/image/xiaoxi.png"
              mode="widthFix"
              class="xiaoxi"
            />
            <view class="commentnum" v-if="dateiltop.count_comment > 0">
              {{ dateiltop.count_comment }}
            </view>
          </view>
          <view class="rightbtn" @click="firstcomplaint(dateiltop.ID)">
            <u-icon
              name="/static/image/point.png"
              :size="38"
              class="point"
            ></u-icon>
          </view>
        </view>
      </view>
      <view class="allreplay">
        <view class="text"> 全部回复 </view>
        <!-- <view class="shrink">
          <image src="/static/image/paixu.png" mode="" class="paixu" />
        </view> -->
      </view>
      <!-- 回复内容 -->
      <view class="replay" v-if="commentdata != ''">
        <template>
          <view v-for="(item, index) in commentdata" :key="index" class="rbox">
            <view class="replay_header">
              <view
                class="nickname"
                :class="item.oneself != 'no' ? 'main' : ''"
              >
                星球编号{{ item.comment_memberid }}
                <u-icon
                  v-if="item.oneself != 'no'"
                  name="../../static/image/mine.png"
                  :size="25"
                  class="micon"
                ></u-icon>
              </view>
              <u-icon
                name="/static/image/point.png"
                :size="38"
                class="point"
                @click="twocomplaint(item.comment_id)"
              ></u-icon>
            </view>
            <view class="replaytime"> {{ item.time_info }} </view>
            <view
              @click="
                showbtn(
                  item.comment_memberid,
                  item.comment_id,
                  item.comment_content
                )
              "
            >
              <view class="content">
                {{ item.comment_content }}
              </view>
              <view
                class="replaycontent"
                v-if="item.comment_sub_info.info != null"
              >
                <!-- 附属评论 -->
                <view>
                  <view
                    class="owner"
                    v-for="(oitem, index1) in item.comment_sub_info.info"
                    :key="index1"
                    v-show="item.flag || index1 < max"
                    @click.stop="
                      showbtn(
                        oitem.comment_memberid,
                        oitem.comment_id,
                        oitem.comment_content
                      )
                    "
                  >
                    <view class="name">
                      <text :class="oitem.oneself == 'no' ? '' : 'main'">
                        星球编号{{ oitem.comment_memberid }}</text
                      >
                      <view class="logo" v-if="oitem.type_state == '1'">
                        洞主
                      </view>
                      <u-icon
                        v-else
                        name="../../static/image/mine.png"
                        :size="25"
                        class="micon"
                      ></u-icon>
                      <view class="time"> {{ oitem.time_info }} </view>
                    </view>
                    <view class="rcontent">
                      {{ oitem.comment_content }}
                    </view>
                  </view>
                </view>
                <view v-if="item.comment_sub_info.page_count > 2">
                  <view
                    v-show="showmore"
                    class="getmore"
                    @click.stop="getmore(index, item.comment_id)"
                    v-if="
                      upage.pageindex <=
                        item.comment_sub_info.page_count / upage.perPage &&
                      item.flag
                    "
                    >点击加载更多</view
                  >
                  <view class="readmore" @click.stop="showTag(index)">
                    <text v-if="!item.flag">展开查看回复</text>
                    <text v-else>收起回复消息</text>
                    <image
                      :class="item.flag ? 'down' : 'up'"
                      src="/static/image/arrowtop.png"
                      mode="widthFix"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
        <view :class="this.commentdata.length < 2 ? 'moretext1' : 'moretext2'">
          <u-loadmore :status="page.status" />
        </view>
      </view>
      <!-- 没有内容 -->
      <view class="no" v-else>
        <view class="noimg">
          <image
            src="/static/image/nomore.png"
            mode="widthFix"
            class="nomore"
          />
        </view>
      </view>

      <!-- 普通视角底部回复输入框 -->
      <view class="review" v-if="this.orself == 'no'">
        <view class="iptvalue">
          <input
            type="text"
            v-model="usercontent"
            :placeholder="ovpcPlaceholder | cubsub(8)"
          />
        </view>
        <view class="send" @click="o_comment"> 发送 </view>
      </view>
      <!-- 对帖子评论进行回复 -->
      <view class="review" v-show="isshow">
        <view class="iptvalue">
          <input
            type="text"
            v-model="mycontent"
            :placeholder="vpcPlaceholder | cubsub(12)"
          />
        </view>
        <view class="send" @click="my_comment"> 发送 </view>
      </view>
    </view>
  </view>
</template>

<script>
import { share_yp } from "../../config/share";
export default {
  data() {
    return {
      //  详情页的id
      uid: 0,
      isshow: false,
      dateiltop: [],
      // 默认展示2条,加载2
      page: {
        pageindex: 1,
        perPage: 4,
        status: "loadmore",
      },
      // 附属评论
      upage: {
        pageindex: 1,
        perPage: 4,
        status: "loadmore",
      },
      // 附属评论的会员ID和评论id
      pid: 0,
      courseid: 0,
      userid: 0,
      usercontent: "",
      mycontent: "",
      Cid: 0,
      commentdata: [],
      orself: "",
      tagindex: 0,
      max: 2,
      //首次评论阅读的id
      onereadid: {},
      // 二次评论阅读的id
      tworeadid: {},
      // 附属评论
      datalist: [],
      curpage: 0,
      pageNum: 0,
      unumber: 0,
      page_count: 0,
      content: "",
      // 点击加载更多隐藏
      showmore: true,
      articel: "",
      lastContent: "",
    };
  },
  onLoad(pram) {
    this.uid = pram.id;
    this.gettop(pram.id);
    this.getbottom(pram.id);
    if (
      window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger"
    ) {
      share_yp();
    }
    this.unumber = uni.getStorageSync("key");
  },
  onPullDownRefresh() {
    this.page.pageindex = 1;
    this.commentdata = [];
    this.getbottom(this.uid);
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    if (this.page.status == "loadmore") {
      this.getbottom(this.uid);
    }
  },
  computed: {
    vpcPlaceholder() {
      return "回复@" + "星球编号" + this.pid + ":" + this.content;
    },
    ovpcPlaceholder() {
      return "回复" + "洞主" + ":" + this.dateiltop.describes;
    },
  },
  methods: {
    // 点击空白处显示洞主输入框
    showdz() {
      this.isshow = false;
    },
    // 投诉上面话题
    firstcomplaint(id) {
      let _this = this;
      uni.showModal({
        title: "提示",
        content: "确认投诉该话题吗？",
        success: function (res) {
          if (res.confirm) {
            _this.$api.complaint(
              {
                key: _this.$db.get("token"),
                hole_type: 1,
                hole_id: id,
              },
              (res) => {
                if (res.datas == 1) {
                  uni.showToast({
                    title: "投诉成功",
                    duration: 2000,
                  });
                } else {
                  uni.showToast({
                    icon: "none",
                    title: "您已经投诉过了",
                    duration: 2000,
                  });
                }
              }
            );
          } else if (res.cancel) {
            uni.showToast({
              icon: "none",
              title: "您取消了投诉",
              duration: 2000,
            });
          }
        },
      });
    },
    // 投诉下面评论
    twocomplaint(id) {
      let _this = this;
      uni.showModal({
        title: "提示",
        content: "确认投诉该回复吗？",
        success: function (res) {
          if (res.confirm) {
            _this.$api.complaint(
              {
                key: _this.$db.get("token"),
                hole_type: 2,
                hole_id: id,
              },
              (res) => {
                if (res.datas == 1) {
                  uni.showToast({
                    title: "投诉成功",
                    duration: 2000,
                  });
                } else {
                  uni.showToast({
                    icon: "none",
                    title: "您已经投诉过了",
                    duration: 2000,
                  });
                }
              }
            );
          } else if (res.cancel) {
            uni.showToast({
              icon: "none",
              title: "您取消了投诉",
              duration: 2000,
            });
          }
        },
      });
    },

    // 获取详情页上半部分
    gettop(id) {
      console.log(id);
      this.$api.topdetail(
        {
          key: this.$db.get("token"),
          ID: id,
        },
        (res) => {
          this.dateiltop = res.datas;
          this.userid = res.datas.user_id;
          console.log(this.userid);
          this.Cid = res.datas.ID;
          this.orself = res.datas.oneself;
          this.articel = res.datas.describes.split(/[\n]/);
          for (let i = 0; i < this.articel.length; i++) {
            let addContent =
              '<p style="text-indent: 2em">' + this.articel[i] + "</p>";
            this.lastContent = this.lastContent + addContent;
          }
        }
      );
    },
    //获取详情页下半部分
    getbottom(id) {
      let param = {
        key: this.$db.get("token"),
        ID: id,
        curpage: this.page.pageindex,
        order: 1,
        num: this.page.perPage,
      };
      this.$api.botdetail(param, (res) => {
        // this.page_count=res.datas.page_count
        let lists = res.datas.info;
        if (lists != null) {
          for (const item of lists) {
            item.curpage = 1;
          }
          //  console.log(lists);
          let onenewdata = [];
          let twonewdata = [];
          lists.forEach((item1) => {
            item1.flag = false;
            onenewdata.push(item1.comment_id);
            this.onereadid = onenewdata;
            // this.onereadstatus();
            if (item1.read_state == 1) {
              this.onereadstatus();
            } else {
              return;
            }
            if (item1.comment_sub_info.info != null) {
              item1.comment_sub_info.info.forEach((item2) => {
                twonewdata.push(item2.comment_id);
                this.tworeadid = twonewdata;
                this.tworeadstatus();
                if (item2.read_state == 1) {
                  this.tworeadstatus();
                } else {
                  return;
                }
              });
            } else {
              return;
            }
          });
        } else {
          return;
        }
        // // 分页
        let detaillist = res.datas.info;
        this.commentdata = [...this.commentdata, ...detaillist];
        if (this.page.pageindex < res.datas.page_count) {
          this.page.pageindex = parseFloat(this.page.pageindex) + 1;
          this.page.status = "loadmore";
        } else {
          this.page.status = "nomore";
          this.page.pageindex = 1;
        }
      });
    },
    // 发布首次评论
    o_comment() {
      if (this.usercontent == "") {
        uni.showToast({
          icon: "none",
          title: "评论内容不能为空",
          duration: 2000,
        });
        return false;
      } else {
        let param = {
          key: this.$db.get("token"),
          receive_memberid: this.userid,
          comment_course: this.Cid,
          comment_content: this.usercontent,
        };
        this.$api.firstcomment(param, (res) => {
          this.commentdata = [];
          let param2 = {
            key: this.$db.get("token"),
            ID: this.uid,
            curpage: this.page.pageindex,
            order: 1,
            num: this.page.perPage,
          };
          this.$api.botdetail(param2, (res) => {
            this.commentdata = res.datas.info;
          });
          this.usercontent = "";
        });
      }
    },
    // 传递附属评论的ID
    showbtn(pid, courseid, content) {
      if (this.unumber == pid || this.unumber == this.userid) {
        this.pid = pid;
        this.courseid = courseid;
        console.log(this.pid);
        this.isshow = true;
        this.content = content;
      } else {
        uni.showToast({
          icon: "none",
          title: "目前仅支持您自己和洞主进行讨论哦~",
          duration: 2000,
        });
      }
    },
    // 评论者
    oreview() {
      let param = {
        key: this.$db.get("token"),
        type_state: 2,
        comment_memberid: this.pid,
        comment_course: this.courseid,
        comment_content: this.mycontent,
      };
      this.$api.comment(param, (res) => {
        this.page.pageindex = 1;
        this.commentdata = [];
        this.getbottom(this.Cid);
        this.gettop(this.uid);
        this.mycontent = "";
        this.isshow = false;
      });
    },
    // 回复者
    mreview() {
      let param = {
        key: this.$db.get("token"),
        type_state: 1,
        comment_memberid: this.pid,
        comment_course: this.courseid,
        comment_content: this.mycontent,
      };
      this.$api.comment(param, (res) => {
        this.page.pageindex = 1;
        this.commentdata = [];
        this.getbottom(this.Cid);
        this.gettop(this.uid);
        this.mycontent = "";
        this.isshow = false;
      });
    },

    // 发布附属评论或者回复
    my_comment() {
      console.log(this.unumber);
      switch (parseInt(this.unumber)) {
        case parseInt(this.userid):
          this.mreview();
          break;
        case parseInt(this.pid):
          this.oreview();
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "目前仅支持您自己和洞主进行讨论哦~",
            duration: 2000,
          });
      }
      console.log(this.unumber, this.userid, this.pid);
    },
    //查看评论附属
    showTag(index) {
      this.commentdata[index].flag = !this.commentdata[index].flag;
      console.log(this.commentdata[index].flag);
    },
    // 点击加载剩余评论
    getmore(index, id) {
      let curpage = this.commentdata[index].curpage + 1;
      console.log(curpage, "comment_sub_info.");
      let page = this.commentdata[index].comment_sub_info.page_count % 4;
      if (page != 0) {
        this.pageNum =
          parseInt(this.commentdata[index].comment_sub_info.page_count / 4) + 1;
      } else {
        this.pageNum = parseInt(
          this.commentdata[index].comment_sub_info.page_count / 4
        );
      }
      console.log(this.pageNum, this.upage.pageindex, "pp");
      if (curpage > this.pageNum) {
        uni.showToast({
          icon: "none",
          title: "已全部加载",
          duration: 2000,
        });
        this.showmore = false;
        return;
      }
      // 点击加载剩余评论
      let param = {
        key: this.$db.get("token"),
        ID: id,
        curpage,
        num: this.upage.perPage,
      };
      if (this.commentdata[index].flag) {
        this.$api.lookcomment(param, (res) => {
          this.commentdata[index].comment_sub_info.info = this.commentdata[
            index
          ].comment_sub_info.info.concat(res.datas.info);
          this.commentdata[index].curpage = curpage;
        });
      }
    },
    // },
    // 改变首次评论状态
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
  },
  filters: {
    cubsub(value, num) {
      if (value.length > num) {
        return value.substr(0, num) + "...";
      } else {
        return value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../static/css/detail.scss";
</style>

