// miniprogram/pages/my/my.js
const app = getApp()
Page({
  data: {
    userInfo: null
  },
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.setData({
      'userInfo.genderText': this.genderText(this.data.userInfo.gender)
    })
  },
  genderText(id) {
    switch(id) {
      case 1:
        return '男'
      case 2:
        return '女'
      default:
        return '未知'
    }
  },
  intoAdmin() {
    // 点击头像进入控制台，或进入教练界面
    wx.navigateTo({
      url: '/pages/admin/index/index',
    })
  }
})