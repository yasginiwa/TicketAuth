// pages/userauth/userauth.js
let util = require('../../utils/util.js');
const api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    userRoles: [{
        name: '0',
        value: '审核用户',
        checked: true
      },
      {
        name: '1',
        value: '超级用户'
      }
    ],
    delBtnWidth: 180
  },


  /**
   * 通过点击是绑定的idx返回当前选择的client模型
   */
  selectedModel: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var user = {};
    var obj = {};
    //遍历client对象数组
    for (var i in this.data.users) {
      obj = this.data.users[i]
      if (obj.u_id === idx) {
        user = obj;
        break;
      }
    }
    return user;
  },

  onRadioChange: function(e) {
    let user = this.selectedModel(e);
    user.superuser = e.detail.value;
    this.setData({
      users: this.data.users
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userauthUrl = api.userauthUrl;
    wx.request({
      url: userauthUrl,
      method: 'POST',
      success: (res) => {
        this.setData({
          users: res.data.result
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误~~',
          image: '../../assets/fail.png',
          duration: 2000
        })
      }
    })
  },

  /**
   * 点击授权事件
   */
  onAuthorize: function(e) {
    wx.showLoading({
      title: '授权中...',
    })
    let user = this.selectedModel(e),
      userupdateUrl = api.userupdateUrl,
      sqlParams = ['superuser', 'granted'],
      sqlValues = [user.superuser, 1],
      rangeParam = 'u_id',
      rangeValue = user.u_id;
      wx.request({
        url: userupdateUrl,
        method: 'POST',
        data: {
          sqlParams: sqlParams,
          sqlValues: sqlValues,
          rangeParam: rangeParam,
          rangeValue: rangeValue
        },
        success: (res) => {
          wx.hideLoading();
          this.onLoad();
        },
        fail: (err) => {
          wx.showToast({
            title: '网络错误~~',
            image: '../../assets/fail.png',
            duration: 2000
          })
        }
      })
  },


  /**
   * 触摸开始
   */
  touchS: function(e) {
    var user = this.selectedModel(e);
    //  如果是已审核过的用户 不能被删除
    if (user.granted == 1) return;

    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  /**
   * 触摸移动
   */
  touchM: function(e) {
    var user = this.selectedModel(e);
    //  如果是已审核过的用户 不能被删除
    if (user.granted == 1) return;

    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }

      var user = this.selectedModel(e);
      user.slideStyle = txtStyle;
      this.setData({
        users: this.data.users
      })
    }
  },

  /**
   * 触摸结束
   */
  touchE: function(e) {
    var user = this.selectedModel(e);
    //  如果是已审核过的用户 不能被删除
    if (user.granted == 1) return;

    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = (disX > delBtnWidth / 2) ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";

      if (txtStyle != "left:0rpx") {
        this.slideItem(e, txtStyle);
      }

      var user = this.selectedModel(e);
      user.slideStyle = txtStyle;
      this.setData({
        users: this.data.users
      })
    }
  },

  /**
   * 滑动一个item
   */
  slideItem: function(e, style) {
    var user = this.selectedModel(e);
    user.slideStyle = style;
    this.setData({
      users: this.data.users
    })
  },

  /**
   * 删除一个item
   */
  delItem: function(e) {
    wx.showLoading({
      title: '删除中...',
      icon: 'none'
    })

    // 遍历对象数组 所有的滑动归0
    var user = this.selectedModel(e);
    for (var i in this.data.users) {
      user = this.data.users[i];
      user.slideStyle = 'left:0rpx';
    }
    this.setData({
      users: this.data.users
    })

    // 发送请求 删除数据
    var userdelUrl = api.userdelUrl;
    wx.request({
      url: userdelUrl,
      method: 'POST',
      data: {
        sqlParam: 'u_id',
        sqlValue: user.u_id
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '删除成功！',
          image: '../../assets/success.png',
          mask: true,
          duration: 2000
        })
        this.onLoad();
      },
      fail: (err) => {
        wx.showToast({
          title: '删除失败！',
          image: '../../assets/fail.png',
          mask: true,
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})