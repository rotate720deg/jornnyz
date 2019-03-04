// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('coach')
    .where({
      valid: true
    })
    .field({
      nickName: false
    })
    .skip(0)
    .limit(10)
    .get()
}