//app.js
const api = require('utils/api.js');

App({
  onLaunch: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //  获取openid
    var getticketauthwxopenidUrl = api.getticketauthwxopenidUrl;
    wx.login({
      success: function (res) {
        wx.request({
          url: getticketauthwxopenidUrl,
          method: 'POST',
          data: {
            js_code: res.code
          },
          success: function (result) {
            wx.hideLoading();
            wx.setStorageSync('wxopenid', result.data.result.wxopenid)
          }
        })
      }
    })
  }
})