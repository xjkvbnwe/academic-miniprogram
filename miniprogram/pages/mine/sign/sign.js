function DateToStr(date) {
  var year = date.getFullYear(); //年
  var month = date.getMonth(); //月
  var day = date.getDate(); //日
  var hours = date.getHours(); //时
  var min = date.getMinutes(); //分
  var second = date.getSeconds(); //秒
  return year + "-" +
    ((month + 1) > 9 ? (month + 1) : "0" + (month + 1)) + "-" +
    (day > 9 ? day : ("0" + day)) + " " +
    (hours > 9 ? hours : ("0" + hours)) + ":" +
    (min > 9 ? min : ("0" + min)) + ":" +
    (second > 9 ? second : ("0" + second));
}
// pages/mine/sign/sign.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      courseList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow() {
      var _ = this
      wx.cloud.callFunction({
        name: "sendPostRequest",
        data: {
          url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/kapi/v2/ozwe/ozwe_workmanage/getSignList",
          body: {
            "inputMap" : {
              "phone": getApp().globalData.phone
            }
          },
          headers: {
            "Content-Type": "application/json",
            "accesstoken": getApp().globalData.accessToken
          }
        }
      }).then(res => {
        var courseListResult = res.result.data
        var courseList = []
        for (var item of courseListResult) {
          if (DateToStr(new Date()) < item.endDate) {
            var object = {
              name: item.courseName,
              teacher: item.teacher,
              endDate: item.endDate,
              signBillno: item.signBillno,
              signType: item.signType,
              latitude: item.latitude,
              longitude: item.longitude,
              range: item.range,
              signTextKey: item.signTextKey,
            }
            courseList.unshift(object)
          }
        }
        _.setData({
          courseList: courseList
        })
      })
    },

    clickSign(e) {
      var index = e.currentTarget.dataset.index
      var signObject = this.data.courseList[index]
      if (signObject.signType == "0") {
        wx.cloud.callFunction({
          name: "sendPostRequest",
          data: {
            url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/kapi/v2/ozwe/ozwe_workmanage/userSign",
            body: {
              "inputMap" : {
                "billno": signObject.signBillno
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
            this.onShow();
          })
        })
      } else if (signObject.signType == "2") {
        wx.navigateTo({
          url: '../sign/function/signFunction?signType='+signObject.signType+"&signTextKey="+signObject.signTextKey+"&signBillno="+signObject.signBillno,
        })
      } else if (signObject.signType == "1") {
        wx.navigateTo({
          url: '../sign/function/signFunction?signType='+signObject.signType+"&latitude="+signObject.latitude
          +"&longitude="+signObject.longitude+"&range="+signObject.range+"&signBillno="+signObject.signBillno,
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
    onLoad() {

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