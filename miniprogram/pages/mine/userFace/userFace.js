// pages/user/userFace/userFace.js
Page({

    data: {
        showcamera: true,
        bgcolor: '#F2F2F2',
        colorArray: ['#F2F2F2', '#F56B79', '#74B2FF'],
        current: 0,
        tipsText: '请显示正脸',
        tempImg: '',
        result: ""
    },
    onLoad() {
        this.initData()
    },

    onShow() {
        setInterval(() => {
            if (this.data.current > 2) {
                this.setData({
                    current: 0
                })
            }
            this.changes()
            this.setData({
                current: this.data.current + 1
            })
        }, 2000)
    },
    changes() {
        this.setData({
            bgcolor: this.data.colorArray[this.data.current]
        })
    },
    initData() {
        var _ = this
        wx.initFaceDetect()
        const context = wx.createCameraContext()
        const listener = context.onCameraFrame((frame) => {
            wx.faceDetect({
                frameBuffer: frame.data,
                width: frame.width,
                height: frame.height,
                enablePoint: true,
                enableConf: true,
                enableAngle: true,
                enableMultiFace: true,
                success: (faceData) => {
                    let face = faceData.faceInfo[0]
                    if (faceData.x == -1 || faceData.y == -1) {
                        _.setData({
                            tipsText: "检测不到人脸"
                        })
                    }
                    if (faceData.faceInfo.length > 1) {
                        _.setData({
                            tipsText: "请保证只有一人做认证"
                        })
                    } else {
                        if (face.angleArray.pitch >= 0.1 || face.angleArray.roll >= 0.1 || face.angleArray.yaw >= 0.1) {
                            _.setData({
                                tipsText: "请平视摄像头"
                            })
                        } else if (face.confArray.global <= 0.8 || face.confArray.leftEye <= 0.8 || face.confArray.mouth <= 0.8 || face.confArray.nose <= 0.8 || face.confArray.rightEye <= 0.8) {
                            _.setData({
                                tipsText: "请勿遮挡五官"
                            })
                        } else {
                            _.setData({
                                tipsText: "人脸验证成功，正在录入人脸"
                            })
                            listener.stop()
                            setTimeout(() => {
                                context.takePhoto({
                                    quality: "high",
                                    success: res => {
                                        // 照相成功的回调
                                        wx.showLoading({ // 显示加载中loading效果 
                                            title: "正在录入人脸",
                                            mask: true //开启蒙版遮罩
                                        });
                                        _.setData({
                                            // 隐藏相机
                                            showcamera: false
                                        })
                                        // tempFilePath可以作为img标签的src属性显示图片
                                        const tempFilePath = res.tempImagePath;
                                        const fileManager = wx.getFileSystemManager();
                                        const base64 = fileManager.readFileSync(tempFilePath, 'base64');
                                        var access_token = getApp().globalData.access_token
                                        wx.request({
                                            url: 'http://120.46.217.126:9999/face',
                                            header: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            method: "POST",
                                            data: {
                                                "base64": base64
                                            },
                                            success: res => {
                                                wx.hideLoading();
                                                wx.showModal({
                                                  title: '请确认信息',
                                                  content: res.data,
                                                  complete: res2 => {
                                                      var messageList = res.data.split("_")
                                                      if (res2.confirm) {
                                                          wx.cloud.callFunction({
                                                              name: "addData",
                                                              data: {
                                                                  userName: messageList[0],
                                                                  phone: messageList[1],
                                                                  userId: messageList[2],
                                                                  _openid: getApp().globalData.open_id
                                                              }
                                                          }).then(resAdd => {
                                                              wx.showModal({
                                                                title: '注册成功',
                                                                content: '验证成功，即将返回首页',
                                                                complete: (res) => {
                                                                    getApp().onLaunch()
                                                                    wx.switchTab({
                                                                      url: '../../home/home',
                                                                    })
                                                                }
                                                              })
                                                          })
                                                      }
                                                  }
                                                })
                                            }
                                        })
                                    },
                                    fail: () => {
                                        wx.showToast({
                                            title: "出现错误",
                                        })
                                    }
                                })
                            }, 2000)
                        }
                    }
                },
                fail: (err) => {
                    if (err.x == -1 || err.y == -1) {
                        _.setData({
                            tipsText: "检测不到人脸"
                        })
                    } else {
                        _.setData({
                            tipsText: "网络错误，请重试"
                        })
                    }
                }
            })
        })
        listener.start()
        // #endif

    }
})