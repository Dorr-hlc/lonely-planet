import * as wx from './jweixin'
// var wx = require('weixin-js-sdk')
import * as api from './api'

function share_yp(title, shareimg, present, desc) {
    // console.log(title, shareimg, present, desc);
    api.share({
        urls: window.location.href.split('#')[0],
    }, res => {
        wx.config({
            debug: false, ////生产环境需要关闭debug模式
            appId: res.datas.appId, //appId通过微信服务号后台查看
            timestamp: res.datas.timestamp, //生成签名的时间戳
            nonceStr: res.datas.nonceStr, //生成签名的随机字符串
            signature: res.datas.signature, //签名
            jsApiList: [ //需要调用的JS接口列表
                'hideMenuItems', //判断当前客户端版本是否支持指定JS接口
                'onMenuShareTimeline', // 分享到朋友圈
                'onMenuShareAppMessage', //分享给好友
                'onMenuShareQQ', // 分享到QQ
                'onMenuShareQZone' // 分享到QQ空间
            ]
        });
        var wxdata = {
            title: '孤独星球', // 分享标题
            desc: '树洞广场', // 分享描述
            link: 'http://m.yijiaobao.com.cn/hole/starry/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'http://m.yijiaobao.com.cn/hole/static/image/share.png', // 分享图标
            success: function(res) {
                console.log(res);
            },
            cancel: function() {
                // msgtip("您已取消分享");
            },
            fail: function(res) {
                // msgtip("分享失败");
            }
        };
        wx.ready(function() {
            wx.hideMenuItems({
                menuList: [
                    'menuItem:share:weiboApp',
                    /*    'menuItem:favorite',*/
                    'menuItem:share:facebook',
                    'menuItem:editTag',
                    'menuItem:delete',
                    'menuItem:originPage',
                    'menuItem:copyUrl',
                    'menuItem:readMode',
                    'menuItem:openWithQQBrowser',
                    'menuItem:openWithSafari',
                    'menuItem:share:email',
                    'menuItem:share:brand'
                ]
            });
            wx.onMenuShareTimeline(wxdata);
            wx.onMenuShareAppMessage(wxdata);
            wx.onMenuShareQQ(wxdata);
            wx.onMenuShareQZone(wxdata);
        });
    })
}


export {
    share_yp
}