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
    if (refresh) { //是否刷新
      this.setData({
        currentIndex: 0
      })
    }
    const { currentIndex, currentSize } = this.data
    app.db.collection('coach')
      .where({
        valid: true
      })
      .skip(currentIndex)
      .limit(currentSize)
      .get()
      .j_then(res => {
        if (refresh) {
          this.setData({
            coachlist: res.data
          })
        } else {
          this.setData({
            coachlist: this.data.coachlist.concat(res.data)
          })
        }
      })
  },
  chooseuser() {
    wx.navigateTo({
      url: '/pages/admin/userList/userList?coach=true'
    })
  }
})