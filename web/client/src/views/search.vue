<template>
  <div>
    <div class="search-result">
      <span class="search-key-text">{{total}}</span> 个搜索结果 <span class="search-key-text">"{{searchKey}}"  </span>
    </div>
    <goods-thumbnail :goods="goods"></goods-thumbnail>
  </div>
</template>

<script>
import Vue from 'vue'
import goodsThumbnail from '../components/goods-thumbnail.vue'
export default {
  name: 'search',
  data () {
    return {
      goods: [],
      searchKey: '',
      currentPage: 1,
      pageCount: 20,
      total: 0,
      pageFlag: {
        position: 0
      }
    }
  },
  created () {
    let keyword = this.$route.query.q
    this.searchKey = keyword
    this.getListByPage()
  },
  mounted () {
    Vue.nextTick().then(() => {
      let handleScroll = this.handleScroll
      window.addEventListener('scroll', handleScroll)
    })
  },
  beforeDestroy () {
    let handleScroll = this.handleScroll
    window.removeEventListener('scroll', handleScroll)
  },
  beforeRouteUpdate (to, from, next) {
    this.searchKey = to.query.q
    this.goods = []
    this.getListByPage()
    next()
  },
  methods: {
    handleScroll () {
      let height = document.body.clientHeight
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let windowH = window.innerHeight
      let currentScrollH = scrollTop + windowH

      if (currentScrollH > height - 5 && (this.pageFlag.position === 0 || (this.pageFlag.position > 0 && Math.abs(currentScrollH - this.pageFlag.position) > 20))) {
        if (this.currentPage === Math.ceil(this.total / this.pageCount)) {
          return
        }
        this.pageFlag.position = currentScrollH
        this.pageFlag.cate = this.goodsCate
        this.currentPage++
        this.getListByPage()
      }
    },
    getListByPage () {
      let self = this
      self.$ajax.get('/goods/search/' + encodeURIComponent(self.searchKey), {
        params: {
          currentPage: self.currentPage,
          pageCount: self.pageCount
        }
      })
      .then(function (response) {
        if (!response || response.data.error) {
          self.$router.replace({name: 'error'})
          return
        }
        if (!response || !response.data.data.hasOwnProperty('goods')) {
          if (self.total === 0) {
            // self.total = 0
            // self.goods = []
          }
        } else {
          let result = response.data.data
          self.goods = self.goods.concat(result.goods)
          self.total = result.totalCount
        }
      })
      .catch(function (error) {
        console.log(error)
        self.$router.replace({name: 'error'})
      })
    }
  },
  components: {
    goodsThumbnail
  }
}
</script>

<style scoped>
.search-result {
  font-size: 2rem;
  line-height: 5.5rem;
  color: #000;
  margin: 0 8px;
  transition: font-size 0.5s ease, line-height 0.5s ease;
}
.search-key-text {
  color: #a5a5aa;
  font-weight: bold;
}
@media screen and (max-width: 768px){
  .search-result{
    font-size: 1.3rem;
    line-height: 3.5rem;
  }
}
</style>