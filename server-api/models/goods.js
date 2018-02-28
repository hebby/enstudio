var dbconnect = require("../db/mysql.js")

// 添加商品
let addProduct = (info) => {
    let _sql = `insert into goods set title="${info.title}", description="${info.description}", main_picture_url="${info.mainPictureUrl}",
                    is_recommend=${info.recommend}, post_date="${info.postDate}", post_author="${info.authorId}"`;
    return dbconnect.query(_sql)
}
//修改类型
let updateProduct = (info, productId) => {
    let _sql = `update goods set title="${info.title}", description="${info.description}", main_picture_url="${info.mainPictureUrl}",
                    is_recommend=${info.recommend}, disabled=${info.isDisabled} where good_id = ${productId}`;
    return dbconnect.query(_sql)
}
//添加商品图片
let addProductPictures = (productId, pictureIds) => {
    let values = [];
    pictureIds.forEach((item)=>{
        values.push(`(${productId}, ${item})`);
    });
    let _sql = "insert into good_picture_map (good_id, picture_id) values " + values.join(",");
    return dbconnect.query(_sql)
}
//添加商品类型
let addProductCategories = (productId, cateIds) => {
    let values = [];
    cateIds.forEach((item)=>{
        values.push(`(${productId}, ${item})`);
    });
    let _sql = "insert into good_category_map (good_id, cate_id) values " + values.join(",");
    return dbconnect.query(_sql)
}
// 启用/禁用商品
let setProductStatus = (productIds, statues) => {
    let _sql = `update goods set disabled = ${status} where good_id  in ( ${productIds.join(",")} );`
    return dbconnect.query(_sql)
}
// 查询单个商品信息
let findProduct = (productId) => {
    let _sql = `select g.good_id as id, g.title as title, g.main_picture_url as mainPictureUrl, g.description as description,
                    g.is_recommend as isRecommend, g.view_count as viewCount, g.post_date as postDate, disabled 
                    from goods g where good_id = ${productId}`
    return dbconnect.query(_sql);
}
// 查找商品: 带条件和分页
let findProducts = (filters, pageCount, currentPage) => {
    let _sql = `select DISTINCT g.good_id as id, g.title as title, g.main_picture_url as mainPictureUrl, g.description as description, 
                    g.is_recommend as isRecommend, g.view_count as viewCount, g.post_date as postDate, disabled 
                    from goods g LEFT JOIN good_category_map m on g.good_id = m.good_id where 1=1 `
    if(Array.isArray(filters.cateIds) && filters.cateIds.length > 0){
        _sql += ` and m.cate_id in ( ${filters.cateIds.join(",")} )`
    }
    if(filters.title){
        _sql += ` and g.title like "%${filters.title}%"`
    }
    if(filters.isRecommend){
        _sql += ` and g.is_recommend = "${filters.isRecommend}"`
    }
    if(filters.isDisabled){
        _sql += ` and g.disabled = "${filters.isDisabled}"`
    }
    if(filters.postStartDate){
        _sql += ` and g.post_date >= "${filters.postStartDate}"`
    }
    //添加分类筛选，多表关联
    _sql += ` order by g.good_id desc limit ${(currentPage-1) * pageCount}, ${pageCount}`
    return dbconnect.query(_sql)
}
// 查找商品总数，用于分页
let findProductsCount = (filters, pageCount, currentPage) => {
    let _sql = `select count(v.good_id) as total from (select distinct g.good_id from goods g LEFT JOIN good_category_map m 
                    on g.good_id = m.good_id where 1=1 `
    if(Array.isArray(filters.cateIds) && filters.cateIds.length > 0){
        _sql += ` and m.cate_id in ( ${filters.cateIds.join(",")} )`
    }
    if(filters.title){
        _sql += ` and g.title like "%${filters.title}%"`
    }
    if(filters.isRecommend){
        _sql += ` and g.is_recommend = "${filters.isRecommend}"`
    }
    if(filters.isDisabled){
        _sql += ` and g.disabled = "${filters.isDisabled}"`
    }
    if(filters.postStartDate){
        _sql += ` and g.post_date >= "${filters.postStartDate}"`
    }
    _sql += ") as v"
    return dbconnect.query(_sql)
}
// 查找商品对应的类型信息
let findCategoriesByGoodids = (productIds) => {
    let _sql = `select c.cate_id, c.name, m.good_id from categories c left join good_category_map m on c.cate_id = m.cate_id `
    if(Array.isArray(productIds)){
        _sql += ` where m.good_id in ( ${productIds.join(",")} )`
    } else {
        _sql += ` where m.good_id = ${productIds}`
    }
    
    return dbconnect.query(_sql)
}
// 查找商品对应的图片
let findPicturesByGoodids = (productId) => {
    let _sql = `select p.picture_id, p.url from pictures p left join good_picture_map m on p.picture_id = m.picture_id 
                    where m.good_id = ${productId} `
    return dbconnect.query(_sql)
}
// 删除商品图片
let deleteProductPics = (productId, pics) => {
    let _sql = `delete from good_picture_map where good_id = ${productId} `
    if(Array.isArray(pics) && pics.length > 0){
        _sql += ` and picture_id in ( ${pics.join(",")} )`
    }
    return dbconnect.query(_sql)
}
// 删除商品类别
let deleteProductCates = (productId, cates) => {
    let _sql = `delete from good_category_map where good_id = ${productId} `
    if(Array.isArray(cates) && cates.length > 0){
        _sql += ` and cate_id in ( ${cates.join(",")} )`
    }
    return dbconnect.query(_sql)
}

// =========================================前端展示接口=============================================

// 热销top
let getHotGoods = (topNum) => {
    let _sql = `SELECT good_id as pid, title, main_picture_url as mainPictureUrl, view_count as ViewCount 
                FROM goods WHERE disabled = 0 ORDER BY view_count desc, good_id desc LIMIT ${topNum || 10}`
    return dbconnect.query(_sql)
}

// 推荐top
let getRecommendGoods = (topNum) => {
    let _sql = `SELECT good_id as pid, title, main_picture_url as mainPictureUrl, view_count as ViewCount 
                FROM goods WHERE disabled = 0 and is_recommend = 1 ORDER BY good_id desc LIMIT ${topNum || 10}`
    return dbconnect.query(_sql)
}

// 查询商品详情，无图片及类型信息
let getProductDetail = (pid) => {
    let _sql = `SELECT good_id as pid, title, main_picture_url as mainPictureUrl, view_count as ViewCount, description
                FROM goods WHERE good_id = ${pid}`
    return dbconnect.query(_sql)
}

// 搜索, 关键字搜索。搜索字段：title, discription, catename
let getSearchResult = (keyword, pageCount, currentPage) => {
    let _sql = `SELECT DISTINCT g.good_id as pid, g.title, g.main_picture_url as mainPictureUrl, g.view_count as ViewCount
                FROM goods g
                LEFT JOIN good_category_map m ON g.good_id = m.good_id
                LEFT JOIN categories c ON c.cate_id = m.cate_id
                WHERE g.title LIKE '%${keyword}%' OR g.description LIKE '%${keyword}%' OR c.name LIKE '%${keyword}%'
                ORDER BY g.good_id desc`
    _sql += ` limit ${(currentPage-1) * pageCount}, ${pageCount}`
    return dbconnect.query(_sql)
}

// 搜索总数, 关键字搜索。搜索字段title, discription, catename
let getSearchCount = (keyword) => {
    let _sql = `select count(good_id) as total from ( SELECT DISTINCT g.good_id 
                FROM goods g
                LEFT JOIN good_category_map m ON g.good_id = m.good_id
                LEFT JOIN categories c ON c.cate_id = m.cate_id
                WHERE g.title LIKE '%${keyword}%' OR g.description LIKE '%${keyword}%' OR c.name LIKE '%${keyword}%'
                ORDER BY g.good_id desc) as t`
    return dbconnect.query(_sql)
}

// 商品分类列表，分页
let getFilterGoodsByPage = (filter, pageCount, currentPage) => {
    let _sql = `SELECT DISTINCT g.good_id as pid, g.title, g.main_picture_url as mainPictureUrl, g.view_count as ViewCount 
                FROM goods g `;
    if (filter === "hot") {
        _sql += `  WHERE g.disabled = 0 ORDER BY view_count desc, good_id desc `    
    } else if(filter === "recommend") {
        _sql += `  WHERE g.disabled = 0 AND is_recommend = 1 ORDER BY good_id desc`  
    } else {
        _sql += ` LEFT JOIN good_category_map m ON g.good_id = m.good_id
            LEFT JOIN categories c ON c.cate_id = m.cate_id WHERE g.disabled = 0 AND c.alias = '${filter}' 
            ORDER BY g.good_id desc`
    }
    _sql += ` limit ${(currentPage-1) * pageCount}, ${pageCount}`
    return dbconnect.query(_sql)
}

// 商品分类列表总数，分页
let getFilterGoodsTotal = (filter, pageCount, currentPage) => {
    let _sql = `SELECT count(g.good_id) as total FROM goods g `;
    if (filter === "hot") {
        _sql += `  WHERE g.disabled = 0 ORDER BY view_count desc, good_id desc `    
    } else if(filter === "recommend") {
        _sql += `  WHERE g.disabled = 0 AND is_recommend = 1 ORDER BY good_id desc`  
    } else {
        _sql += ` LEFT JOIN good_category_map m ON g.good_id = m.good_id
            LEFT JOIN categories c ON c.cate_id = m.cate_id WHERE g.disabled = 0 AND c.alias = '${filter}'`
    }
    return dbconnect.query(_sql)
}

// 根据分类获取商品
let getGoodsByCate = (cateId, topNum) => {
    let _sql = `SELECT DISTINCT g.good_id as pid, g.title, g.main_picture_url as mainPictureUrl, g.view_count as ViewCount FROM goods g
                LEFT JOIN good_category_map m ON g.good_id = m.good_id
                WHERE g.disabled = 0 AND m.cate_id = ${cateId} ORDER BY g.good_id desc limit ${topNum}`
    return dbconnect.query(_sql)
}

// 更新商品查阅量
let updateProductViewCount = (pid) => {
    let _sql = `update goods set view_count = view_count + 1 where good_id = ${pid}`
    return dbconnect.query(_sql)
}

module.exports = {
    addProduct,
    addProductPictures,
    addProductCategories,
    setProductStatus,
    findProduct,
    findProducts,
    findProductsCount,
    findCategoriesByGoodids,
    findPicturesByGoodids,
    deleteProductPics,
    deleteProductCates,
    updateProduct,
    //======前端=======
    getHotGoods,
    getRecommendGoods,
    getProductDetail,
    getSearchResult,
    getSearchCount,
    getFilterGoodsByPage,
    getFilterGoodsTotal,
    getGoodsByCate,
    updateProductViewCount
};