Page({
    data: {
        type: 0,
        Title: "",
        Message: "",
        Author: "",
        Time: "",
        Collection: 0,
        isCollection: false,
        Like: 0,
        isLike: false,
        Look: 0,
        imgLength: 0,
        imgList: [],
        AuthorImg: "",
        isEdit: "",
        userId: "",
        //评论数据
        comment_list: [],

        //回复数据
        comment_list2: [],

        /*定义一些数据*/
        focus: false, //输入框是否聚焦
        placeholder: '说点什么...', //底部输入框占字符
        placeholder2: '说点什么，让ta也认识你', //顶部输入框占字符
        value: null, //顶部输入框内容
        comment_text: null, //底部评论框内容

        /*
         *以下初始化数据是用户点击任意一条评论或回复时需要设置的数据
         *然后将设置好的数据传递给评论时新创建的评论数据对象
         */
        now_reply_name: null, //当前点击的评论或回复评论的用户昵称
        now_reply_type: 0, //当前回复类型 默认为0 1为回复评论 2为回复回复
        now_parent_id: 0, //当前点击的评论或回复评论的所属评论id
        now_reply: 0, //当前点击的评论或回复评论的id

        //模拟用户信息
        userinfo: {
            nickName: "", //用户昵称
            avatarUrl: "" //用户头像
        }
    },
    blur(e) {
        const text = e.detail.value.trim();
        if (text == '') {
            this.setData({
                now_reply: 0, //当前点击的评论或回复评论的id        
                now_reply_name: null, //当前点击的评论或回复评论的用户昵称        
                now_reply_type: 0, //当前回复类型        
                now_parent_id: 0, //当前点击的评论或回复评论的所属评论id        
                placeholder: "说点什么", //占字符        
                focus: false //输入框获取焦点
            })
        }
    },

    //获取输入框内容
    getCommentText(e) {
        var val = e.detail.value;
        this.setData({
            comment_text: val
        })
    },

    //顶部评论框提交内容时触发  
    bindconfirm(e) {
        var comment_text = e.detail.value //判断用户是否输入内容为空    
        if (comment_text == '') { //用户评论输入内容为空时弹出      
            wx.showToast({
                title: '请输入内容', //提示内容        
                icon: 'none'
            })
        } else {
            var date = new Date(); //创建时间对象      
            var year = date.getFullYear(); //获取年      
            var month = date.getMonth() + 1; //获取月      
            var day = date.getDate(); //获取日      
            var hour = date.getHours(); //获取时      
            var minute = date.getMinutes(); //获取分      
            var second = date.getSeconds(); //获取秒      
            var time = `${year}年${month}月${day}日${hour}时${minute}分${second}秒`; //当前时间
            var comment_list = this.data.comment_list; //获取data中的评论列表      
            var comment_list2 = this.data.comment_list2; //获取data中的回复列表      
            var userinfo = this.data.userinfo; //获取当前的用户信息      
            var comment_user_name = userinfo.nickName //用户昵称      
            var comment_user_avatar = userinfo.avatarUrl //用户头像      // 
            var reply_id = this.data.reply_id //获取当前输入评论的id      
            var comment_list_length = comment_list.length; //获取当前评论数组的长度   
            var last_id; //获取最后一个评论的id      
            var comment_list2_length = comment_list2.length; //获取回复数组的长度     
            var last_id2; //获取最后回复的id      
            if (comment_list_length == 0) {
                last_id = 0
                comment_list2_length = 0;
                last_id2 = 0;
            } else {
                last_id = comment_list[comment_list_length - 1].comment_id; //获取最后一个评论的id      
                comment_list2_length = comment_list2.length; //获取回复数组的长度     
                last_id2 = comment_list2[comment_list2_length - 1].comment_id; //获取最后回复的id 
            }
            var new_id = last_id > last_id2 ? last_id + 1 : last_id2 + 1; //赋值当前评论的id
            var reply_name = null;
            var parent_id = 0;
            var reply_id = this.data.now_reply; //获取当前输入评论的id
            var comment_detail = {} //声明一个评论/回复对象      
            comment_detail.comment_id = new_id; //评论Id      
            comment_detail.comment_user_name = comment_user_name; //用户昵称      
            comment_detail.comment_user_avatar = comment_user_avatar; //用户头像      
            comment_detail.comment_text = comment_text; //评论内容      
            comment_detail.comment_time = time; //评论时间      
            comment_detail.reply_id = reply_id; //回复谁的评论的id      
            comment_detail.parent_id = parent_id; //评论所属哪个评论id     
            comment_detail.reply_name = reply_name; //回复评论人的昵称
            comment_detail.userId = getApp().globalData.userData._id
            comment_list.unshift(comment_detail);
            wx.cloud.callFunction({
                name: "updateData",
                data: {
                    databaseName: "CommunityDatabase",
                    id: getApp().globalData.mainId,
                    data: {
                        comment_list: comment_list
                    }
                },
            })
            this.setData({
                value: null, //评论内容        
                now_reply: 0, //当前点击的评论id        
                now_reply_name: null, //当前点击的评论的用户昵称        
                now_reply_type: 0, //评论类型        
                now_parent_id: 0, //当前点击的评论所属哪个评论id        
                placeholder2: "说点什么，让ta也认识看动态的你", //输入框占字符        
                comment_list //评论列表      
            })
        }
    },

    //点击用户评论或回复时触发
    replyComment(e) {
        var cid = e.currentTarget.dataset.cid; //当前点击的评论id
        var name = e.currentTarget.dataset.name; //当前点击的评论昵称
        var pid = e.currentTarget.dataset.pid; //当前点击的评论所属评论id
        var type = e.currentTarget.dataset.type; //当前回复类型
        this.setData({
            focus: true, //输入框获取焦点
            placeholder: '回复' + name + '：', //更改底部输入框占字符
            now_reply: cid, //当前点击的评论或回复评论id
            now_reply_name: name, //当前点击的评论或回复评论的用户名
            now_parent_id: pid, //当前点击的评论或回复评论所属id
            now_reply_type: type, //获取类型(1回复评论/2回复-回复评论)
        })
    },

    //底部输入框提交内容时触发
    confirm(e) {
        //获取输入框输入的内容
        var comment_text = e.detail.value;
        //判断用户是否输入内容为空
        if (comment_text == '') {
            //用户评论输入内容为空时弹出
            wx.showToast({
                title: '请输入内容', //提示内容
                icon: 'none' //提示图标
            })
        } else {
            var date = new Date(); //创建时间对象
            var year = date.getFullYear(); //获取年      
            var month = date.getMonth() + 1; //获取月      
            var day = date.getDate(); //获取日      
            var hour = date.getHours(); //获取时      
            var minute = date.getMinutes(); //获取分      
            var second = date.getSeconds(); //获取秒      
            var time = `${year}年${month}月${day}日${hour}时${minute}分${second}秒`; //当前时间
            var comment_list = this.data.comment_list; //获评论数据
            var comment_list2 = this.data.comment_list2; //获取回复数据
            var comment_list_length = comment_list.length; //获取当前评论数组的长度
            var last_id; //获取最后一个评论的id      
            var comment_list2_length = comment_list2.length; //获取回复数组的长度     
            var last_id2; //获取最后回复的id      
            if (comment_list_length == 0) {
                last_id = 0
                comment_list2_length = 0;
                last_id2 = 0;
            } else {
                last_id = comment_list[comment_list_length - 1].comment_id; //获取最后一个评论的id      
                comment_list2_length = comment_list2.length; //获取回复数组的长度     
                if (comment_list2_length == 0) {
                    last_id2 = 0
                } else {
                    last_id2 = comment_list2[comment_list2_length - 1].comment_id; //获取最后回复的id 
                }
            }
            var new_id = last_id > last_id2 ? last_id + 1 : last_id2 + 1; //当前将要发表的评论的id
            var userinfo = this.data.userinfo; //获取当前的用户信息      
            var comment_user_name = userinfo.nickName //用户昵称      
            var comment_user_avatar = userinfo.avatarUrl //用户头像
            var reply_name = null; //回复评论用户的昵称
            var parent_id = 0; //评论所属哪个评论的id
            var reply_id = this.data.now_reply; //回复谁的评论id
            //通过回复谁的评论id判断现在是评论还是回复
            if (reply_id != 0) {
                //现在是回复
                var reply_type = this.data.now_reply_type; //回复类型
                //通过回复类型判断是回复评论还是回复回复
                if (reply_type == 1) {
                    //回复评论
                    parent_id = this.data.now_reply; //回复评论所属评论id
                    reply_name = this.data.now_reply_name; //回复评论用户昵称
                } else {
                    //回复回复
                    parent_id = this.data.now_parent_id; //回复评论所属评论id
                    reply_name = this.data.now_reply_name; //回复评论用户昵称
                }
            } else {
                //现在是评论
            }
            var comment_detail = {} //评论/回复对象
            comment_detail.comment_id = new_id; //评论Id      
            comment_detail.comment_user_name = comment_user_name; //用户昵称      
            comment_detail.comment_user_avatar = comment_user_avatar; //用户头像      
            comment_detail.comment_text = comment_text; //评论内容      
            comment_detail.comment_time = time; //评论时间      
            comment_detail.reply_id = reply_id; //回复谁的评论的id      
            comment_detail.parent_id = parent_id; //评论所属哪个评论id      
            comment_detail.reply_name = reply_name; //回复评论人的昵称
            comment_detail.userId = getApp().globalData.userData._id
            //判断parent_id是否为0 为0就是评论 不为0就是回复
            if (comment_detail.parent_id > 0) {
                //回复
                comment_list2.unshift(comment_detail);
            } else {
                //评论
                comment_list.unshift(comment_detail);
            }
            wx.cloud.callFunction({
                name: "updateData",
                data: {
                    databaseName: "CommunityDatabase",
                    id: getApp().globalData.mainId,
                    data: {
                        comment_list: comment_list,
                        comment_list2: comment_list2
                    }
                },
            })
            //动态渲染
            this.setData({
                //发表评论后将以下数据初始化 为下次发表评论做准备
                comment_text: null, //评论内容        
                now_reply: 0, //当前点击的评论id        
                now_reply_name: null, //当前点击的评论的用户昵称        
                now_reply_type: 0, //评论类型        
                now_parent_id: 0, //当前点击的评论所属哪个评论id        
                placeholder: "说点什么...", //输入框占字符
                //将加入新数据的数组渲染到页面        
                comment_list, //评论列表        
                comment_list2 //回复列表
            })
        }
    },

    clickAvatar(e) {
        getApp().globalData.chooseId = e.currentTarget.dataset.userid
        wx.navigateTo({
          url: '../../mine/users/users',
        })
    },

    onLoad: function (options) {
        var _ = this
        _.setData({

            userinfo: {
                nickName: getApp().globalData.userData.nickName, //用户昵称
                avatarUrl: getApp().globalData.userData.avatarUrl
            }
        })
        const db = wx.cloud.database()
        db.collection("CommunityDatabase")
            .where({
                "_id": getApp().globalData.mainId
            })
            .get()
            .then(res => {
                wx.cloud.callFunction({
                        name: "updateData",
                        data: {
                            databaseName: "CommunityDatabase",
                            id: getApp().globalData.mainId,
                            data: {
                                Look: res.data[0].Look + 1
                            }
                        }
                    })
                    .then(res2 => {
                        var imgs = res.data[0].imgList
                        var length = imgs.length
                        _.setData({
                            imgLength: length
                        })
                        if (length == 3 || length >= 5) {
                            _.setData({
                                type: 3
                            })
                        } else if (length == 1) {
                            _.setData({
                                type: 1
                            })
                        } else {
                            _.setData({
                                type: 2
                            })
                        }
                        const db = wx.cloud.database()
                        db.collection("CommunityUser")
                            .where({
                                open_id: res.data[0].Author
                            })
                            .get()
                            .then(res2 => {
                                _.setData({
                                    Title: res.data[0].Title,
                                    Author: res2.data[0].nickName,
                                    Message: res.data[0].Message,
                                    Time: res.data[0].Time,
                                    imgList: res.data[0].imgList,
                                    Collection: res.data[0].Collection,
                                    Like: res.data[0].Like,
                                    Look: res.data[0].Look + 1,
                                    comment_list: res.data[0].comment_list,
                                    comment_list2: res.data[0].comment_list2,
                                    AuthorImg: res2.data[0].avatarUrl,
                                    userId: res.data[0].userId
                                })
                                if (getApp().globalData.userData.nickName == _.data.Author) {
                                    _.setData({
                                        isEdit: true
                                    })
                                }
                                getApp().globalData.mainContent = res.data[0]

                                // var userCollection = getApp().globalData.userData.collectionContent
                                // if (userCollection.indexOf(getApp().globalData.mainId) != -1) {
                                //     _.setData({
                                //         isCollection: true
                                //     })
                                // }
                            })

                    })
            })
    },

    EditContent() {
        getApp().globalData.isPublish = false;
        wx.navigateTo({
            url: '../publish/publish',
        })
    },
    DeleteContent() {
        var _ = this
        wx.showModal({
            title: '删帖确认',
            content: "您确定要删除这篇帖子吗",
            success: res => {
                if (res.confirm) {
                    wx.showLoading({
                        title: '删帖中',
                    })
                    var myContent = getApp().globalData.userData.myContent.split(",")
                    var index = myContent.indexOf(getApp().globalData.mainId)
                    myContent.splice(index,1)
                    getApp().globalData.userData.myContent = myContent.toString()
                    wx.cloud.callFunction({
                        name: "updateData",
                        data: {
                            databaseName: "CommunityUser",
                            id: getApp().globalData.userDataId,
                            data: {
                                myContent: getApp().globalData.userData.myContent
                            }
                        }
                    })
                    wx.cloud.callFunction({
                        name: "deleteData",
                        data: {
                            databaseName: "CommunityDatabase",
                            id: getApp().globalData.mainId
                        }
                    }).then(res => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '删除成功',
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
                                                url: '../community',
                                            })
                                            return;
                                        }
                                    }
                                }, 1000)
                            }
                        })
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.postData.title,
            desc: this.postData.content,
            path: "/pages/post/post-detail/post-detail"
        }
    },

    clickImg(e) {
        var _ = this
        var imgIndex = e.currentTarget.dataset.clickimg
        wx.previewImage({
            current: _.data.imgList[imgIndex], //当前图片地址
            urls: _.data.imgList, //所有要预览的图片的地址集合 数组形式
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        })
    },
})