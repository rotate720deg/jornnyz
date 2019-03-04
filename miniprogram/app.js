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
      this.promiseAdd()
      this.getUserInfo()
    }
  },
  showToast(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    })
  },
  showLoading(text) {
    wx.showLoading({
      title: text || '加载中',
      icon: 'none'
    })
  },
  hideLoading() {
    wx.hideLoading()
  },
  promiseAdd() {
    const that = this
    Promise.prototype.finally = function (callback) {
      let P = this.constructor;
      return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
      );
    };
    Promise.prototype.j_then = function (success = () => { }, error = () => { }) {
      return this.then((data) => {
        if (data.result && data.result.errCode) {
          that.showToast(data.result.errMsg)
        } else {
          success(data)
        }
      }).catch((err) => {
        if(err.msg) {
          this.showToast(err.msg)
        }
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
              this.hasLogin(res.userInfo)
            }
          })
        } else { // 跳转到授权页
          wx.redirectTo({
            url: '/pages/authorization/authorization',
          })
        }
      }
    })
  },
  hasLogin(info) {
    // 调用云函数
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.globalData.userInfo = res.data
        if (this.getOpenidCallback) {
          this.getOpenidCallback(res.data)
        }
      },
      fail: (err) => {
        this.hasLoginFn(info)
      }
    })
  },
  hasLoginFn(info) {
    wx.cloud.callFunction({
      name: 'addUser',
      data: {
        info
      }
    })
    .j_then(res => {
      this.globalData.userInfo = res.result
      wx.setStorage({
        key: 'userinfo',
        data: res.result
      })
      if (this.getOpenidCallback) {
        this.getOpenidCallback(res.result)
      }
    })
  },
  db: null,
  globalData: {}
})
