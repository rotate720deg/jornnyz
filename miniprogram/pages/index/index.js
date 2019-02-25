//index.js
const app = getApp()

Page({
  data: {
    imgUrls: [
      '../../images/banner1.jpg',
      '../../images/banner2.jpg'
    ],
    userInfo: {},
    course: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    if (app.globalData.openid) {
      this.getCourse()
    } else {
      app.getTokenCallback = this.getCourse
    }
  },
  getCourse(){
    wx.cloud.init({
      traceUser: true,
    })
    const db = wx.cloud.database()
    const course = db.collection('course')
    course.get().
    j_then(res => {
      this.setData({
        course: res.data
      })
      console.log(res)
    })
  }
})
