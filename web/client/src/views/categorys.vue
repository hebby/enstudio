<template>
  <div>
    <template v-if="categorys.length > 0">
      <goods-banner-list v-for="(goods, index) in categorys" :key="index" :goods="goods"></goods-banner-list>
    </template>
    <div v-else class="text-no-result">
      暂无数据
      <!-- 商品 -->
    </div>
  </div>
</template>

<script>
import goodsBannerList from '../components/goods-banner-list.vue'
export default {
  name: 'category',
  data () {
    return {
      categorys: [],
      currentCateAlias: ''
    }
  },
  created () {
    this.currentCateAlias = this.$route.params.name
    this.getGoods()
  },
  beforeRouteUpdate (to, from, next) {
    this.currentCateAlias = to.params.name
    this.getGoods()
    next()
  },
  methods: {
    setCurrentMenu (cate) {
      let navs = []
      if (cate && cate.name) {
        navs = [
          {url: '/', name: '首页'},
          {url: '', name: cate.name || ''}
        ]
      }
      this.$store.commit('setBreadCrumbNav', navs)
      if (cate && cate.alias) {
        let menu = {
          alias: cate.alias,
          name: cate.name,
          url: '/Categorys/' + cate.alias
        }
        this.$store.commit('setCurrentMenu', menu)
      } else {
        this.$store.commit('setCurrentMenu', {alias: ''})
      }
    },
    getGoods () {
      let self = this
      let currentCateAlias = this.currentCateAlias
      if (!self.currentCateAlias) {
        return
      }
      self.$ajax.get('/goods/root-category/' + currentCateAlias)
      .then(function (response) {
        if (!response || response.data.error) {
          self.$router.replace({name: 'error'})
          return
        }
        if (response && Array.isArray(response.data.data)) {
          let cateInfo = response.data.cateInfo
          self.categorys = response.data.data || []
          self.setCurrentMenu(cateInfo)
        } else {
          self.$router.replace({name: 'noPage'})
        }
      })
      .catch(function (error) {
        console.log('error', error)
        self.$router.replace({name: 'error'})
      })
    }
  },
  components: {
    goodsBannerList
  }
}
</script>

<style scoped>
.cate-header{
  width: 100%;
  height: 80px;
  background-repeat: no-repeat;
  background-position: center;
  background-origin:center;
  background-color:darkgray;
  font-size: 1.5rem;
  padding:20px;
}
</style>
