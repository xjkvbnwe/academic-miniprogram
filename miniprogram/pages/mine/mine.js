// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
    machineNum: 2,
    money: 1000,
    phone: "19999999999",
    authentication: "",
    nickName: "微信用户"
  },

  scan() {

  },
  pubnishSign() {
    wx.navigateTo({
      url: '../functionPage/pubnishSign/pubnishSign',
    })
  },
  courseClick() {
    wx.navigateTo({
      url: '../functionPage/selectCourse/course',
    })
  },
  healthClick() {
    wx.navigateTo({
      url: '../functionPage/health/health',
    })
  },
  cardClick() {
    wx.navigateTo({
      url: '../functionPage/studentGet/studentGet',
    })
  },
  examClick() {
    wx.navigateTo({
      url: '../functionPage/score/score',
    })
  },
  moneyClick() {
    wx.navigateTo({
      url: '../functionPage/money/money',
    })
  },

  userSign() {
    wx.navigateTo({
      url: '../mine/sign/sign',
    })
  },

  bindClick() {
    wx.navigateTo({
      url: './userFace/userFace',
    })
    // wx.request({
    //   url: 'http://120.46.217.126:10001/face',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   method: "POST",
    //   // data: {
    //   //   "base64": base64
    //   // },
    //   success: res => {
    //     console.log(res)
    //   }
    // })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (getApp().globalData.userData.authentication) {
      this.setData({
        authentication: "已认证",
        img: getApp().globalData.userData.avatarUrl
      })
    }
    this.setData({
      nickName: getApp().globalData.userData.nickName
    })
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