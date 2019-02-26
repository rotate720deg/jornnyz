//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
      this.db = wx.cloud.database()
      console.log(this.db)
      this.promiseAdd()
      this.getUserInfo()
    }
  },
  promiseAdd() {
    Promise.prototype.finally = function (callback) {
      let P = this.constructor;
      return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
      );
    };
    Promise.prototype.j_then = function (success = () => { }, error = () => { }) {
      return this.then((data) => {
        success(data)
      }).catch((err) => {
        console.log('err = ', err)
        error(err)
      })
    }
  },
  getUserInfo() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              this.getOpenid()
            }
          })
        } else { // 跳转到授权页
          wx.redirectTo({
            url: '/pages/my/my',
          })
        }
      }
    })
  },
  getOpenid() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    })
    .j_then(res => {
      console.log(res)
      this.globalData.openid = res.result.openid
    })
  },
  db: null,
  globalData:  {}
})
