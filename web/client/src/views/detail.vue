<template>
  <div class="good-detail-box">
    <img :src="baseUrl + goodInfo.mainPictureUrl" alt="">    
    <article>
      <h1 class="detail-main-title">{{goodInfo.title}}</h1>
      <p class="detail-description">
        {{goodInfo.description}}
      </p>
      <div>
        <img v-for="(item, index) in goodInfo.pictures" :key="index" v-lazy="baseUrl + item.url" alt="">
      </div>
    </article>
  </div>
</template>

<script>
import mixin from '../mixin/index'
export default {
  name: 'detail',
  mixins: [mixin],
  data () {
    let basePictureUrl = this.pictureBaseUrl
    return {
      goodInfo: {
        mainPictureUrl: '',
        title: '',
        description: '',
        pictures: []
      },
      baseUrl: basePictureUrl
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    setCurrentMenu (title) {
      let storeCrumbs = this.$store.state.breadCrumbNav
      if (storeCrumbs && storeCrumbs.length) {
        storeCrumbs.push({name: title})
        this.$store.commit('setBreadCrumbNav', storeCrumbs)
      } else {
        this.$store.commit('setBreadCrumbNav', [
          {url: '/', name: '首页'},
          {url: '', name: title}
        ])
      }
    },
    getDetail () {
      let pid = this.$route.params.id
      let self = this
      self.$get('/goods/detail/' + pid, (response) => {
        if (!response || !response.data.data.hasOwnProperty('title')) {
          if (!self.goodInfo) {
            self.goodInfo = null
            self.$router.replace({name: 'noPage'})
            return
          }
        } else {
          self.goodInfo = response.data.data
          self.goodInfo.mainPictureUrl = self.goodInfo.mainPictureUrl.replace('/thumbnail-en-studio-', '/en-studio-')
          self.setCurrentMenu(self.goodInfo.title)
        }
      })
    }
  }
}
</script>

<style scoped>
.good-detail-box{
  width: 100%;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}
.good-detail-box img{
  max-width: 100%;
  width: auto;
  height: auto;
}
.detail-main-title{
  line-height: 2;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 90%;
  text-align: center;
  margin-top: 30px;
}
.detail-description{
  line-height: 1.8;
  text-align: left;
  width: 90%;
  margin: 10px auto 30px;
}
</style>
