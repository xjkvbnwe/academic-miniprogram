// pages/information/notify/notify.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: "",
        userId: "",
        date: "",
        content: "",
        type: 1,
        
    },

    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            name: getApp().globalData.mainPageNotifyList[options.index].content,
            date: getApp().globalData.mainPageNotifyList[options.index].date,
            content: getApp().globalData.mainPageNotifyList[options.index].information,
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