var dbconnect = require('../db/mysql.js')

// 注册广告
let addBanner = (banner) => {
    let _sql = `insert into banners set picture_url="${banner.pictureUrl}", title="${banner.title}", link_url="${banner.linkUrl}"`;
    return dbconnect.query(_sql)
}
// 禁用/启用广告(0: 为禁用， 1：启用)
let setBannerStatus = (bannerId, isDisabled) => {
    let _sql = `update banners set disabled = ${isDisabled} where banner_id = ${bannerId};`
    return dbconnect.query(_sql)
}
// 查找广告
let findBanner = (bannerId) => {
    let _sql = `select * from banners where banner_id=${bannerId};`
    return dbconnect.query(_sql)
}
// 查找所有广告
let findAllBanners = () => {
    let _sql = `select * from banners order by banner_id desc;`
    return dbconnect.query(_sql)
}

module.exports = {
    addBanner,
    setBannerStatus,
    findBanner,
    findAllBanners
};