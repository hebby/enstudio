
<template>
<div>
  <p class="main-title">{{productInfo.id ? "修改" : "新增"}}商品</p>
  <el-form class="form-box" :model="productInfo" status-icon :rules="productRole" ref="productInfo" label-width="100px">
    <el-form-item label="商品分类" prop="title">
      <el-select style="width: 100%" v-model="checkedCategories" multiple filterable allow-create default-first-option>
        <el-option-group
          v-for="group in categories"
          :key="group.cate_id"
          :label="group.name">
          <el-option
            v-for="item in group.children"
            :key="item.cate_id"
            :label="item.name"
            :value="item.cate_id">
          </el-option>
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item label="商品名称" prop="title" required>
      <el-input v-model="productInfo.title"></el-input>
    </el-form-item>
    <el-form-item label="商品描述">
      <el-input v-model="productInfo.description" type="textarea" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="封面" required>
      <div class="selected-imgs-cell" v-show="productInfo.mainPictureUrl">
        <img :src="baseUrl + productInfo.mainPictureUrl">
      </div>
    </el-form-item>
    <el-form-item label="图片">
      <ul>
        <li v-for="(item, index) in productPics" :key="item.id" class="selected-imgs-cell">
          <i class="el-icon-remove img-remove" v-show="item.checked" @click="handleRemoveItem(index)"></i>
          <img :src="baseUrl + item.url" alt="" @click="setMainPic(item)">
        </li>
        <li class="selected-imgs-cell selected-add-wrap" @click="handleChoosePics">
          <span class="el-icon-plus selected-add"></span>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="设推荐">
      <el-switch v-model="productInfo.isRecommend"></el-switch>
    </el-form-item>
    <el-form-item label="禁用">
      <el-switch v-model="productInfo.isDisabled"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit()">提交</el-button>
      <el-button type="primary" @click="goonAdd()" v-show="!productInfo.id">提交并继续</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form-item>
  </el-form>
  <el-dialog ref="picdialog"
    title="提示"
    :visible.sync="pictureDialog"
    width="100%"
    :before-close="handleDialogClose" fullscreen>
    <choose-pictures @on-close-dialog="onDialogClose" ref="pichoose" :need-update-data="isNeedUpdatePic"></choose-pictures>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span> -->
  </el-dialog>
</div>
</template>

<style>
  .form-box{
    border: 1px solid #eaeefb;
    border-radius: 10px;
    padding: 30px 10px 30px;
    min-width: 400px;
    margin-bottom: 30px;
    width: 60%;
  }
  .selected-imgs-cell{
    width: 50px;
    height: 50px;
    float: left;
    margin: 5px 10px 0 0;
    border: 1px solid #ccc;
    background-color: #f2f2f2;
    text-align: center;
    position: relative;
  }
  .selected-imgs-cell img{
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
    cursor: pointer;
  }
  .selected-add-wrap{
    border-style: dashed;  
    cursor: pointer;  
  }
  .selected-add{
    color: #8c939d;
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 17px;
  }
  .img-remove{
    position: absolute;
    color: red;
    right: -5px;
    top: -5px;
    z-index: 1;
    font-size: 1.1rem;
    opacity: .8;
    cursor: pointer;
  }
</style>

<script>
  import common from '../lib/common'
  import choosePictures from '../components/choose-pictures.vue'
  export default {
    data () {
      return {
        pictureDialog: false,
        productInfo: {
          id: 0,
          title: '',
          description: '',
          mainPictureUrl: '',
          isRecommend: false,
          isDisabled: false
        },
        productRole: {
          title: [
            { required: true, message: '请输入标题！', trigger: 'blur' }
          ]
        },
        baseUrl: `${location.origin}/static/uploads`,
        categories: [],
        checkedCategories: [],
        editOrgInfo: {
          cates: [],
          pics: []
        },
        isNeedUpdatePic: 0
      }
    },
    components: {
      choosePictures
    },
    beforeCreate () {
      let breadNavs = [
        {url: '/', name: '首页'},
        {url: '', name: '新增商品'}
      ]
      this.$store.commit('setBreadCrumbNav', breadNavs)
    },
    created () {
      this._getCategories()
      let proId = this.$route.params.proid
      if (proId) {
        this.setEditInfo(proId)
      } else {
        if (this.productInfo.id) {
          this.clear()
        }
        this.reset()
      }
    },
    computed: {
      productPics () {
        return this.$store.state.productPictures || []
      }
    },
    methods: {
      _setModelInfoCallback (products) {
        let self = this
        let productCateIds = products.productCates.map(function (item) {
          return item.cate_id
        })
        self.checkedCategories = productCateIds
        let orgPicIds = []
        let productPics = products.productPics.map(function (item) {
          item.id = item.picture_id
          orgPicIds.push(item.id)
          item.checked = true
          return item
        })
        // 存储原始信息用于更新
        self.editOrgInfo.cates = productCateIds
        self.editOrgInfo.pics = orgPicIds
        // 更新商品图片
        self.$store.commit('setProductPictures', productPics)
        let editInfo = products.productInfo
        let productInfo = self.productInfo
        if (editInfo) {
          productInfo.title = editInfo.title
          productInfo.description = editInfo.description
          productInfo.mainPictureUrl = editInfo.mainPictureUrl
          productInfo.isRecommend = editInfo.isRecommend === 1
          productInfo.isDisabled = editInfo.disabled === 1
        }
      },
      setEditInfo (productId) {
        let self = this
        self.productInfo.id = productId
        self.$ajax.get('/manage-products/' + productId)
        .then(function (response) {
          if (response.data.data) {
            self._setModelInfoCallback(response.data.data)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      _getCategories () {
        let self = this
        self.$ajax.get('/manage-categories/')
        .then(function (response) {
          if (response && Array.isArray(response.data.data)) {
            self.categories = response.data.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      handleRemoveItem (index) {
        this.productPics.splice(index, 1)
      },
      setMainPic (item) {
        this.productInfo.mainPictureUrl = item.url
        console.log(this.productInfo.mainPictureUrl)
      },
      submit (isGoon) {
        let self = this
        self.$refs['productInfo'].validate((valid) => {
          if (!valid) {
            return false
          }
          let selectedPicIds = self.productPics.map(function (item) {
            return item.id
          })
          let productParams = {
            title: self.productInfo.title,
            description: self.productInfo.description,
            categories: self.checkedCategories,
            mainPictureUrl: self.productInfo.mainPictureUrl,
            productPics: selectedPicIds,
            recommend: self.productInfo.isRecommend ? 1 : 0,
            isDisabled: self.productInfo.isDisabled ? 1 : 0
          }
          let submitUrl = '/manage-product/'
          if (self.productInfo.id) {
            productParams.id = self.productInfo.id
            productParams.orgInfo = self.editOrgInfo
            submitUrl += productParams.id + '/'
          }
          let params = common.convertUrlParams({
            goods: JSON.stringify(productParams)
          })
          console.log('productParams', params.get('goods'))
          self.$ajax.post(submitUrl, params)
          .then(function (response) {
            let resData = response.data
            if (resData.code) {
              self.$message.error(resData.error || '')
              return
            }
            self.$message({
              message: '提交成功！',
              type: 'success'
            })
            self.reset()
            if (!isGoon) {
              self.$router.push('/products/')
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        })
      },
      goonAdd () {
        this.submit(true)
        this.isNeedUpdatePic++
        this.clear()
      },
      clear () {
        this.productInfo = {
          id: 0,
          title: '',
          description: '',
          mainPictureUrl: '',
          isRecommend: false,
          isDisabled: false
        }
        this.checkedCategories = []
      },
      reset () {
        this.$refs['productInfo'].resetFields()
        // 清空信息
        this.$store.commit('setProductPictures', [])
      },
      handleDialogClose (done) {
        done()
      },
      handleChoosePics () {
        this.pictureDialog = true
      },
      onDialogClose () {
        this.pictureDialog = false
      }
    }
  }
</script>