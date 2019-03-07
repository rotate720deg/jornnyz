// miniprogram/pages/addcoach/addcoach.js
const app = getApp()
Page({
  data: {
    userlist: [],
    currentIndex: 0,
    currentSize: 10
  },
  onLoad: function (options) {
    this.getUserList(true)
  },
  getUserList(refresh) {
    if (refresh) { //是否刷新
      this.setData({
        currentIndex: 0
      })
    }
    const { currentIndex, currentSize } = this.data
    wx.cloud.callFunction({
      name: 'router',
      data: {
        $url: 'admin/getUserList',
        skip: currentIndex,
        limit: currentSize
      }
    }).j_then(res => {
      console.log(res)
      this.setData({
        userlist: res.result.data
      })
    })
  },
  choose(e) {
    console.log(e)
    wx.cloud.callFunction({
      name: 'addCoach',
      data: {
        openid: e.currentTarget.dataset.openid
      }
    }).j_then(res => {
      console.log(res)
    })
  }
})