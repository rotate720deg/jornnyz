// miniprogram/pages/appointment/appointment.js
import { dateFormat } from '../../utils/tool'
const app = getApp()
console.log(app)
const db = app.db
console.log(db)
const _ = db.command

Page({
  data: {
    current: 'tab1'
  },
  onLoad: function (options) {
    this.getCourse()
  },
  getCourse() {
    let date = dateFormat(new Date())
    date = new Date(date).getTime()
    console.log(date)
    db.collection('timeTable')
      .where({
        date: _.gte(date)
      })
      .limit(7)
      .get()
      .j_then(res => {
        console.log(res)
      })
  },
  handleChange(e) {
    this.setData({
      current: e.detail.key
    })
  }
})