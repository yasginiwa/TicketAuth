// pages/auth/auth.js
var api = require('../../utils/api.js');
let dateUtil = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    expecttickets: [],
    delBtnWidth: 180,
    authstatus: null,
    productnameStr: '',
    priceStr: 0,
    netbakeidStr: 0,
    limitstartdate: '',
    limitenddate: '',
    desc1: '',
    desc2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    })

    //  请求客户注册信息和申请券信息
    let queryregistryUrl = api.queryregistryUrl;
    wx.request({
      url: queryregistryUrl,
      method: 'POST',
      success: (res) => {
        console.log(res);
        var expectticket = {};
        var expecttickets = [];
        for (var i in res.data.result.recordsets[0]) {
          expectticket = res.data.result.recordsets[0][i];
          expectticket.price = dateUtil.formatMoney(expectticket.price);
          expectticket.expectdate = dateUtil.formatLocal(expectticket.expectdate);
          expectticket.authstatus = (expectticket.authstatus == 0) ? 0 : expectticket.authstatus;
          expectticket.limitstartdate = dateUtil.formatLocalDate(expectticket.limitstartdate);
          expectticket.limitenddate = dateUtil.formatLocalDate(expectticket.limitenddate);
          expectticket.desc1 = expectticket.desc1;
          expectticket.desc2 = expectticket.desc2;
          expecttickets.push(expectticket);
        }

        this.setData({
          expecttickets: res.data.result.recordsets[0].reverse()
        })
        wx.hideLoading();
      },
      fail: (res) => {
        wx.showToast({
          title: '网络错误',
          image: '../../assets/fail.png',
          duration: 2000
        })
      }
    })

  },

  /**
   * 通过点击是绑定的idx返回当前选择的client模型
   */
  selectedModel: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var expectticket = {};
    var obj = {};
    //遍历client对象数组
    for (var i in this.data.expecttickets) {
      obj = this.data.expecttickets[i]
      if (obj.e_id === idx) {
        expectticket = obj;
        break;
      }
    }
    return expectticket;
  },

  /**
   * 产品名称输入
   */
  productnameInput: function (e) {
    this.setData({
      productnameStr: e.detail.value
    })
  },

  /**
   * 价格输入
   */
  priceInput: function (e) {
    this.setData({
      priceStr: e.detail.value
    })
  },

  /**
   * 一网烘焙标识符输入
   */
  netbakeidInput: function (e) {
    this.setData({
      netbakeidStr: e.detail.value
    })
  },

  /**
   * 申领券起始时间
   */
  startdateInput: function(e) {
    let startTime= e.detail.value;
    this.setData({
      limitstartdate: startTime
    })
  },

  /**
   * 申领券结束时间
   */
  enddateInput: function(e) {
    let endTime = e.detail.value
    this.setData({
      limitenddate: endTime
    })
  },

  /**
   * 描述1输入
   */
  desc1Input: function(e) {
    console.log(e.detail.value);
    this.setData({
      desc1: e.detail.value
    })
  },

  /**
   * 描述2输入
   */
  desc2Input: function(e) {
    this.setData({
      desc2: e.detail.value
    })
  },

  onAuthorized: function (e) {
    wx.showLoading({
      title: '审核中...',
    })

    if (!this.data.productnameStr || !this.data.priceStr || !this.data.netbakeidStr) {
      wx.showToast({
        title: '未填写完整...',
        image: '../../assets/warning.png',
        mask: true,
        duration: 2000
      })
      return;
    }

    //  审核注册信息
    var updateregistryUrl = api.updateregistryUrl,
      that = this,
      sqlParam = 'authstatus',
      sqlValue = 1, //  等于0 注册未审核  等于1 注册已审核
      rangeParam = 'wxopenid',
      rangeValue = wx.getStorageSync('wxopenid');
    wx.request({
      url: updateregistryUrl,
      method: 'POST',
      data: {
        sqlParam: sqlParam,
        sqlValue: sqlValue,
        rangeParam: rangeParam,
        rangeValue: rangeValue
      },
      success: function (res) {
        if (res.data.code == 1) {

        } else {
          wx.showToast({
            title: '注册信息审核失败！',
            image: '../../assets/fail.png',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '网络错误！',
          image: '../../assets/fail.png',
          duration: 2000
        })
      }
    })


    //  审核申领的券
    var expectticket = this.selectedModel(e),
      authupdateUrl = api.authupdateUrl;
      console.log(that.data.desc1);
      console.log(that.data.desc2);
    wx.request({
      url: authupdateUrl,
      method: 'POST',
      data: {
        sqlParams: ['productname', 'price', 'authstatus', 'netbakeid', 'limitstartdate', 'limitenddate', 'desc1', 'desc2'],
        sqlValues: [that.data.productnameStr, that.data.priceStr, 1, that.data.netbakeidStr, `${that.data.limitstartdate} 00:00:00`, `${that.data.limitenddate} 23:59:59`, that.data.desc1, that.data.desc2],
        rangeParam: 'e_id',
        rangeValue: expectticket.e_id
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '审核成功！',
            image: '../../assets/success.png',
            mask: true,
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '审核失败！',
          image: '../../assets/fail.png',
          mask: true,
          duration: 2000
        })
      },
      complete() {
        that.onLoad();
      }
    })
  },


  /**
   * 触摸开始
   */
  touchS: function (e) {
    var expectticket = this.selectedModel(e);
    //  如果是已审核过的客户 不能被删除
    if (expectticket.authstatus == 1) return;

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
  touchM: function (e) {
    var expectticket = this.selectedModel(e);
    //  如果是已审核过的客户 不能被删除
    if (expectticket.authstatus == 1) return;

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

      var expectticket = this.selectedModel(e);
      expectticket.slideStyle = txtStyle;
      this.setData({
        expecttickets: this.data.expecttickets
      })
    }
  },

  /**
   * 触摸结束
   */
  touchE: function (e) {
    var expectticket = this.selectedModel(e);
    //  如果是已审核过的客户 不能被删除
    if (expectticket.authstatus == 1) return;

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

      var expectticket = this.selectedModel(e);
      expectticket.slideStyle = txtStyle;
      this.setData({
        expecttickets: this.data.expecttickets
      })
    }
  },

  /**
   * 滑动一个item
   */
  slideItem: function (e, style) {
    var expectticket = this.selectedModel(e);
    expectticket.slideStyle = style;
    this.setData({
      expecttickets: this.data.expecttickets
    })
  },

  /**
   * 删除一个item
   */
  delItem: function (e) {
    // 遍历对象数组 所有的滑动归0
    var expectticket = this.selectedModel(e);
    for (var i in this.data.expecttickets.reverse()) {
      expectticket = this.data.expecttickets[i];
      expectticket.slideStyle = 'left:0rpx';
    }
    this.setData({
      expecttickets: this.data.expecttickets
    })

    // 发送请求 删除数据
    var authdelUrl = api.authdelUrl;
    var that = this;
    wx.request({
      url: authdelUrl,
      method: 'POST',
      data: {
        e_id: 'e_id',
        sqlValue: expectticket.e_id
      },
      success: function (res) {
        that.onLoad();
        wx.showToast({
          title: '删除成功！',
          image: '../../assets/success.png',
          mask: true,
          duration: 2000
        })
      },
      fail: function () {
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
   * 点击进入审核详情
   */
  onClickToDetail: function (e) {
    var expectticket = this.selectedModel(e);
    wx.navigateTo({
      url: `../authdetail/authdetail?wxopenid=${expectticket.wxopenid}&expectdate=${expectticket.expectdate}`
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
    this.onLoad();
    wx.stopPullDownRefresh();
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

  }
})