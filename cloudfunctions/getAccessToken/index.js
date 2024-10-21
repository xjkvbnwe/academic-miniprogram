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
            url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/api/getAppToken.do",
            method: "POST",
            json: true,
            body: {
                appId: "StudentSystem",
                appSecret: "Kingdee_1234567890Yangyan.",
                accountId: "1669639384925732864",
                tenantid: "bos"
            },
            headers: {
                "content-type": "application/json",
                // "content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
        })
        .then(async function (res1) {
            var appToken = res1.data.app_token
            const res2 = await rp({
                url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/api/login.do",
                method: "POST",
                json: true,
                body: {
                    "user": "19950422959",
                    "apptoken": appToken,
                    "tenantid": "",
                    "accountId": "1669639384925732864",
                    "usertype": "Mobile"
                },
                headers: {
                    "content-type": "application/json",
                },
            })
            return res2
        })
        .catch(function (err) {
            return '请求失败'
        });
}