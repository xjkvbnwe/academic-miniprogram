// pages/home/home.js
// pages/statistics/statistics.js
const app = getApp()
var socket = null
const listMenu = [{
    name: '扫一扫',
    icon: '../../images/scan.png'
  },
  {
    name: '证件办理',
    icon: '../../images/kehu.png'
  },
  {
    name: '财务管理',
    icon: '../../images/caiwu.png'
  },
  {
    name: '健康预约',
    icon: '../../images/health.png'
  },
  {
    name: '校园码',
    icon: '../../images/cardcode.png'
  },
  {
    name: '在线选课',
    icon: '../../images/course.png'
  },
  {
    name: '成绩管理',
    icon: '../../images/result.png'
  },
  {
    name: '简历查看',
    icon: '../../images/exam.png'
  },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    d_num: 3,
    imgUrls: [{
        info: "img1",
        url: "../../images/lunbo.png"
      },
      {
        info: "img2",
        url: "../../images/lunbo.png"
      },
      {
        info: "img3",
        url: "../../images/lunbo.png"
      }
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    inputShowed: false,
    lists: [],
    arrLen: 4, //分组数 最大值10,当为奇数时候，默认加1提示为偶数
    oneLen: 4, //一行展示多少
    tab: [{
        name: "精选公告"
      },
      {
        name: "福利推荐"
      },
    ],
    loadFlag: false,
    nav_type: 0,
    shops: [],
    shopsInput: [],
    showReplenishment: false,
    step: {
      name: "userGuide",
      guideList: [{
          el: ".band_box",
          tips: "这里的按钮可以帮助您执行相应功能",
          style: "border-radius: 8rpx;margin: 0"
        },
        {
          el: ".card-box",
          tips: "在这里可以查看主要信息",
          style: "border-radius: 8rpx;margin: 0"
        },
        {
          el: ".page__bd",
          tips: "在这里可以看到进货推荐",
          style: "border-radius: 8rpx;margin: 0"
        }
      ]
    },
    notifyList: []
  },
  onTouchMove() {
    return;
  },
  navTab(e) {
    let {
      index
    } = e.currentTarget.dataset;
    if (this.data.type === index || index === undefined) {
      return false;
    } else {
      this.setData({
        nav_type: index,
      })
    }
  },
  getData() {
    let dataList = listMenu,
      {
        arrLen,
        oneLen
      } = this.data,
      lists = [],
      isOdd = (arrLen % 2) === 0;
    if (!isOdd && arrLen > 5) arrLen = arrLen + 1;
    arrLen = arrLen > 10 ? 10 : arrLen;
    oneLen = arrLen > 5 ? arrLen / 2 : arrLen;
    for (var i = 0; i < dataList.length; i += arrLen) {
      lists.push(dataList.slice(i, i + arrLen));
    }
    this.setData({
      lists,
      arrLen,
      oneLen,
    })
  },
  menuClick(e) {
    var index1 = e.currentTarget.dataset.index1
    var index = e.currentTarget.dataset.index
    switch (index1) {
      case 0: {
        switch (index) {
          case 0: {
            wx.scanCode({
              success: res => {
                var msgList = res.result.split("_")
                if (msgList[0].indexOf("newRegister") != -1) {
                  wx.navigateTo({
                    url: '../functionPage/register/register',
                  })
                } else if (msgList[0].indexOf("RegisterRoom") != -1) {
                  wx.cloud.callFunction({
                    name: "sendPostRequest",
                    data: {
                      url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/kapi/v2/ozwe/ozwe_workmanage/getRoomReg",
                      body: {
                        "inputMap": {
                          "1": "1"
                        }
                      },
                      headers: {
                        "Content-Type": "application/json",
                        "accesstoken": getApp().globalData.accessToken
                      }
                    }
                  }).then(res => {
                    console.log(res.result)
                    var resultList = res.result.data.split("_")
                    if (resultList[0] == "1") {
                      wx.showModal({
                        title: '登记成功',
                        content: resultList[1],
                        complete: (res) => {
                        }
                      })
                    }
                  })
                }else {
                  wx.showToast({
                    title: '请扫描正确的二维码',
                    icon: "error"
                  })
                }
              }
            })
            break;
          }
          case 1: {
            wx.navigateTo({
              url: '../functionPage/studentApply/studentApply',
            })
            break;
          }
          case 2: {
            wx.navigateTo({
              url: '../functionPage/money/money',
            })
            break;
          }
          case 3: {
            wx.navigateTo({
              url: '../functionPage/health/health',
            })
            break;
          }
        }
        break
      }
      case 1: {
        switch (index) {
          case 0: {
            wx.navigateTo({
              url: '../functionPage/schoolCode/schoolCode',
            })
            break;
          }
          case 1: {
            wx.navigateTo({
              url: '../functionPage/selectCourse/course',
            })
            break
          }
          case 2: {
            wx.navigateTo({
              url: '../functionPage/score/score',
            })
            break
          }
          case 3: {
            wx.navigateTo({
              url: '../functionPage/resume/resume',
            })
            break;
          }
        }
        break
      }
    }
  },

  swiperClick() {
    console.log(123)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData()
    var contentList = this.data.notifyList
    for (var contentObject of contentList) {
      if (contentObject.content.length > 22) {
        var newStr = contentObject.content.substring(0, 23)
        newStr += "..."
        contentObject.content = newStr
      }
    }
    this.setData({
      notifyList: contentList
    })
  },

  clickNotify(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../information/notify/notify?index='+index,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var _ = this
    if (getApp().globalData.employId && getApp().globalData.employId != '') {} else {
      getApp().employIdCallback = () => {
        if (getApp().globalData.registerFlag) {
          wx.navigateTo({
            url: '../mine/userFace/userFace',
          })
          return;
        }
        wx.showLoading({
          title: '正在加载信息',
        })
        wx.cloud.callFunction({
            name: "sendPostRequest",
            data: {
              url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/kapi/v2/ozwe/ozwe_message_information/ozwe_msg_information/getSchoolInformation",
              body: {
                data: {
                  "status": "C"
                },
                "pageSize": 5,
                "pageNo": 1
              },
              headers: {
                "Content-Type": "application/json",
                "accesstoken": getApp().globalData.accessToken
              }
            }
          })
          .then(res => {
            var contentArray = res.result.data.rows
            var notifyList = []
            console.log(res)
            for (var item of contentArray) {
              var object = {
                content: item.name,
                number: item.number,
                date: item.modifytime,
                information: item.ozwe_msgcontent_tag.replace(/\<img/gi, '<img alt="" style="max-width:100%;height:auto"')
              }
              notifyList.unshift(object)
            }
            getApp().globalData.mainPageNotifyList = notifyList
            _.setData({
              notifyList: notifyList,
              loadFlag: true
            })
            wx.hideLoading()
          })
      }
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (getApp().globalData.registerFlag) {
      this.onReady()
      getApp().globalData.registerFlag = false
    }
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