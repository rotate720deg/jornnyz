// miniprogram/pages/addcoach/addcoach.js
const app = getApp()
Page({
  data: {
    coachlist: [],
    currentIndex: 0,
    currentSize: 10
  },
  onLoad: function (options) {
    this.getCachList(true)
  },
  getCachList(refresh) {
    wx.cloud.callFunction({
      name: 'getCoachList'
    }).j_then(res => {
      console.log(res)
      this.setData({
        coachlist: res.result.data
      })
    })
    // if (refresh) { //是否刷新
    //   this.setData({
    //     currentIndex: 0
    //   })
    // }
    // const { currentIndex, currentSize } = this.data
    // app.db.collection('coach')
    //   .where({
    //     valid: true
    //   })
    //   .skip(currentIndex)
    //   .limit(currentSize)
    //   .get()
    //   .j_then(res => {
    //     if (refresh) {
    //       this.setData({
    //         coachlist: res.data
    //       })
    //     } else {
    //       this.setData({
    //         coachlist: this.coachlist.concat(res.data)
    //       })
    //     }
    //   })
  },
  chooseuser() {
    wx.navigateTo({
      url: '/pages/user/user'
    })
  }
})