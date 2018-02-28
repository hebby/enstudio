const cateModel = require('../models/categories.js')
const cusError = require('../config/errors-config')

//获取所有分类信息
let getCategories = async(ctx, next) => {
   await cateModel.findAllCategories()
   .then(result => {
       //重组完后再返回给客户端
       let treeData = _getTreeCategories(result, 0);
       ctx.status = 200;
       ctx.response.body = { data: treeData };
   }).catch(err => {
       ctx.status = 500;
       ctx.response.body = { data: "获取用户信息失败!" };
       console.error("获取用户信息失败",err);
   })
}

function _getTreeCategories(data, root, idTxt, pidTxt, pushTxt) {
  let nidTxt = idTxt || 'cate_id';
  let npidTxt = pidTxt || 'parent_id';
  let npushTxt = pushTxt || 'children';
  // 递归方法
  function getNode(id) {
    let node = []
    for (var i = 0; i < data.length; i++) {
      if (data[i][npidTxt] == id) {
        data[i][npushTxt] = getNode(data[i][nidTxt])
        node.push(data[i])
      }
    }
    if (node.length == 0) {
      return
    } else {
      return node
    }
  }
  // 使用根节点
  return getNode(root)
}


//添加分类
let addCategorie = async(ctx, next) => {
   let reqParams = ctx.request.body.Categories;
   let categories = JSON.parse(reqParams);
   if(!categories || !categories.name || !categories.alias || typeof categories.parentId !== "number"){
       ctx.status = 200;
       ctx.response.body = cusError.getErrorInfo(2001);
       return;
   }

   await cateModel.findCategoriesByName(categories.name)
   .then(async (result) => {
       if(result && result.length > 0){
           ctx.status = 200;
           ctx.response.body = cusError.getErrorInfo(2002);
           return;
       }
       await cateModel.addCategory(categories)
       .then((response) => {
           ctx.status = 200;
           ctx.response.body = {data: response.insertId};
       }).catch(err => {
           ctx.status = 200;
           ctx.response.body = cusError.getErrorInfo(1099);
           return;
       });
    }).catch(err => {
        ctx.status = 500;
        ctx.response.body = cusError.getErrorInfo(1099);
    })
}

//修改分类
let modifyCategorie = async(ctx, next) => {
   let reqParams = ctx.request.body.Categories;
   let cateId = ctx.params.cateId;

   let categories = JSON.parse(reqParams);
   if(!categories || !cateId || !categories.name || !categories.alias || typeof categories.parentId !== "number"){
       ctx.status = 200;
       console.log("request params:", cateId, reqParams);
       ctx.response.body = cusError.getErrorInfo(2001);
       return;
   }
   categories.cateId = cateId;
   await cateModel.findCategoriesByName(categories.name)
   .then(async (result) => {
       if(Array.isArray(result) && result.length > 0 && result[0]["cate_id"].toString() !== cateId){
           ctx.status = 200;
           ctx.response.body = cusError.getErrorInfo(2002);
           return;
       }
       await cateModel.updateCategory(categories)
       .then(() => {
           ctx.status = 200;
           ctx.response.body = {data: ''};
       }).catch(err => {
           ctx.status = 200;
           ctx.response.body = cusError.getErrorInfo(1099, '', err);
           return;
       });
    }).catch(err => {
        ctx.status = 500;
        ctx.response.body = cusError.getErrorInfo(1099, '', err);
    })
}

// =========================================前端展示接口=============================================

// 获取根类型
let getRootCategorys = async(ctx, nex) => {
    await cateModel.findByParentId(0)
    .then((result) => {
        ctx.status = 200;
        ctx.response.body = {data: result};
    }).catch(err => {
        ctx.status = 200;
        ctx.response.body = cusError.getErrorInfo(1099, '', err);
        return;
    });
}

module.exports = {
   getCategories,
   addCategorie,
   modifyCategorie,
   // =======前端========
   getRootCategorys
}