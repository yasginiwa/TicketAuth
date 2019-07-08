// pages/authdetail/authdetail.js
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tickets: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    });

    wx.request({
      url: api.authdetailUrl,
      method: 'POST',
      data: {
        sqlParams: ['wxopenid', 'expectdate'],
        sqlValues: [options.wxopenid, options.expectdate]
      },
      success: (res) => {
        wx.hideLoading();
        console.log(res);
        this.setData({
          tickets: res.data.result
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          image: '../../assets/fail.png'
        })
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
    this.setData({
      tickets: []
    })
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

  }
})