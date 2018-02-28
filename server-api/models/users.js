var dbconnect = require('../db/mysql.js')

// 注册用户
let addUser = (user) => {
    let _sql = `insert into users set login_name="${user.name}", uid="${user.uid}", user_pass="${user.password}", 
                email="${user.email}", user_role="${user.role === true ? 0 : 1}"`;
    console.log("sql", _sql)
    return dbconnect.query(_sql)
}
// 禁用/启用用户(0: 为禁用， 1：启用)
let setUserStatus = (userId, status) => {
    let _sql = `update users set user_status = ${status} where user_id = ${userId};`
    return dbconnect.query(_sql)
}
// 查找用户
let findUser = (name) => {
    let _sql = `select * from users where login_name="${name}";`
    return dbconnect.query(_sql)
}
// 查找所有用户
let findAllUsers = () => {
    let _sql = `select user_id as userId, login_name as userName, email, user_status as userStatus, 
                user_role as userRole from users order by user_id desc;`
    return dbconnect.query(_sql)
}

module.exports = {
    addUser,
    setUserStatus,
    findUser,
    findAllUsers
};