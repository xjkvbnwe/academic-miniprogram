// 云函数入口文件
const cloud = require('wx-server-sdk');
var rp = require('request-promise');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return await rp({
        url: "https://api.weixin.qq.com/sns/jscode2session",
        method: "POST",
        json: true,
        form: {
            js_code: event.code,
            appid: "wxa47f543b41806562", //仅为实例appid
            secret: "d397a785508324258afd237da9402d0f", //仅为实例secret
            grant_type: "authorization_code"
        },
        headers: {
          //"content-type": "application/json",
          "content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      })
      .then(function (res) {
        return res
      })
      .catch(function (err) {
        return '请求失败'
      });
    // await wx.request({
    //     url: 'https://api.weixin.qq.com/sns/jscode2session', //微信服务器获取appid的网址 不用变
    //     method: 'POST', //必须是post方法
    //     data: {
    //         js_code: res.code,
    //         appid: "wxa47f543b41806562", //仅为实例appid
    //         secret: "d397a785508324258afd237da9402d0f", //仅为实例secret
    //         grant_type: "authorization_code"
    //     },
    //     header: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //     },
    //     success: function (response) {
    //         res = response
    //     }
    // })
}