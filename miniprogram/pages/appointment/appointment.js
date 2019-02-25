// miniprogram/pages/appointment/appointment.js
Page({
  data: {
    current: 'tab1'
  },
  onLoad: function (options) {

  },
  handleChange(e) {
    this.setData({
      current: e.detail.key
    })
  }
})