// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  const wxContext = cloud.getWXContext()

  app.router('user/register', async (ctx, next) => {
    await next();
  }, async (ctx, next) => {
    await next();
  }, async (ctx) => {
    ctx.body = {
      code: 0,
      message: 'register success'
    }
  });

  app.router('user/login', async (ctx, next) => {
    await next();
  }, async (ctx, next) => {
    await next();
  }, async (ctx) => {
    ctx.body = {
      code: 0,
      message: 'login success'
    }
  });
}