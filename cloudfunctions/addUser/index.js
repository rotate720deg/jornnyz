// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const { openid } = event
  console.log(event)
  try {
    const user = await db.collection('user')
      .where({
        openid: openid // 填入当前用户 openid
      })
      .limit(1)
      .get()
    if (user.data.length) {
      console.log('用户已入库')
      return {
        msg: '用户已入库'
      }
    }
    return await db.collection('user').add({
      data: {
        openid: openid,
        course: [],
        orderTimes: 0,
        card: [],
        customAmount: 0
      }
    })
  } catch(e) {
    console.error(e)
  }
}