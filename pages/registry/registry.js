// pages/registry/registry.js
let util = require('../../utils/util.js');
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisable: true,
    name: '',
    phone: '',
    pw: '',
    confirmpw: ''
  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
    this.onInput();
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    this.onInput();
  },

  pwInput: function (e) {
    this.setData({
      pw: e.detail.value
    })
    this.onInput();
  },

  pwConfirmInput: function (e) {
    this.setData({
      confirmpw: e.detail.value
    })
    this.onInput();
  },

  onInput: function() {
    let name = this.data.name,
      phone = this.data.phone,
      pw = this.data.pw,
      confirmpw = this.data.confirmpw;
    if (name.length && phone.length && pw.length && confirmpw.length) {
      this.setData({
        btnDisable: false
      })
    } else {
      this.setData({
        btnDisable: true
      })
    }
  },

  onRegistry: function() {
    if(this.data.pw !== this.data.confirmpw) {
      wx.showToast({
        title: '密码输入不一致',
        image: '../../assets/warning.png',
        duration: 2000
      })
    } else {
      let userregistryUrl = api.userregistryUrl;

      wx.request({
        url: userregistryUrl,
        
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})