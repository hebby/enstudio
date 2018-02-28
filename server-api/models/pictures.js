var dbconnect = require("../db/mysql.js")

// 添加图片，支持批量添加
let addPictures = (pictures) => {
    if(!Array.isArray(pictures)){
        return null;
    }
    let values = [];
    pictures.forEach((item)=>{
        values.push(`("${item.url}", "${item.thumbUrl}" "${item.title}", "${item.postDate}")`);
    });
    //上传人先不加
    let _sql = "insert into pictures (url, thumb_url, title,  post_date) values " + values.join(",");
    return dbconnect.query(_sql)
}
let addPicture = (picture) => {
    let _sql = `insert into pictures set url="${picture.url}", thumb_url="${picture.thumbUrl}", post_date="${picture.uploadDate}" `;
    return dbconnect.query(_sql)
}
// 标记是否已使用
let setPicturesStatus = (status, picIds) => {
    let _sql = `update pictures set is_used = ${status} where picture_id in ( ${picIds.join(",")} );`
    return dbconnect.query(_sql)
}
// 查找图片: 带条件和分页
let findPictures = (filters, pageCount, currentPage) => {
    let _sql = `select picture_id as id, thumb_url as url, url as b_url, is_used as isUsed from pictures where is_used = ${filters.isUsed ? 1 : 0}`
    if(filters.beginDate){
        _sql += ` and  post_date >= "${filters.beginDate}"`
    }
    if(filters.endDate){
        _sql += ` and  post_date <= "${filters.endDate}"`
    }
    _sql += ` order by picture_id desc limit ${(currentPage-1) * pageCount}, ${pageCount}`;
    
    return dbconnect.query(_sql)
}
// 查找总数，用于分页
let findPicturesCount = (filters, pageCount, currentPage) => {
    let _sql = `select count(picture_id) as total from pictures where is_used = ${filters.isUsed ? 1 : 0}`
    if(filters.beginDate){
        _sql += ` and  post_date >= "${filters.beginDate}"`
    }
    if(filters.endDate){
        _sql += ` and  post_date <= "${filters.endDate}"`
    }
    return dbconnect.query(_sql)
}

module.exports = {
    addPictures,
    addPicture,
    setPicturesStatus,
    findPictures,
    findPicturesCount
};