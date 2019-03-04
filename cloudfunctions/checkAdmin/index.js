// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const wxContext = cloud.getWXContext()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const { openid } = event
  return await db.collection('session')
    .where({
      openid: openid, // 填入当前用户 openid
      admin: true
    })
    .get()
}