// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext() // 要写在函数体内
  const { info } = event
  const { OPENID } = wxContext
  try {
    const user = await db.collection('user')
      .where({
        openid: OPENID // 填入当前用户 openid
      })
      .field({
        avatarUrl: true,
        gender: true,
        nickName: true,
        openid: true
      })
      .get()
    if (user.data.length) {
      const userAdmin = await cloud.callFunction({
        name: 'checkAdmin',
        data: {
          openid: OPENID
        }
      })
      user.data[0].admin = !!userAdmin.result.data.length
      return user.data[0]
    }
    console.log(OPENID)
    await db.collection('user').add({
      data: {
        ...info,
        openid: OPENID
      }
    })
    return {
      ...info,
      openid: OPENID
    }
  } catch (e) {
    console.error(e)
  }
}