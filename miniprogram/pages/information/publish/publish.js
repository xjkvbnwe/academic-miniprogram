// pages/photoDoor/index.js
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
Page({

    name(e) {
        this.setData({
            name: e.detail.value
        })
    },

    message(e) {
        this.setData({
            message: e.detail.value
        })
    },

    /**
     * 页面的初始数据
     */
    data: {
        name: "",
        serverName: "TestServer",
        message: "",
        show: true, //显示选择图片的按钮
        imgList: [],
        typeFontSize: 26,
        typeColor: "rgb(129, 127, 127);",
        typeMsg: "请选择帖子主题",
        maxPhoto: 9, //最大上传10张图片
        Collection: 0,
        Like: 0,
        Look: 0,
        comment_list: [],
        comment_list2: [],
    },


    onLoad: function (options) {
        var _ = this
        if (!getApp().globalData.isPublish) {
            _.setData({
                name: getApp().globalData.mainContent.Title,
                typeMsg: getApp().globalData.mainContent.type,
                message: getApp().globalData.mainContent.Message,
                imgList: getApp().globalData.mainContent.imgList,
                Collection: getApp().globalData.mainContent.Collection,
                Like: getApp().globalData.mainContent.Like,
                Look: getApp().globalData.mainContent.Look,
                comment_list: getApp().globalData.mainContent.comment_list,
                comment_list2: getApp().globalData.mainContent.comment_list2
            })
        }
    },

    selectType() {
        if (!getApp().globalData.isPublish) {
            return;
        }
        var list = ["动态", "讨论", "反馈"];
        wx.showActionSheet({
            itemList: list,
            success: res => {
                this.setData({
                    typeMsg: list[res.tapIndex],
                    typeColor: "",
                    typeFontSize: "28"
                })
            }
        })
    },

    onShow: function () {
        //自定义的tabbar
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
    },
    /**
     * 选择上传方式
     * @param {*} e 
     */
    chooseImg(e) {
        if (this.NextTap) {
            return;
        }
        this.NextTap = true;
        setTimeout(() => {
            this.NextTap = false;
        }, 1500) //1.5秒之后可以再次点击，防止用户重复点击
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            success: (res) => {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        this.chooseWxImage('album') //相册
                    } else if (res.tapIndex == 1) {
                        this.chooseWxImage('camera') //拍照
                    }
                }
            }
        })
    },
    /**
     * 上传照片
     * @param {*} type 
     */
    chooseWxImage: function (type) {
        let {
            imgList,
            maxPhoto
        } = this.data
        if (imgList.length > 9) {
            wx.showToast({
                title: '最多上传9张',
                icon: 'none',
                duration: 2000
            })
            return
        }
        wx.chooseMedia({
            count: maxPhoto - imgList.length,
            mediaType: ['image'],
            sourceType: [type],
            success: (res) => {
                let tempFiles = res.tempFiles //成功后返回的的路径
                tempFiles.forEach(item => {
                    imgList.push(item.tempFilePath)
                })
                this.setData({
                    imgList: imgList,
                    show: imgList.length >= 9 ? false : true
                })
            }
        })
    },

    saveImg(item, imgListUrl) {
        var _ = this
        var s = ""
        for (var i = 0; i < 15; i++) {
            s = s + (Math.random() * 9).toFixed()
        }
        wx.cloud.uploadFile({
            cloudPath: "TestServer/" + s + ".png",
            filePath: _.data.imgList[item],
            success: (res => {
                imgListUrl.push("https://626f-bookmanage-8gtw1zmo8e08a73a-1313518282.tcb.qcloud.la/TestServer" + "/" + s + ".png")
                if (imgListUrl.length == _.data.imgList.length) {
                    var functionName = "addData2"
                    if (!getApp().globalData.isPublish) {
                        functionName = "updateData"
                    }
                    wx.cloud.callFunction({
                        name: functionName,
                        data: {
                            databaseName: "CommunityDatabase",
                            id: getApp().globalData.mainId,
                            data: {
                                Author: getApp().globalData.open_id,
                                Collection: _.data.Collection,
                                Like: _.data.Like,
                                Look: _.data.Look,
                                Message: _.data.message,
                                Time: DateToStr(new Date()),
                                Title: _.data.name,
                                imgList: imgListUrl,
                                type: _.data.typeMsg,
                                comment_list: _.data.comment_list,
                                comment_list2: _.data.comment_list2,
                                userId: getApp().globalData.userData._id
                            }
                        }
                    }).then(res => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon: "success",
                            duration: 1000,
                            success: res => {
                                setTimeout(function () {
                                    var pages = getCurrentPages();
                                    for (var i in pages) {
                                        if (pages[i].route.indexOf("community/community")) {
                                            var prePage = pages[i]
                                            prePage.onLoad();
                                            wx.switchTab({
                                                url: '../information',
                                            })
                                            return;
                                        }
                                    }
                                }, 1000)
                            }
                        })
                    })
                }
            }),
            fail: (err => {
                console.log(err)
            })
        })
    },

    publish() {
        var _ = this;
        if ((_.data.name == "") || (_.data.typeMsg == "请选择帖子主题") || (_.data.message == "")) {
            wx.showModal({
                title: '信息不完整',
                content: "请将信息填写完整"
            })
            return;
        }
        wx.showModal({
            title: '确定信息',
            content: "确定要发布帖子吗",
            success: res => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '发布中',
                    })
                    var imgListUrl = []
                    var functionName = "addData2"
                    if (!getApp().globalData.isPublish) {
                        functionName = "updateData"
                    }
                    if (_.data.imgList.length == 0) {
                        wx.cloud.callFunction({
                            name: functionName,
                            data: {
                                databaseName: "CommunityDatabase",
                                id: getApp().globalData.mainId,
                                data: {
                                    Author: getApp().globalData.open_id,
                                    Collection: _.data.Collection,
                                    Like: _.data.Like,
                                    Look: _.data.Look,
                                    Message: _.data.message,
                                    Time: DateToStr(new Date()),
                                    Title: _.data.name,
                                    imgList: [],
                                    type: _.data.typeMsg,
                                    comment_list: _.data.comment_list,
                                    comment_list2: _.data.comment_list2,
                                    userId: getApp().globalData.userData._id
                                }
                            }
                        }).then(res => {
                            wx.showToast({
                                title: '发布成功',
                                icon: "success",
                                duration: 1000,
                                success: res => {
                                    setTimeout(function () {
                                        var pages = getCurrentPages();
                                        for (var i in pages) {
                                            if (pages[i].route.indexOf("community/community")) {
                                                var prePage = pages[i]
                                                prePage.onLoad();
                                                wx.switchTab({
                                                    url: '../information',
                                                })
                                                return;
                                            }
                                        }
                                    }, 1000)
                                }
                            })
                        })
                    } else {
                        for (var item in _.data.imgList) {
                            if (_.data.imgList[item].indexOf("https://626f-bookmanage-8gtw1zmo8e08a73a-1313518282.tcb.qcloud.la/TestServer") != -1) {
                                imgListUrl.push(_.data.imgList[item])
                                if (imgListUrl.length == _.data.imgList.length) {
                                    var functionName = "addData2"
                                    if (!getApp().globalData.isPublish) {
                                        functionName = "updateData"
                                    }
                                    wx.cloud.callFunction({
                                        name: functionName,
                                        data: {
                                            databaseName: "CommunityDatabase",
                                            id: getApp().globalData.mainId,
                                            data: {
                                                Author: getApp().globalData.open_id,
                                                Collection: _.data.Collection,
                                                Like: _.data.Like,
                                                Look: _.data.Look,
                                                Message: _.data.message,
                                                Time: DateToStr(new Date()),
                                                Title: _.data.name,
                                                imgList: imgListUrl,
                                                type: _.data.typeMsg,
                                                comment_list: _.data.comment_list,
                                                comment_list2: _.data.comment_list2,
                                                userId: getApp().globalData.userData._id
                                            }
                                        }
                                    }).then(res => {
                                        wx.hideLoading()
                                        wx.showToast({
                                            title: '发布成功',
                                            icon: "success",
                                            duration: 1000,
                                            success: res => {
                                                setTimeout(function () {
                                                    var pages = getCurrentPages();
                                                    for (var i in pages) {
                                                        if (pages[i].route.indexOf("community/community")) {
                                                            var prePage = pages[i]
                                                            prePage.onLoad();
                                                            wx.switchTab({
                                                                url: '../information',
                                                            })
                                                            return;
                                                        }
                                                    }
                                                }, 1000)
                                            }
                                        })
                                    })
                                }
                            } else {
                                this.saveImg(item, imgListUrl);
                            }
                        }
                    }
                }
            }
        })

    },

    /*
     * 图片预览
     * @param e
     */
    previewImg(e) {
        let currentUrl = e.currentTarget.dataset.src;
        let urls = this.data.imgList
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    /**
     * 删除上传的图片
     * @param e
     */
    deleteUpload(e) {
        let {
            index
        } = e.currentTarget.dataset, {
            imgList
        } = this.data
        imgList.splice(index, 1)
        this.setData({
            imgList: imgList,
            show: imgList.length >= 9 ? false : true
        })
    }

})