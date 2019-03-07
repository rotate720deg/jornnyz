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
    app.db.collection('user')
      .skip(currentIndex)
      .limit(currentSize)
      .get()
      .j_then(res => {
        let {data} = res
        let result = []
        const pro = data.map(item => {
          return app.db.collection('coach')
            .where({
              openid: item.openid,
              valid: true
            })
            .get()
            .j_then(res => {
              console.log(res)
              if (!res.data.length) {
                result.push(item)
              }
            })
        })
        Promise.all(pro).j_then(res => {
          console.log(result)
          if (refresh) {
            this.setData({
              userlist: result
            })
          } else {
            this.setData({
              userlist: this.data.userlist.concat(result)
            })
          }
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