
<template>
<div class="form-box">
  <p class="main-title">{{bannerInfo.id ? "修改" : "新增"}}广告栏</p>
  <el-form :model="bannerInfo" status-icon :rules="bannerRole" ref="bannerInfo" label-width="100px">
    <el-form-item label="标题" prop="title" required>
      <el-input v-model="bannerInfo.title"></el-input>
    </el-form-item>
    <el-form-item label="副标题" prop="subTitle">
      <el-input v-model="bannerInfo.subTitle" ></el-input>
    </el-form-item>
    <el-form-item label="广告链接" prop="linkUrl" required>
      <el-input v-model="bannerInfo.linkUrl"></el-input>
    </el-form-item>
    <el-form-item label="背景图片">
      <ul>
        <li class="selected-imgs-cell" v-if="bannerPic">
          <img :src="baseUrl + bannerPic.url" alt="" >
        </li>
        <li class="selected-imgs-cell selected-add-wrap" @click="handleChoosePics">
          <span class="el-icon-plus selected-add"></span>
        </li>
      </ul>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit()">提交</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form-item>
  </el-form>
  <el-dialog ref="picdialog"
    title="提示"
    :visible.sync="pictureDialog"
    width="100%"
    :before-close="handleDialogClose" fullscreen>
    <choose-pictures @on-close-dialog="onDialogClose" ref="pichoose" :need-update-data="isNeedUpdatePic"></choose-pictures>
  </el-dialog>
</div>
</template>

<style>
  .form-box{
    border: 1px solid #eaeefb;
    border-radius: 10px;
    padding: 40px 30px 50px 10px;
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
      let basePictureUrl = this.pictureBaseUrl
      return {
        pictureDialog: false,
        bannerInfo: {
          id: 0,
          title: '',
          subTitle: '',
          linkUrl: ''
        },
        bannerRole: {
          title: [
            { required: true, message: '请输入标题！', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '请输入链接！', trigger: 'blur' }
          ]
        },
        baseUrl: basePictureUrl,
        isNeedUpdatePic: 0
      }
    },
    components: {
      choosePictures
    },
    beforeCreate () {
      let breadNavs = [
        {url: '/', name: '首页'},
        {url: '/banners/', name: '广告栏位列表'},
        {url: '', name: '新增广告'}
      ]
      this.$store.commit('setBreadCrumbNav', breadNavs)
    },
    created () {
      let bannerId = this.$route.params.bannerId
      if (bannerId) {
        this.setEditInfo(bannerId)
      }
    },
    // 切换路由(新增或者修改切换时)
    beforeRouteLeave (to, from, next) {
      this.clear()
      this.reset()
      next()
    },
    computed: {
      bannerPic () {
        let pics = this.$store.state.productPictures
        if (!pics || pics.length === 0) {
          return null
        }
        return pics[pics.length - 1] || null
      }
    },
    methods: {
      _setModelInfoCallback (editInfo) {
        let self = this
        if (editInfo) {
          let bannerInfo = self.bannerInfo
          bannerInfo.title = editInfo.title
          bannerInfo.subTitle = editInfo.subTitle
          bannerInfo.linkUrl = editInfo.linkUrl
          // 更新商品图片
          let productPics = [{
            url: editInfo.pictureUrl,
            checked: true
          }]
          self.$store.commit('setProductPictures', productPics)
        }
      },
      setEditInfo (id) {
        let self = this
        self.bannerInfo.id = id
        self.$ajax.get('/manage-banners/' + id)
        .then(function (response) {
          let result = response.data.data
          if (result && [] instanceof Array && result.length > 0) {
            self._setModelInfoCallback(result[0])
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      formValidate (fn) {
        let self = this
        self.$refs['bannerInfo'].validate((valid) => {
          if (!valid) {
            return false
          }
          if (!self.bannerInfo.id && (!self.bannerPic || !self.bannerPic.id)) {
            self.$message.error('请选择备选图片！')
            return false
          }
          fn()
        })
      },
      getParams () {
        let self = this
        let bannerParams = {
          title: self.bannerInfo.title,
          subTitle: self.bannerInfo.subTitle,
          linkUrl: self.bannerInfo.linkUrl,
          pictureId: self.bannerPic.id || '',
          pictureUrl: self.bannerPic.url || ''
        }
        let submitUrl = ''
        let bannerId = self.bannerInfo.id
        if (bannerId) {
          bannerParams.id = bannerId
          submitUrl = '/manage-banners/' + bannerId + '/'
        } else {
          submitUrl = '/manage-banner/'
        }
        let params = common.convertUrlParams({
          banner: JSON.stringify(bannerParams)
        })
        return {
          params: params,
          url: submitUrl
        }
      },
      submit (isGoon) {
        let self = this
        self.formValidate(() => {
          let result = self.getParams()
          self.$ajax.post(result.url, result.params)
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
              self.$router.push('/banners/')
            }
          }).catch(function (error) {
            console.log(error)
          })
        })
      },
      clear () {
        this.bannerInfo = {
          id: 0,
          title: '',
          subTitle: '',
          linkUrl: ''
        }
      },
      reset () {
        // 清空信息
        this.$store.commit('setProductPictures', [])
        this.$refs['bannerInfo'].resetFields()
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