const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-minimal')

// 应用解析请求体的中间件, koa-bodyparser 支持 json, form, text 类型的请求体
app.use(bodyParser())
// 应用处理 session 的中间件
app.use(session({
    key: 'session-id',          // cookie 中存储 session-id 时的键名, 默认为 koa:sess
    cookie: {                   // 与 cookie 相关的配置
        domain: 'localhost',    // 写 cookie 所在的域名
        path: '/',              // 写 cookie 所在的路径
        maxAge: 10000 * 30,      // cookie 有效时长
        httpOnly: true,         // 是否只用于 http 请求中获取
        overwrite: false        // 是否允许重写
    }
}))

const Router = require('koa-router')()

// 模拟数据库, 存储用户信息
const users = new Map([['laowang', {username: 'laowang', password: '123456'}]])

// 默认提示信息
const tips = `
    GET     / 查看登录信息
    POST    / {username: laowang; password: 123456} 发此请求以登录
    DELETE  / 注销
`

// 查看登录信息
Router.get('/', ctx => {
    // 查看 session 中是否有用户登录信息
    if (ctx.session.user) {
        ctx.body = {
            status: '您已登录',
            session: ctx.session.user
        }    
    } else {
        ctx.body = tips
    }
})

// 登录
Router.post('/', ctx => {
    // 从请求体中获取用户名和密码
    const { username, password } = ctx.request.body
    console.log('username, pasword', username, password);
    // 检查用户是否已经登录
    if (ctx.session.user) {
        ctx.body = `${ctx.session.user.username} 已登录，请勿重复登录`
    }
    // 从'数据库'中查找是否有此用户,有则继续判断密码是否正确
    else if (users.has(username)) {
        // 模拟从数据库查找用户的操作
        const user = users.get(username)
        // 判断用户名和密码是否正确
        if (username === user.username && password === user.password) {
            // 验证通过则将用户信息写入 session 中
            ctx.session.user = {
                username,
                password
            }
            ctx.body = '登陆成功，请访问 GET / 查看session中的信息'
        } else {
            ctx.body = '用户名或密码不正确'
        }
    } else {
        ctx.body = '用户不存在'
    }
})

// 注销
Router.del('/', ctx => {
    ctx.session = null
    ctx.body = '您已注销'
})

// 处理未匹配到的路由
Router.get('/*', ctx => {
    ctx.body = tips
})

app.use(Router.routes())


app.listen(4000)