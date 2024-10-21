// pages/functionPage/schoolCode/schoolCode.js
import QRCode from '../../../utils/weapp.qrcode.esm.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: "",
        nickName: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        this.setData({
            phone: getApp().globalData.phone,
            nickName: getApp().globalData.userData.nickName
        })
        var that = this;
        const query = wx.createSelectorQuery()
        query.select('#qrcode')
            .fields({
                node: true,
                size: true
            })
            .exec((res) => {
                var canvas = res[0].node

                // 调用方法drawQrcode生成二维码
                QRCode({
                    canvas: canvas,
                    canvasId: 'qrcode',
                    // width: that.createRpx2px(300),
                    padding: 10,
                    background: '#ffffff',
                    foreground: '#000000',
                    text: getApp().globalData.accessToken,
                })

                // 获取临时路径（得到之后，想干嘛就干嘛了）
                wx.canvasToTempFilePath({
                    canvasId: 'qrcode',
                    canvas: canvas,
                    x: 0,
                    y: 0,
                    // width: that.createRpx2px(300),
                    // height: that.createRpx2px(300),
                    // destWidth: that.createRpx2px(300),
                    // destHeight: that.createRpx2px(300),
                    success(res) {
                        // console.log('二维码临时路径：', res.tempFilePath)
                        that.setData({
                            qrcodePath: res.tempFilePath
                        })
                    },
                    fail(res) {
                        console.error(res)
                    }
                })
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