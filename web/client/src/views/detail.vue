<template>
  <div class="good-detail-box">
    <img :src="baseUrl + goodInfo.mainPictureUrl" alt="">    
    <article>
      <h1>{{goodInfo.title}}</h1>
      <p>
        {{goodInfo.description}}
      </p>
      <div>
        <img v-for="(item, index) in goodInfo.pictures" :key="index" :src="baseUrl + item.url" alt="">
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    let basePictureUrl = this.pictureBaseUrl
    return {
      goodInfo: null,
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
      self.$ajax.get('/goods/detail/' + pid)
      .then(function (response) {
        if (!response || response.data.error) {
          self.$router.replace({name: 'error'})
          return
        }
        if (!response || !response.data.data.hasOwnProperty('title')) {
          if (!self.goodInfo) {
            self.goodInfo = null
            self.$router.replace({name: 'noPage'})
            return
          }
        } else {
          self.goodInfo = response.data.data
          self.setCurrentMenu(self.goodInfo.title)
        }
      }).catch(function (error) {
        console.log(error)
        self.$router.replace({name: 'error'})
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
</style>
