// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
// 预约课程，user表添加数据，coach表添加数据，timetable表添加数据，course添加数据
const courseInc = (courseId) => {
  return db.collection('course')
    .doc(courseId)
    .update({
      data: {
        orderTimes: _inc(1)
      }
    })
}
const addCourseInUser = (coachId) => {
  return db.collection('coach')
    .doc(coachId)
    .update({
      data: {
        peopleAmount: _inc(1)
      }
    })
}
const 
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}