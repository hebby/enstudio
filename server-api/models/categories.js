var dbconnect = require('../db/mysql.js')

// 添加类别
let addCategory = (category) => {
    let _sql = `insert into categories set name="${category.name}", alias="${category.alias}", 
                parent_id=${category.parentId}, picture_url="${category.picUrl || ''}", order_num=${category.order || 0}`;
    return dbconnect.query(_sql)
}
//修改类型
let updateCategory = (category) => {
    let _sql = `update categories set name="${category.name}", alias="${category.alias}", 
                parent_id=${category.parentId}, picture_url="${category.picUrl || ''}", 
                order_num=${category.order || 0} where cate_id = ${category.cateId};`
    return dbconnect.query(_sql)
}
// 查找类型
let findCategory = (cateId) => {
    let _sql = `select * from categories where cate_id = ${cateId};`
    return dbconnect.query(_sql)
}
// 按父类查找
let findByParentCatey = (parentCateId) => {
    let _sql = `select * from categories where parent_id = ${parentCateId} order by order_num, cate_id desc;`
    return dbconnect.query(_sql)
}
// 按名称查找
let findCategoriesByName = (name) => {
    let _sql = `select * from categories where name = "${name}" or alias = "${name}"`
    return dbconnect.query(_sql)
}
// 查找所有类型
let findAllCategories = () => {
    let _sql = `select * from categories order by parent_id, cate_id desc;`
    return dbconnect.query(_sql)
}
//单改排序
let orderCategory = (cateId, order) => {
    let _sql = `update categories set order_num = ${order} where cate_id = ${cateId};`
    return dbconnect.query(_sql)
}
// 禁用/启用类别(0: 为禁用， 1：启用)
let setCateStatus = (cateId, isDisabled) => {
    let _sql = `update categories set disabled = ${isDisabled} where cate_id = ${cateId};`
    return dbconnect.query(_sql)
}
// =========================================前端展示接口=============================================
// 按父别名查找
let findByParentAlias = (alias) => {
    let _sql = `select c.cate_id as cid, c.name, c.alias, b.name as rootName, b.alias as rootAlias from categories c 
                INNER JOIN categories b on c.parent_id = b.cate_id where b.alias = '${alias}' 
                order by c.order_num, c.cate_id desc`
    return dbconnect.query(_sql)
}
// 按子别名查找
let findByAlias = (alias) => {
    let _sql = `select c.cate_id as cid, c.name, c.alias, b.name as rootName, b.alias as rootAlias from categories c 
                INNER JOIN categories b on c.parent_id = b.cate_id where c.alias = '${alias}' 
                order by c.order_num, c.cate_id desc`
    return dbconnect.query(_sql)
}
// 按类查找
let findByParentId = (parentCateId) => {
    let _sql = `select cate_id as cid, name, alias from categories where parent_id = ${parentCateId} 
                order by order_num, cate_id desc;`
    return dbconnect.query(_sql)
}

module.exports = {
    addCategory,
    updateCategory,
    findCategory,
    findByParentCatey,
    findCategoriesByName,
    findAllCategories,
    orderCategory,
    setCateStatus,
    //======前端=======
    findByParentAlias,
    findByAlias,
    findByParentId
};