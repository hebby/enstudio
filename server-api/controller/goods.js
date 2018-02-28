const goodsModel = require('../models/goods.js')
const cateModel = require('../models/categories.js')
const picturesModel = require('../models/pictures.js')
const cusError = require('../config/errors-config')
const moment = require('moment');
// const check = require('../middlewares/login-check')

let getArrayDiffset = function(arrOrg, arrNew){
  arrOrg = arrOrg || []
  arrNew = arrNew || []
  // 交集
  let overSection = arrOrg.filter(v => arrNew.includes(v))
  // 差集
  let diffOrg = overSection.concat(arrOrg).filter(v => !overSection.includes(v) || !arrOrg.includes(v))
  let diffNew = overSection.concat(arrNew).filter(v => !overSection.includes(v) || !arrNew.includes(v))
  return [diffOrg, diffNew]
}

//添加商品
let addProduct = async(ctx, next) => {
    let reqParams = ctx.request.body.goods;
    let goods = JSON.parse(reqParams);
    if(!goods || !goods.title || !goods.mainPictureUrl){
        ctx.status = 200;
        ctx.response.body = cusError.getErrorInfo(2001);
        return;
    }
    goods.postDate = moment().format('YYYY-MM-DD HH:mm:ss');
    // TODO：更新为登录人
    goods.authorId = 1;
    await goodsModel.addProduct(goods)
    .then(async (response) => {
        const productId = response.insertId;
        const pictures = goods.productPics;
        const categories = goods.categories;

        let promises = [];
        if(Array.isArray(pictures) && pictures.length > 0){

          // 插入产品图片关联
          let addProductPictures = goodsModel.addProductPictures(productId, pictures)
          .then((response) => {
            console.log("产品关联图片成功！")
          }).catch(err => {
            console.error("error", "产品关联图片失败", err)
          })
          promises.push(addProductPictures);

          // 更新图片使用状态
          let setPicturesStatus = picturesModel.setPicturesStatus(1, pictures)
          .then((response) => {
            console.log("图片使用状态更新成功！")
          }).catch(err => {
            console.error("error", "图片使用状态更新失败", err)
          })
          promises.push(setPicturesStatus);
        }

        // 插入产品图片类别
        if(Array.isArray(categories) && categories.length > 0){
          let addProductCategories = goodsModel.addProductCategories(productId, categories)
          .then((response) => {
            console.log("产品类别关联成功！")
          }).catch(err => {
            console.error("error", "产品类别关联失败", err)
          })
          promises.push(addProductCategories);
        }

        // 关联信息并行更新
        if(promises.length > 0){
          await Promise.all(promises).then( result => {
              ctx.status = 200;
              ctx.body = {data: productId}
          }).catch( err => {
              ctx.status = 500;
              ctx.body = cusError.getErrorInfo(1099, '', err);
          });
        } else {
          console.log("未更新任何关联信息！");
          ctx.status = 200;
          ctx.body = {data: productId}
        }
    }).catch(err => {
        ctx.status = 200;
        ctx.body = cusError.getErrorInfo(1099, '', err);
        return;
    });
}

//修改商品
let modifyProduct = async(ctx, next) => {
  let productId = ctx.params.productId;
  let reqParams = ctx.request.body.goods;
  let goods = JSON.parse(reqParams);
  if(!productId || !goods || !goods.title || !goods.mainPictureUrl || !goods.orgInfo){
      ctx.status = 200;
      ctx.response.body = cusError.getErrorInfo(2001);
      return;
  }

  let [diffOrgCates, diffNewCates] = getArrayDiffset(goods.orgInfo.cates, goods.categories)
  let [diffOrgPics, diffNewPics] =  getArrayDiffset(goods.orgInfo.pics, goods.productPics)
  console.log("......info:", diffOrgCates, diffNewCates, diffOrgPics, diffNewPics)
  let handlePromises = []
  if(diffOrgPics.length > 0){
    //删除旧的商品照片
    let deleteProductPics = goodsModel.deleteProductPics(productId, diffOrgPics)
      .then((response) => {
        console.log("删除旧的商品照片成功！")
      }).catch(err => {
        console.error("error", "删除旧的商品照片失败", err)
      });
    handlePromises.push(deleteProductPics);
    //更新图片状态，改为可用
    let setPicturesEnable = picturesModel.setPicturesStatus(0, diffOrgPics)
      .then((response) => {
        console.log("更新图片状态成功！")
      }).catch(err => {
        console.error("error", "更新图片状态失败", err)
      })
    handlePromises.push(setPicturesEnable);
  }
  //添加新商品照片
  if(diffNewPics.length > 0){
    let addProductPics = goodsModel.addProductPictures(productId, diffNewPics)
      .then((response) => {
        console.log("添加新商品照片成功！")
      }).catch(err => {
        console.error("error", "添加新商品照片失败", err)
      });
    handlePromises.push(addProductPics);
    //更新图片状态，改为已用
    let setPicturesDisable = picturesModel.setPicturesStatus(1, diffNewPics)
      .then((response) => {
        console.log("更新图片状态成功！")
      }).catch(err => {
        console.error("error", "更新图片状态失败", err)
      })
    handlePromises.push(setPicturesDisable);
  }
  //删除旧的商品类型
  if(diffOrgCates.length > 0){
    let deleteProductCates = goodsModel.addProductCategories(productId, diffOrgCates)
      .then((response) => {
        console.log("删除旧的商品类型成功！")
      }).catch(err => {
        console.error("error", "删除旧的商品类型失败", err)
      });
    handlePromises.push(deleteProductCates);
  }
  //添加新的商品类型
  if(diffNewCates.length > 0){
    let addProductCates = goodsModel.addProductCategories(productId, diffNewCates)
      .then((response) => {
        console.log("添加新的商品类型成功！")
      }).catch(err => {
        console.error("error", "添加新的商品类型失败", err)
      });
    handlePromises.push(addProductCates);
  }
  //更新商品信息
  let updateProduct = goodsModel.updateProduct(goods, productId)
    .then((response) => {
      console.log("添加新的商品类型成功！")
    }).catch(err => {
      console.error("error", "添加新的商品类型失败", err)
    });
  handlePromises.push(updateProduct);

  // 关联信息并行更新
  if(handlePromises.length > 0){
    await Promise.all(handlePromises).then( result => {
        ctx.status = 200;
        ctx.body = {data: productId}
    }).catch( err => {
        ctx.status = 500;
        ctx.body = cusError.getErrorInfo(1099, '', err);
    });
  } else {
    console.log("未更新任何信息！");
    ctx.status = 200;
    ctx.body = {data: productId}
  }
}

//分页条件查询
let getProducts = async(ctx, next) => {
    let query = ctx.request.query.filters;
    if(!query){
        ctx.body = cusError.getErrorInfo(4002, '')
        return
    }
    query = JSON.parse(query);
    console.log("query....", query);
    // { cateIds: [],
    //   title: '',
    //   isRecommend: '',
    //   postStartDate: '',
    //   currentPage: 1,
    //   pageCount: 20 }
    let filters = {
        cateIds: query.cateIds,
        title: query.title,
        isRecommend: query.isRecommend === "1" ? 1 : 0,
        // isDisabled: query.isDisabled,
        postStartDate: query.postStartDate ? moment(query.postStartDate).format('YYYY-MM-DD HH:mm:ss') : ''
    }
    const pageCount = query.pageCount;
    const currentPage = query.currentPage;
    
    let total = 0;
    await goodsModel.findProductsCount(filters, pageCount, currentPage)
    .then(result => {
        console.log("result", result);
        total = result[0].total || 0;
    }).catch(err => {
        console.error("error","获取图片总数失败！", err)
        ctx.body = cusError.getErrorInfo(1099, '', err);
    })
    if(total === 0){
      console.log("商品数量为0！");
      ctx.status = 200;
      ctx.body = {
          goodsCount: total,
          data: []
      }
      return
    }
    await goodsModel.findProducts(filters, pageCount, currentPage)
    .then(async (result) => {
      let productIds = result.map(item => {
        return item.id;
      });
      await goodsModel.findCategoriesByGoodids(productIds)
      .then(cates => {
        let products = result.map( item => {
          let productCates = [];
          cates.forEach(cate => {
            if(cate.good_id === item.id){
              productCates.push(cate.name)
            }
          });
          item.categories = productCates.join(',')
          return item;
        })
        ctx.status = 200;
        ctx.body = {
          goodsCount: total,
            data: products
        }
      }).catch(err => {
        ctx.status = 500;
        console.error("error","获取商品类型失败", err)
        ctx.body = cusError.getErrorInfo(1099, '', err);
      })
    }).catch(err => {
      ctx.status = 500;
      console.error("获取商品分页信息失败", err)
      ctx.body = cusError.getErrorInfo(1099, '', err);
    })
} 

// 获取单条记录
let getProduct = async(ctx, next) => {
  let productId = ctx.params.productId;
  if(!productId){
    ctx.body = cusError.getErrorInfo(4002, '')
    return
  }

  //获取商品类型
  let productCatesPromise = goodsModel.findCategoriesByGoodids(productId)
  .then(result => {
    return result
  }).catch(err => {
    console.error("error", "获取商品类型失败！", err)
  })
  //获取图片
  let productPicsPromise = goodsModel.findPicturesByGoodids(productId)
  .then(result => {
    return result
  }).catch(err => {
    console.error("error", "获取商品图片失败！", err)
  })
  //获取产品信息
  let productInfoPromise = goodsModel.findProduct(productId)
  .then(result => {
    return result
  }).catch(err => {
    console.error("error", "获取商品信息失败！", err)
  })
  //并行查询
  await Promise.all([productCatesPromise, productPicsPromise, productInfoPromise])
  .then( result => {
    console.log('result111', result)
    ctx.status = 200;
    ctx.body = {
      data: {
        productCates: result[0],
        productPics: result[1],
        productInfo: result[2][0] || null
      }
    }
  }).catch( err => {
    ctx.status = 500;
    ctx.body = cusError.getErrorInfo(1099, '', err);
  })
} 

// =========================================前端展示接口=============================================

let isNumber = function(number){
  return /^[1-9][\d]+\d*$/.test(number);
}

// 获取热门商品
let getHotGoods = async(ctx, nex) => {
  let topNums = ctx.params.topNum
  if(!isNumber(topNums) || parseInt(topNums) > 100){
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(4004, '');
    return
  }
  await goodsModel.getHotGoods(topNums)
  .then( result => {
    ctx.status = 200;
    ctx.body = {
      data: result
    }
  }).catch( err => {
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(1099, '', err);
  })
}

// 获取推荐商品
let getRecommendGoods = async(ctx, nex) => {
  let topNums = ctx.params.topNum
  if(!isNumber(topNums) || parseInt(topNums) > 100){
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(4004, '');
    return
  }
  await goodsModel.getRecommendGoods(topNums)
  .then( result => {
    ctx.status = 200;
    ctx.body = {
      data: result
    }
  }).catch( err => {
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(1099, '', err);
  })
}

// 获取推荐商品明细
let getProductDetail = async(ctx, nex) => {
  let proId = ctx.params.id
  console.log("type proId", typeof proId, proId)
  if (!proId) {
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(4001, '', err);
    return
  }

  let detailPromise = goodsModel.getProductDetail(proId)
  .then( result => {
    return result
  }).catch( err => {
    console.log("获取推荐商品明细 error:", err);
  })

  let picturesPromise = goodsModel.findPicturesByGoodids(proId)
  .then( result => {
    return result
  }).catch( err => {
    console.log("获取推荐商品图片 error:", err);
  })

  let updateViewCountPromise = goodsModel.updateProductViewCount(proId)
  .then( result => {
    // console.log("更新成功！")
  }).catch( err => {
    console.log("获取推荐商品图片 error:", err);
  })

  await Promise.all([detailPromise, picturesPromise, updateViewCountPromise])
  .then( result => {
    ctx.status = 200;
    let detail = result[0]
    if(!detail || detail.length === 0){
      ctx.body = cusError.getErrorInfo(4003, '', err);
      return
    }
    detail = detail[0]
    detail.pictures = result[1]
    ctx.body = {
      data: detail
    }
  }).catch( err => {
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(1099, '', err);
  })  
}

// 获取分类商品信息
let getFilterGoodsByPage = async(ctx, nex) => {
  let goodCate = ctx.params.typeName
  let query = ctx.request.query;
  if(!goodCate){
      ctx.body = cusError.getErrorInfo(4002, '')
      return
  }
  console.log("query.....", query.currentPage, query.pageCount)
  let currentPage = query.currentPage || 1;
  let pageCount = query.pageCount || 20;
  //获取搜索商品总量
  let goodsTotalPromise = goodsModel.getFilterGoodsTotal(goodCate)
  .then( result => {
    return result
  }).catch( err => {
    console.log("获取搜索商品总量 error:", err);
  })
  //获取搜索商品列表
  let goodsListPromise = goodsModel.getFilterGoodsByPage(goodCate, pageCount, currentPage)
  .then( result => {
    return result
  }).catch( err => {
    console.log("获取搜索商品列表 error:", err);
  })
  let promises = [goodsTotalPromise, goodsListPromise]
  //获取商品类别, 用于填充面包屑
  if(currentPage === "1"){
    let catePromise = cateModel.findByAlias(goodCate)
    .then( result => {
      return result
    }).catch( err => {
      console.log("获取商品类别 error:", err);
    })
    promises.push(catePromise)
  }
  await Promise.all(promises)
  .then( result => {
    ctx.status = 200;
    let total = result[0]
    if(!total || total[0].total === 0){
      ctx.body = cusError.getErrorInfo(4003, '', err);
      return
    }
    let data = {
      goods: result[1],
      totalCount: total[0].total
    }
    if(result.length > 2){
      data.cateInfo = result[2].length > 0 ? result[2][0] : null
    }
    ctx.body = {
      data: data
    }
  }).catch( err => {
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(1099, '', err);
  })
}

// 商品搜索
let getSearchGoods = async(ctx, nex) => {
  let keyword = ctx.params.keyword
  let query = ctx.request.query;
  if(!keyword){
      ctx.body = cusError.getErrorInfo(4002, '')
      return
  }
  console.log("query.....", query.currentPage,query.pageCount)
  let currentPage = query.currentPage || 1;
  let pageCount = query.pageCount || 20;
  //获取搜索商品总量
  let searchTotalPromise = goodsModel.getSearchCount(keyword)
  .then( result => {
    return result
  }).catch( err => {
    console.log("获取搜索商品总量 error:", err);
  })
  //获取搜索商品列表
  let searchListPromise = goodsModel.getSearchResult(keyword, pageCount, currentPage)
  .then( result => {
    return result
  }).catch( err => {
    console.log("获取搜索商品列表 error:", err);
  })
  await Promise.all([searchTotalPromise, searchListPromise])
  .then( result => {
    ctx.status = 200;
    let total = result[0]
    ctx.body = {
      data: {
        goods: result[1],
        totalCount: total[0].total
      }
    }
  }).catch( err => {
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(1099, '', err);
  })
}

let getRootcategoryGoods = async(ctx, nex) => {
  let alias = ctx.params.rootCate;
  console.log("alias", alias);
  let topNum = 6;
  if(!alias){
    ctx.body = cusError.getErrorInfo(4002, '');
    return;
  }

  await cateModel.findByParentAlias(alias)
  .then(async(result) => {
    if(!result || result.length === 0) {
      ctx.status = 200;
      ctx.body = {
        data: []
      }
      return;
    }

    let promises = [];
    result.forEach((item) => {
      let cateTopGoodsPromise = goodsModel.getGoodsByCate(item.cid, topNum)
      .then(result => {
        return {
          bar: item,
          data: result
        };
      }).catch( err => {
        console.log("获取类型的商品 error:", err);
      })
      promises.push(cateTopGoodsPromise);
    });

    ctx.status = 200;
    await Promise.all(promises).then(result => {
      let cateInfo = {name: '', alias: ''}
      if (result && result.length > 0){
        let navData = result[0].bar
        cateInfo = {name: navData.rootName, alias: navData.rootAlias}
      }
      ctx.body = {
        data: result.filter(r =>  r.data && r.data.length > 0),
        cateInfo: cateInfo
      }
    }).catch( err => {
      console.log("获取类型商品失败 error:", err);
      ctx.body = cusError.getErrorInfo(1099, '', err);
    })

  }).catch( err => {
    ctx.status = 200;
    ctx.body = cusError.getErrorInfo(1099, '', err);
  })
}

module.exports = {
  addProduct,
  modifyProduct,
  getProducts,
  getProduct,
  getHotGoods,
  getRecommendGoods,
  getProductDetail,
  getFilterGoodsByPage,
  getSearchGoods,
  getRootcategoryGoods
}