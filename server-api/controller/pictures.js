const picturesModel = require('../models/pictures.js')
const cusError = require('../config/errors-config')
const uploadFile = require('../lib/img-upload')
const uploadPath = require('../config/common').pictureUploadPath;
const moment = require('moment');
var gm = require("gm");
const path = require('path')

//添加图片
let addPicture = async(ctx, next) => {
    const result = await uploadFile(ctx, {
      path: uploadPath,
      needRename: false,
      prefixKey: 'en-studio'
    })
    if(result.imgPath){
        //测试压缩和截取小图
        let saveTo = result.saveTo
        let fileName = result.imgKey
        let thumbName = 'thumbnail-' + fileName
        let fullName = path.join(saveTo, fileName)
        // //压缩,生成不超过1024的图片, 默认输出质量为75%
        await gm(fullName).resize(1024, null)
        .write(fullName, 
        function (err) {
            if (err) {
                console.log('压缩大图失败！', err);
            }
        });
        //生成缩略图
        await gm(fullName)
        .resize(350, null)
        .write(path.join(saveTo, thumbName), 
        function (err) {
            if (err) {
                console.log('生成缩略图失败！', err);
            }
        });
        //插入数据库
        let picture = {
            url: result.imgPath + "/" + fileName,
            thumbUrl: result.imgPath + "/" + thumbName,
            //authorId: 1,
            uploadDate: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        await picturesModel.addPicture(picture)
        .then(result => {
            ctx.status = 200;
            ctx.body = {data: `成功上传图片：${result ? result.imgPath : ''}`}
        }).catch(err => {
            ctx.status = 500;
            ctx.body = cusError.getErrorInfo(1099, '', err);
        })
    }else{
        ctx.body = cusError.getErrorInfo(3001, '')
    }
}

//分页条件查询
let getPictures = async(ctx, next) => {
    let query = ctx.request.query.filters;
    if(!query){
        ctx.body = cusError.getErrorInfo(3002, '')
        return
    }
    query = JSON.parse(query);
    console.log("query....", query);
    let filters = {
        isUsed: query.isused ? 1: 0,
        beginDate: query.beginDate ? moment(query.beginDate).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: query.endDate ? moment(query.endDate).format('YYYY-MM-DD HH:mm:ss') : ''
    }
    const pageCount = query.pageCount;
    const currentPage = query.currentPage;    
    let countPromise = new Promise((resolve, reject) => {
        picturesModel.findPicturesCount(filters, pageCount, currentPage)
        .then(result => {
            resolve(result)
        }).catch(err => {
            console.error("error","获取图片总数失败！", err)
            reject(err)
        })
    })
    let listPromise = new Promise((resolve, reject) => {
        picturesModel.findPictures(filters, pageCount, currentPage)
        .then(result => {
            resolve(result)
        }).catch(err => {
            console.error("error","获取图片列表失败！", err)
            reject(err)
        })
    })
    await Promise.all([countPromise, listPromise]).then( result => {
        ctx.status = 200;
        ctx.body = {
            imgCount: result[0][0].total || 0,
            data: result[1]
        }
    }).catch( err => {
        ctx.status = 500;
        ctx.body = cusError.getErrorInfo(1099, '', err);
    })
} 

module.exports = {
    addPicture,
    getPictures
}