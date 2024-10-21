
// pages/mine/sign/function/signFunction.js
function getDistance(la1, lo1, la2, lo2) {
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = s.toFixed(2);
  return s;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signBillno: "",
    signType: "0",
    signTextKey: "",
    latitude: 0,
    longitude: 0,
    userLatitude: 0,
    userLongitude: 0,
    range: 0
  },

  signText: function (e) {
    var signText = e.detail.value
    if (signText == this.data.signTextKey) {
      wx.cloud.callFunction({
        name: "sendPostRequest",
        data: {
          url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/kapi/v2/ozwe/ozwe_workmanage/userSign",
          body: {
            "inputMap": {
              "billno": this.data.signBillno
            }
          },
          headers: {
            "Content-Type": "application/json",
            "accesstoken": getApp().globalData.accessToken
          }
        }
      }).then(res => {
        wx.showToast({
          title: '签到成功',
          icon: "success"
        }).then(res => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var _ = this
    _.setData({
      signType: options.signType,
      signTextKey: options.signTextKey,
      latitude: options.latitude,
      longitude: options.longitude,
      range: options.range,
      signBillno: options.signBillno
    })
    if (options.signType == "1") {
      wx.getLocation({
        isHighAccuracy: true,
        success(res) {
          var latitude = res.latitude
          var longitude = res.longitude
          _.setData({
            userLatitude: latitude,
            userLongitude: longitude
          })
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },

  click() {
    var distance = getDistance(this.data.latitude, this.data.longitude, this.data.userLatitude, this.data.userLongitude) * 1000
    if (distance <= parseInt(this.data.range)) {
      wx.cloud.callFunction({
        name: "sendPostRequest",
        data: {
          url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/kapi/v2/ozwe/ozwe_workmanage/userSign",
          body: {
            "inputMap": {
              "billno": this.data.signBillno
            }
          },
          headers: {
            "Content-Type": "application/json",
            "accesstoken": getApp().globalData.accessToken
          }
        }
      }).then(res => {
        wx.showToast({
          title: '签到成功',
          icon: "success"
        }).then(res => {
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        })
      })
    } else {
      wx.showToast({
        title: '不在签到范围',
        icon: "error"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})