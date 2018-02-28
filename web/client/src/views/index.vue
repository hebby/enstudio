<template>
  <div style="position: relative;">
    <!-- <Loading v-show="loadding"></Loading> -->
    <div v-show="!loadding">
      <goods-banner-list :goods="recommendGoods" v-show="recommendGoods"></goods-banner-list>
      <goods-banner-list :goods="hotGoods" v-show="hotGoods"></goods-banner-list>
    </div>
  </div>
</template>

<script>
import goodsBannerList from '../components/goods-banner-list.vue'
import Loading from '../components/loading.vue'
export default {
  name: 'hot',
  data () {
    return {
      hotGoods: null,
      recommendGoods: null,
      loadding: false
    }
  },
  created () {
    this.$store.commit('setBreadCrumbNav', [])
    this.getHotGoods()
    this.getRecommendGoods()
  },
  methods: {
    getHotGoods () {
      let self = this
      self.$ajax.get('/goods/hot/10/')
      .then(function (response) {
        if (!response || response.data.error) {
          self.$router.replace({name: 'error'})
          return
        }
        if (response && response.data.data && Array.isArray(response.data.data)) {
          self.hotGoods = {
            bar: {
              name: '畅销热品',
              alias: 'hot',
              moreLinkText: '全部热品'
            },
            data: response.data.data
          }
        } else {
          if (!self.hotGoods) {
            self.hotGoods = null
          }
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
    getRecommendGoods () {
      let self = this
      self.$ajax.get('/goods/recommend/10/')
      .then(function (response) {
        if (!response || response.data.error) {
          self.$router.replace({name: 'error'})
          return
        }
        if (response && response.data.data && Array.isArray(response.data.data)) {
          self.recommendGoods = {
            bar: {
              name: '推荐商品',
              alias: 'recommend',
              moreLinkText: '全部推荐'
            },
            data: response.data.data
          }
        } else {
          if (!self.recommendGoods) {
            self.recommendGoods = null
          }
        }
      }).catch(function (error) {
        console.log(error)
        self.$router.replace({name: 'error'})
      })
    }
  },
  components: {
    goodsBannerList,
    Loading
  }
}
</script>

<style>
/* main{
  background-color: #fff !important;
} */
</style>
