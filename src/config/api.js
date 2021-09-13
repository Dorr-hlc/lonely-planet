import {
    apiBaseUrl
} from './config.js';
import {
    h5Url
} from './config.js';
import * as common from './common.js' //引入common
import * as db from './db.js' //引入common
// 需要登陆的，都写到这里，否则就是不需要登陆的接口
const methodsToken = [
    'square',
    'comment_sub_list',
];
const post = (method, data, callback, complete) => {
    // uni.showLoading({
    //     title: '加载中'
    // });
    // 判断token是否存在
    if (methodsToken.indexOf(method) >= 0) {
        //	获取用户token
        let userToken = db.get("token");
        if (!userToken) {
            common.ToLogin();
            return false;
        } else {
            data.key = userToken;
        }
    }
    //data.method = method;
    uni.request({
        url: h5Url + method,
        data: data,
        header: {
            'Accept': 'application/json,text/plain',
            //'Content-Type': 'application/json; charset=utf-8',
            'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
        },
        method: 'POST',
        success: (response) => {
            uni.hideLoading();
            const result = response.data
            if (!result.status) {
                // 登录信息过期或者未登录
                // if (result.data === 14007 || result.data === 14006) {
                // 	db.del("key");
                // 	uni.showToast({
                // 		title: result.msg,
                // 		icon: 'none',
                // 		duration: 1000,
                // 		complete: function() {
                // 			setTimeout(function() {
                // 				uni.hideToast();

                // 				uni.navigateTo({
                // 					url: '/pages/souquan/index'
                // 				})

                // 			}, 1000)
                // 		}
                // 	});
                // }
            }
            callback(result);
        },
        complete: (response) => {
            // setTimeout(function() {
            //     uni.hideLoading();
            // }, 300)
            complete ? complete() : "";
        },
        fail: (error) => {
            uni.showLoading({
                title: '网络开小差了'
            });
            setTimeout(function() {
                uni.hideLoading();
            }, 1000)
            if (error && error.response) {
                showError(error.response);
            } else {

            }

        },
    });

}

const get = (method, data, callback) => {
    // uni.showLoading({
    //     title: '加载中'
    // });
    uni.request({
        url: h5Url + method,
        header: {
            'Accept': 'application/json,text/plain',
            'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
        },
        data: data,
        method: 'GET',
        success: (response) => {
            uni.hideLoading();
            callback(response.data);
        },
        fail: (error) => {
            uni.hideLoading();
            if (error && error.response) {
                showError(error.response);
            }
        },
        complete: () => {
            setTimeout(function() {
                uni.hideLoading();
            }, 250);
        }
    });
}
const showError = error => {
    let errorMsg = ''
    switch (error.status) {
        case 400:
            errorMsg = '请求参数错误'
            break
        case 401:
            errorMsg = '未授权，请登录'
            break
        case 403:
            errorMsg = '跨域拒绝访问'
            break
        case 404:
            errorMsg = `请求地址出错: ${error.config.url}`
            break
        case 408:
            errorMsg = '请求超时'
            break
        case 500:
            errorMsg = '服务器内部错误'
            break
        case 501:
            errorMsg = '服务未实现'
            break
        case 502:
            errorMsg = '网关错误'
            break
        case 503:
            errorMsg = '服务不可用'
            break
        case 504:
            errorMsg = '网关超时'
            break
        case 505:
            errorMsg = 'HTTP版本不受支持'
            break
        default:
            errorMsg = error.msg
            break
    }

    uni.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 1000,
        complete: function() {
            setTimeout(function() {
                uni.hideToast();
            }, 1000);
        }
    });
}

// 文件上传
export const uploadFiles = (callback) => {
    uni.chooseImage({
        sizeType: ['compressed'],
        success: (chooseImageRes) => {
            uni.showLoading({
                title: '上传中...'
            });
            const tempFilePaths = chooseImageRes.tempFilePaths;
            console.log(tempFilePaths);
            const uploadTask = uni.uploadFile({
                url: h5Url + 'tree_hole&op=image_header', //仅为示例，非真实的接口地址
                filePath: tempFilePaths[0],
                fileType: 'image',
                name: 'file',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                formData: {
                    'key': db.get('token'),
                    'file': tempFilePaths[0]
                },
                success: (uploadFileRes) => {
                    callback(JSON.parse(uploadFileRes.data));
                },
                fail: (error) => {
                    if (error && error.message) {
                        showError(error.message);
                    }
                },
                complete: () => {
                    setTimeout(function() {
                        uni.hideLoading();
                    }, 1000);
                }
            });
        }
    });
}


// // 获取个人信息
// export const userdeil = (data, callback) => post('/api/ys/user', data, callback);
// //小程序解析code
// export const login1 = (data, callback) => post('/xcx/xadyhcode', data, callback);
// //小程序登录
// export const login2 = (data, callback) => post('/xcx/xadyhlogin', data, callback);
// // 用户信息
// export const userInfo = (data, callback) => post('/api/user/getwxuser', data, callback);

// //检查项目
// export const checkuplist = (data, callback) => post('/api/ys/checkup', data, callback);
// //检查项目
// export const checkupdetail = (data, callback) => post('/api/ys/checkupview', data, callback);


//上传文件
export const uploadfile = (callback) => uploadFiles(callback);
// 删除图片
export const picdelete = (data, callback) => post('tree_hole&op=del_file_uploads', data, callback);
// 发布话题
export const add = (data, callback) => post('tree_hole&op=hole_add', data, callback);
// 获取广场数据
export const getlist = (data, callback) => get('tree_hole&op=square', data, callback);
// 点击抱一抱
export const hug = (data, callback) => post('tree_hole&op=hole_give', data, callback);
// 查看话题详情上半部
export const topdetail = (data, callback) => post('tree_hole&op=hole_comment', data, callback);
// 查看话题详情下半部
export const botdetail = (data, callback) => get('tree_hole&op=comment_info', data, callback);
// 发布首次评论
export const firstcomment = (data, callback) => post('tree_hole&op=one_add_comment', data, callback);
// 发布附属评论
export const comment = (data, callback) => post('tree_hole&op=sub_add_comment', data, callback);
// 查看评论附属
export const lookcomment = (data, callback) => get('tree_hole&op=comment_sub_list', data, callback);
// 我对别人的评论，别人对我的评论
export const mytopic = (data, callback) => get('tree_hole&op=reply_topic', data, callback);
// 改变评论的状态
export const read = (data, callback) => post('tree_hole&op=modify_status', data, callback);
// 投诉话题
export const complaint = (data, callback) => post('tree_hole&op=add_hole_complaint', data, callback);
// 未读消息
export const noread = (data, callback) => post('tree_hole&op=unread_info', data, callback);
// 获取登录id
export const getid = (data, callback) => post('tree_hole&op=user_id', data, callback);
// 分享
export const share = (data, callback) => post('wxshare&op=share', data, callback);