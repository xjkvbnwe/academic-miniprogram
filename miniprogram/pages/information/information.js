// pages/another/scroll-x/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isRefresh: false,
        currentTab: 0,
        filter1: "按时间排序",
        allList: [],
        tabList: [{
                name: '动态',
                list: []
            },
            {
                name: '讨论',
                list: []
            },
            {
                name: "反馈",
                list: []
            }
        ],
        inputInfo: ""

    },

    check(e) {
        var _ = this
        var inputInfo = e.detail.value
        this.setData({
            inputInfo: inputInfo
        })
        if (inputInfo.length == 0) {
            this.setData({
                tabList: _.data.allList
            })
        }
    },

    checkContent() {
        var tabList = [{
                name: '动态',
                list: []
            },
            {
                name: '反馈',
                list: []
            }
        ]
        var allList = this.data.allList
        for (var i in allList) {
            for (var ii in allList[i].list) {
                if (
                    (allList[i].list[ii].Title.indexOf(this.data.inputInfo) != -1) ||
                    (allList[i].list[ii].Author.indexOf(this.data.inputInfo)) != -1) {
                    tabList[i].list.push(allList[i].list[ii])
                }

            }
        }
        this.setData({
            tabList: tabList
        })
    },

    mainClick(e) {
        getApp().globalData.mainId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: './message/message',
        })
    },

    addClick() {
        getApp().globalData.isPublish = true
        wx.navigateTo({
            url: './publish/publish',
        })
    },

    tabNav(e) {
        let currentTab = e.currentTarget.dataset.index
        this.setData({
            currentTab
        })
    },
    handleSwiper(e) {
        let {
            current,
            source
        } = e.detail
        if (source === 'autoplay' || source === 'touch') {
            const currentTab = current
            this.setData({
                currentTab
            })
        }
    },
    handleTolower(e) {
        wx.showToast({
            title: '到底啦'
        })
    },
    refresherpulling() {
        wx.showLoading({
            title: '刷新中'
        })
        setTimeout(() => {
            this.setData({
                isRefresh: false
            })
            wx.showToast({
                title: '加载完成'
            })
        }, 1500)
    },
    onLoad: function (options) {
        var _ = this
        _.setData({
            allList: [],
            tabList: [{
                    name: '动态',
                    list: []
                },
                {
                    name: '讨论',
                    list: []
                },
                {
                    name: "反馈",
                    list: []
                }
            ],
        })
        const db = wx.cloud.database()
        db.collection("CommunityDatabase")
            .get()
            .then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    var type = res.data[i].type
                    for (var ii in _.data.tabList) {
                        if (type == _.data.tabList[ii].name) {
                            var tabList = _.data.tabList
                            tabList[ii].list.push(res.data[i])
                            _.setData({
                                tabList: tabList
                            })
                        }
                    }
                }
                var tabList = _.data.tabList
                for (var i in tabList) {
                    var infoList = tabList[i].list
                    for (var j = 0; j < infoList.length - 1; j++) {
                        for (var k = 1; k < infoList.length - j; k++) {
                            if (Date.parse(infoList[k - 1].Time) < Date.parse(infoList[k].Time)) {
                                var flag = infoList[k - 1]
                                infoList[k - 1] = infoList[k]
                                infoList[k] = flag
                            }
                        }
                    }
                    for (var l in infoList) {
                        infoList[l].hot = (infoList[l].Collection * 5) + (infoList[l].Like * 3) + (infoList[l].Look)
                    }
                    try {
                        tabList[i].list = infoList
                    } catch (err) {
                        continue;
                    }
                }
                _.setData({
                    tabList: tabList,
                    allList: tabList
                })
                console.log(tabList)
            })
    },


    onShow: function () {

    },


})