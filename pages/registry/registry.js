// pages/registry/registry.js
let util = require('../../utils/util.js');
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisable: true,
    userusername: '',
    phone: '',
    password: '',
    confirmpassword: ''
  },

  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
    this.onInput();
  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    this.onInput();
  },

  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
    this.onInput();
  },

  passwordConfirmInput: function (e) {
    this.setData({
      confirmpassword: e.detail.value
    })
    this.onInput();
  },

  onInput: function() {
    let username = this.data.username,
      phone = this.data.phone,
      password = this.data.password,
      confirmpassword = this.data.confirmpassword;
    if (username.length && phone.length && password.length && confirmpassword.length) {
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
    if(this.data.password !== this.data.confirmpassword) {
      wx.showToast({
        title: '密码输入不一致',
        image: '../../assets/warning.png',
        duration: 2000
      })
    } else {
      let userregistryUrl = api.userregistryUrl,
      wxopenid = wx.getStorageSync('wxopenid'),
      username = this.data.username,
      password = this.data.password,
      phone = this.data.phone,
      superuser = 0,
      granted = 0;
      console.log(wxopenid, username, password, phone, superuser, granted);
      wx.request({
        url: userregistryUrl,
        method: 'POST',
        data: {
          wxopenid: wxopenid,
          username: username,
          password: password,
          phone: phone,
          superuser: superuser,
          granted: granted
        },
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {

        }
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