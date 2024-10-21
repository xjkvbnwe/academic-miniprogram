import {
  getCurrWeekList,
  formateDate
} from '../../utils/tools'
Page({
  data: {
    currentWeek: 10,
    colorList: [
      "#FF9900",
      "#CC6699",
      "#9966FF",
      "#993399",
      "#FF3366",
      "#009900",
      "#0066FF",
      "#666699",
      "#663366",
      "#CC00FF"
    ],
    time: {
      one: [{
          index: 1,
          timeStart: '08:00',
          timeEnd: '08:45'
        },
        {
          index: 2,
          timeStart: '08:55',
          timeEnd: '09:40'
        },
        {
          index: 3,
          timeStart: '09:50',
          timeEnd: '10:45'
        },
        {
          index: 4,
          timeStart: '10:55',
          timeEnd: '11:40'
        }
      ],
      two: [{
          index: 5,
          timeStart: '14:00',
          timeEnd: '14:45'
        },
        {
          index: 6,
          timeStart: '14:55',
          timeEnd: '15:40'
        },
      ],
      three: [{
          index: 7,
          timeStart: '16:00',
          timeEnd: '16:45'
        },
        {
          index: 8,
          timeStart: '16:55',
          timeEnd: '17:40'
        },
      ]
    },
    schedule: {
      one: [{
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        }, {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
      ],
      two: [{
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        }, {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
      ],
      three: [{
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
      ],
      four: [{
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        }, {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        }, {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
        {
          sub: '',
          add: '',
          tec: "",
          color: '',
          type: 0,
        },
      ]
    },
    weekList: [],
    isShow: false,
    current: {},
  },
  getDetail(e) {
    let {
      item
    } = e.currentTarget.dataset;
    console.log(item)
    this.setData({
      current: item,
      isShow: true
    })
  },
  close() {
    this.setData({
      isShow: false
    })
  },
  onShow() {
    var _ = this
    let time = new Date(),
      list = getCurrWeekList(time),
      weekList = []
    list.forEach(item => {
      weekList.push({
        day: [item.split('-')[1], item.split('-')[2]].join('-'),
        week: "星期" + "日一二三四五六".charAt((new Date(item)).getDay()),
        isCurr: formateDate(time) == item
      })
    });
    this.setData({
      weekList,
    })

    wx.cloud.callFunction({
        name: "sendPostRequest",
        data: {
          url: "http://cloudide-a3a14e8e827-e41be04dc9-605079.cloudide.kingdee.com/ierp/kapi/v2/ozwe/ozwe_workmanage/ozwe_courseform/getUserTimetable",
          body: {
            data: {
              "creator_phone": getApp().globalData.phone
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
        var courseObjectList = res.result.data.rows[0]
        var keys = Object.keys(courseObjectList)
        for (var key of keys) {
          if (key.indexOf("ozwe") != -1) {
            if (key.indexOf("year") == -1 && key.indexOf("term") == -1) {
              var numberList = key.split("_")[1].split("a")
              var day = numberList[0]
              var schadule = _.data.schedule
              var index = parseInt(numberList[2]) / 2
              var courseObject = courseObjectList[key].split(";")[0]
              var courseInformation = courseObject.split("/")
              if (courseInformation[0].length <=0) {
                continue
              }
              var random = parseInt(Math.random()*10)
              var object = {
                sub: courseInformation[0].split("※")[1],
                add: courseInformation[2],
                tec: courseInformation[3],
                color: _.data.colorList[random],
                type: 1,
              }
              if (index == 1) {
                var indexDay = parseInt(day)
                schadule.one[indexDay-1] = object
              } else if (index == 2) {
                var indexDay = parseInt(day)
                schadule.two[indexDay-1] = object
              } else if (index == 3) {
                var indexDay = parseInt(day)
                schadule.three[indexDay-1] = object
              } else if (index == 4) {
                var indexDay = parseInt(day)
                schadule.four[indexDay-1] = object
              }
            }
          }
        }
        _.setData({
          schedule: schadule
        })
      })
  },
})