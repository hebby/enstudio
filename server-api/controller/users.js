 const userModel = require('../models/users.js')
 const md5 = require('md5')
 var Hashes = require('jshashes')
 const loginCheck = require('../middlewares/login-check.js')
 const cusError = require('../config/errors-config')
const hexflag = "studioEn"

let getUid = (username) => {
    let MD5 = new Hashes.MD5
    let SHA256 =  new Hashes.SHA256
    let uid = SHA256.hex(MD5.hex(hexflag + new Date().getTime() + username))
    return uid
}

let getMd5Pwd = (password) => {
    return md5(hexflag + password)
}

let signIn = async(ctx, next) => {
    let name = ctx.request.body.name;
    let pass = ctx.request.body.password;

    if(!name || !pass){
        ctx.status = 200;
        ctx.response.body = cusError.getErrorInfo(1001);
        return;
    }

    //TODO: 检查输入，过滤危险字符，防止xss及sql注入
    await userModel.findUser(name)
    .then(result => {
        ctx.status = 200;
        if(!result || (Array.isArray(result) && result.length === 0)){
            ctx.response.body = cusError.getErrorInfo(1003);
            return;
        }
        let user = result[0]
        if (name === user['login_name'] && getMd5Pwd(pass) === user['user_pass']) {
            if(user['user_status'] === 0) {
                ctx.response.body = cusError.getErrorInfo(1005);
            } else {
                ctx.response.body = { 
                    data:{
                        uid: user['uid'],
                        name: user['login_name']
                    }
                };
            }
        }else{
            ctx.response.body = cusError.getErrorInfo(1003);
        }
    }).catch(err => {
        ctx.status = 500;
        ctx.response.body = cusError.getErrorInfo(1099);
    })
}

let signOut = async(ctx, next) => {
    //ctx.session = null;
    ctx.status = 200;
    ctx.response.body = {data: "登出成功"};
}

let getUsers = async(ctx, next) => {
    await userModel.findAllUsers()
    .then(result => {
        ctx.status = 200;
        console.log("user results:", result);
        ctx.response.body = { data: result };
    }).catch(err => {
        ctx.status = 500;
        ctx.response.body = { data: "获取用户信息失败!" };
        console.error("获取用户信息失败",err);
    })
}

let addUser = async(ctx, next) => {
    let reqParams = ctx.request.body.user;
    let user = JSON.parse(reqParams);
    if(!user || !user.name || !user.password){
        ctx.status = 200;
        ctx.response.body = cusError.getErrorInfo(1001);
        return;
    }

    user.uid = getUid(user.name)
    user.password = getMd5Pwd(user.password)
    await userModel.findUser(user.name)
    .then(async (result) => {
        if(result && result.length > 0){
            ctx.status = 200;
            ctx.response.body = cusError.getErrorInfo(1002);
            return;
        }
        await userModel.addUser(user)
        .then(() => {
            ctx.status = 200;
            ctx.response.body = {data: ''};
        }).catch(err => {
            ctx.status = 200;
            ctx.response.body = cusError.getErrorInfo(1099);
            return;
        })
    }).catch(err => {
        ctx.status = 500;
        ctx.response.body = cusError.getErrorInfo(1099);
    })
}

let setUserStatus = async(ctx, next) => {
    let reqParams = ctx.request.body.user;
    let user = JSON.parse(reqParams);
    if(!user || !user.id || !user.status){
        ctx.status = 200;
        ctx.response.body = cusError.getErrorInfo(1006);
        return;
    }
    await userModel.setUserStatus(user.id, user.status)
    .then(async (result) => {
        ctx.response.body = {data: '修改成功!'};
    }).catch(err => {
        ctx.status = 500;
        ctx.response.body = cusError.getErrorInfo(1099);
    })
}


module.exports = {
    signIn,
    signOut,
    getUsers,
    addUser,
    setUserStatus
}