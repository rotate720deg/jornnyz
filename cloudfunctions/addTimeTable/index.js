// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  try {
    // 根据传入的参数来判断是修改还是添加
    // const { date, course } = event
    const course = await db.collection('course').doc('1').get()
    
    await db.collection('timeTable').add({
      data: {
        date: db.serverDate(),
        course: [course]
      }
    })
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  } catch(e) {
    console.log(e)
  }
}