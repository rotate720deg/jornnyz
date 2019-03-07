// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()
const db = cloud.database()
const _ = db.command
const fs = require('fs')
const path = require('path')
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  const wxContext = cloud.getWXContext()
  const { OPENID } = wxContext
  // 管理员必须验证权限
  const { $url } = event 
  console.log($url, $url.startsWith('admin/'))
  if ($url.startsWith('admin/')) {
    app.use(async (ctx, next) => {
      const userAdmin = await db.collection('session')
        .where({
          openid: OPENID,
          admin: true
        })
        .get()
        if (!userAdmin.data.length) {
          ctx.body = {
            code: 401,
            data: [],
            errMsg: '您无权操作'
          }
        } else {
          ctx.isAdmin = !!userAdmin.data.length
          await next(); // 执行下一中间件
        }
    })
  }

  app.router('admin/getCoachList', async (ctx) => {
    const {skip, limit=10} = ctx._req.event
    const res = await db.collection('coach')
      .where({
        valid: true
      })
      .skip(skip)
      .limit(limit)
      .get()
    ctx.body = {
      code: 0,
      data: res.data,
      message: res.errMsg
    }
  });

  app.router('admin/getUserList', async (ctx, next) => {
    const { skip, limit=10 } = ctx._req.event
    const res = await db.collection('user')
      .skip(skip)
      .limit(limit)
      .get()
    ctx.body = {
      code: 0,
      data: res.data,
      message: res.errMsg
    }
  });
  // 添加课程，修改课程
  app.router('admin/editCourse', async (ctx, next) => {
    const { courseId='', name, price=0, tags=[], tagsText='', cover } = ctx._req.event
    let resultTags = tagsText ? tags.concat(tagsText.split('，')) : tags
    console.log(courseId)
    if (!(tagsText instanceof Array) && tagsText.trim() !== '') { // 如果是字符串, 拆开后添加到
      try {
        db.collection('courseTags')
          .doc('course-tags')
          .update({
            data: {
              tags: _.push(tagsText.split('，'))
            }
          })
      } catch(err) {
        console.log(err)
      }
    }
    if (courseId) { // 修改
      const data = {
        name: name,
        price: price,
        tags: resultTags
      }
      coverId && (data.cover = coverId)
      const res = await db.collection('course')
        .doc(courseId)
        .update({
          data: data
        })
      ctx.body = {
        code: 0,
        data: res.data,
        message: res.errMsg
      }
    } else {
      const res = await db.collection('course')
        .add({
          data: {
            cover: coverId,
            name: name,
            price: price,
            tags: resultTags
          }
        })
        console.log(res)
      ctx.body = {
        code: 0,
        data: res.data,
        message: res.errMsg
      }
    }
  });

  return app.serve();
}