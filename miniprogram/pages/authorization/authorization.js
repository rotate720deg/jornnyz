//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      wx.cloud.callFunction({
        name: 'addUser',
        data: {
          info: e.detail.userInfo
        }
      }).j_then(res => {
        app.globalData.userInfo = res.result
        wx.setStorage({
          key: 'userinfo',
          data: res.result
        })
        app.hasLogin(res.result)
      })
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})
