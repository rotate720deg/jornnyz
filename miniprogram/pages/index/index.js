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
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.getCourse()
    } else {
      app.getOpenidCallback = this.getCourse
    }
  },
  getCourse(userInfo){
    this.setData({
      userInfo: userInfo
    })
    const course = app.db.collection('course')
    course.get().
    j_then(res => {
      this.setData({
        course: res.data
      })
      console.log(res)
    })
  }
})
