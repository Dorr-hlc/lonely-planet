function share() {
    var hts = window.location.protocol; //设置或获取 URL 的协议部分
    var hosts = window.location.host; //设置或获取 URL 的主机部分
    var ApiUrl = "" + hts + "//" + hosts + "/mobile";
    var WapSiteUrl = "" + hts + "//" + hosts + "/hole";
    var title = "孤独树洞";
    var shareimg = WapSiteUrl + '/static/image/share.png'; //分享的图片
    var desc = "孤独树洞"; //分享的描述信息
    var url = window.location.href.split('#')[0];
    var urls = "http://m.yijiaobao.com.cn/hole.php";
    $.post(ApiUrl + "/index.php?act=wxshare&op=share", { urls: url }, function(res) {
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
        wx.ready(function() {
            wx.hideMenuItems({
                menuList: [
                    'menuItem:share:weiboApp',
                    /*  'menuItem:favorite',*/
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
                ],
                success: function(res) {},
                fail: function(res) {}
            });
            // 在这里调用 API
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: urls, // 分享链接
                imgUrl: shareimg, // 分享图标
                success: function() {
                    // Mlayer('分享成功','温馨提示');
                },
                cancel: function() {
                    alert('您已取消分享', '温馨提示');
                }
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: urls, // 分享链接
                imgUrl: shareimg, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    //layer.msg('分享成功','温馨提示');
                },
                cancel: function() {
                    alert('您已取消分享', '温馨提示');
                }
            });

            wx.onMenuShareQQ({
                title: title,
                link: urls,
                imgUrl: shareimg,
                success: function() {
                    //layer.msg('分享成功','温馨提示');
                },
                cancel: function() {
                    alert('您已取消分享', '温馨提示');
                }
            });


            wx.onMenuShareQZone({
                title: title,
                link: urls,
                imgUrl: shareimg,
                success: function() {
                    //layer.msg('分享成功','温馨提示');
                },
                cancel: function() {
                    alert('您已取消分享', '温馨提示');
                }
            });

            wx.error(function(res) {
                //alert(res.errMsg);  //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示

            });
        });
    }, "json");
}
// share();