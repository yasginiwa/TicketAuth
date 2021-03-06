// pages/registry/registry.js
let util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const crypto = requirePlugin('Crypto');

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

  onInput: function () {
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

  onRegistry: function () {

    if (this.data.password !== this.data.confirmpassword) {
      wx.showToast({
        title: '密码输入不一致',
        image: '../../assets/warning.png',
        duration: 2000
      })
    } else {
      let userregistryUrl = api.userregistryUrl,
        wxopenid = wx.getStorageSync('wxopenid'),
        username = this.data.username,
        password = (new crypto.MD5(new crypto.MD5(this.data.password).toString())).toString(),
        phone = this.data.phone,
        superuser = 0,
        granted = 0;
        
      wx.showLoading({
        title: '注册中...',
        icon: 'none',
      })

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
          wx.hideLoading();

          //  调回登录界面
          wx.navigateBack({
            delta: 1
          })

          //  延时提示
          setTimeout(() => {
            wx.showToast({
              title: '请联系管理员完成注册~',
              icon: 'none',
              duration: 3000
            })
          }, 1000)
        },
        fail: (err) => {
          wx.showToast({
            title: '网络错误~~',
            image: '../../assets/fail.png',
            duration:2000
          })
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