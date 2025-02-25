// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return await rp({
            uri: event.url,
            method: "POST",
            form: event.form,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
        })
        .then(function (res) {
            return res;
        })
        .catch(function (err) {
            return err
        });
}