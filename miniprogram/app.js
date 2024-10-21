// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    this.globalData = {
      phone: "",
      mainId: "",
      mainContent: {},
      isPublish: true,
      registerFlag: false,
      userDataId: "",
      checkType: "",
      open_id: "",
      session_key: "",
      userInfo: {},
      accessToken: "",
      adminItem: [],
      employId: "",
      mainPageNotifyList: [],
      userData: {
        nickName: "醉倾梦",
        avatarUrl: "blob:http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/36bd024a-a345-4da9-92c4-cfcf6820b691"
      }
    };

    var _ = this

    wx.login({
      success: (res) => {
        wx.showLoading({
          title: '正在登录',
        })
        if (res.code) {
          wx.cloud.callFunction({
              name: "userLogin",
              data: {
                code: res.code
              }
            })
            .then(response => {
              getApp().globalData.open_id = response.result.openid
              getApp().globalData.session_key = response.result.session_key
              const db = wx.cloud.database()
              db.collection("user")
                .where({
                  _openid: getApp().globalData.open_id
                })
                .get()
                .then(res => {
                  if (res.data.length == 0) {
                    wx.hideLoading()
                    wx.showModal({
                      title: '未注册提示',
                      content: '检测到您当前的微信号未绑定学工系统，点击确定前往人脸绑定页面',
                      success(res1) {
                        if (res1.confirm) {
                          
                          console.log('用户点击确定')
                          _.globalData.registerFlag = true
                          _.globalData.employId = res.data;
                            if (_.employIdCallback) { //判断app.js中是否存在该回调函数，也就是是否存在改方法
                              _.employIdCallback();
                            }
                          return;
                        } else if (res1.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                    return
                  }
                  var phone = res.data[0].phone
                  getApp().globalData.phone = phone
                  wx.getStorage({
                    key: "access_token",
                    success: res => {
                      wx.getStorage({
                        key: "end_data",
                        success: res2 => {
                          var timeStamp = Date.parse(new Date())
                          if (timeStamp > res2.data) {
                            wx.cloud.callFunction({
                                name: "getAccessToken"
                              })
                              .then(res => {
                                wx.hideLoading()
                                var accessToken = res.result.data.access_token
                                getApp().globalData.accessToken = accessToken
                                wx.setStorageSync('access_token', accessToken)
                                wx.setStorageSync('end_data', Date.parse(new Date()) + 600000)
                                console.log(getApp().globalData.accessToken)
                                _.globalData.employId = res.data;
                                if (_.employIdCallback) { //判断app.js中是否存在该回调函数，也就是是否存在改方法
                                  _.employIdCallback();
                                }
                              })
                          } else {
                            wx.hideLoading()
                            getApp().globalData.accessToken = res.data
                            console.log(getApp().globalData.accessToken)
                            _.globalData.employId = res.data;
                            if (_.employIdCallback) { //判断app.js中是否存在该回调函数，也就是是否存在改方法
                              _.employIdCallback();
                            }
                          }
                        }
                      })
                    },
                    fail: err => {
                      wx.cloud.callFunction({
                          name: "getAccessToken"
                        })
                        .then(res => {
                          wx.hideLoading()
                          var accessToken = res.result.data.access_token
                          getApp().globalData.accessToken = accessToken
                          wx.setStorageSync('access_token', accessToken)
                          wx.setStorageSync('end_data', Date.parse(new Date()) + 600000)
                          console.log(getApp().globalData.accessToken)
                          _.globalData.employId = res.data;
                          if (_.employIdCallback) { //判断app.js中是否存在该回调函数，也就是是否存在改方法
                            _.employIdCallback();
                          }
                        })
                    }
                  })
                })
            })
        }
      },
    })
  }
});