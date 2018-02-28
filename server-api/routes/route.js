const router = require('koa-router')();
const users = require("../controller/users.js")
const categories = require("../controller/categories.js")
const pictures = require("../controller/pictures.js")
const goods = require("../controller/goods")
const koaBody = require('koa-body');

// app.use(koaBody({multipart: true}))

//用户
router.post('/signin', koaBody({multipart: true}), users.signIn)
router.get('/signout', users.signOut)
router.get('/manage-users', users.getUsers)
router.post('/user', koaBody({multipart: true}), users.addUser)
router.post('/modify-user-status', koaBody({multipart: true}), users.setUserStatus)
//分类
router.get('/manage-categories', categories.getCategories)
router.post('/manage-categorie', koaBody({multipart: true}), categories.addCategorie)
router.post('/manage-categorie/:cateId', koaBody({multipart: true}), categories.modifyCategorie)
//图片
router.post('/manage-upload', pictures.addPicture)
router.get('/manage-pictures', pictures.getPictures)
//商品
router.post('/manage-product', koaBody({multipart: true}), goods.addProduct)
router.post('/manage-product/:productId', koaBody({multipart: true}), goods.modifyProduct)
router.get('/manage-products', goods.getProducts)
router.get('/manage-products/:productId', goods.getProduct)

//========================前端============================
router.get('/goods/hot/:topNum', goods.getHotGoods)
router.get('/goods/recommend/:topNum', goods.getRecommendGoods)
router.get('/goods/detail/:id', goods.getProductDetail)
router.get('/goods/category/:typeName/', goods.getFilterGoodsByPage)
router.get('/goods/search/:keyword', goods.getSearchGoods)
router.get('/goods/root-category/:rootCate', goods.getRootcategoryGoods)

router.get('/goods/categorys', categories.getRootCategorys)
// getHotGoods,
//     getRecommendGoods,
//     getProductDetail,
//     getSearchResult,
//     getFilterGoodsByPage,
//     getFilterGoodsTotal,
//     getGoodsByCate,
//     updateProductViewCount
module.exports = router