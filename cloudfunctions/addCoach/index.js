// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const { openid } = event
  const { OPENID } = wxContext
  try {
    const userAdmin = await cloud.callFunction({
      name: 'checkAdmin',
      data: {
        openid: OPENID
      }
    })
    if (!userAdmin.result.data.length) {
      return {
        errCode: 401,
        errMsg: '您无权操作'
      }
    }
    const coach = await db.collection('coach')
      .where({
        openid: openid // 填入当前用户 openid
      })
      .get()
    if (coach.data.length) {
      return {
        errCode: 401,
        errMsg: '重复添加'
      }
    }
    const user = await db.collection('user')
      .where({
        openid: openid // 填入当前用户 openid
      })
      .get()
    return await db.collection('coach').add({
      data: {
        ...user.data[0],
        valid: true
      }
    })
  } catch (e) {
    console.error(e)
  }
}