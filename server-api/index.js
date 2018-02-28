const Koa = require('koa');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const dbconfig = require('./config/db')
const config = require('./config/common')
const route = require('./routes/route')

const app = new Koa()

// session存储配置
const sessionMysqlConfig = {
    host: dbconfig.HOST,
    user: dbconfig.USERNAME,
    password: dbconfig.PASSWORD,
    database: dbconfig.DATABASE
}

let cookie = {
    maxAge: 7200000, // cookie有效时长
    expires: new Date('2018-3-1'),  // cookie失效时间
    // path: '', // 写cookie所在的路径
    domain: 'localhost:3000', // 写cookie所在的域名
    httpOnly: true, // 是否只用于http请求中获取
    overwrite: true,  // 是否允许重写
    // secure: '',
    // sameSite: '',
    signed: true,
}
  

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig),
    cookie: cookie
}))

//添加日志 | 修改响应类型
app.use(async (ctx, next) => {
    ctx.response.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS"
    });
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
    ctx.response.type = 'json';
    await next();
}); 

//  路由
app.use(route.routes())

app.listen(config.port)

console.log(`listening on port ${config.port}`)
