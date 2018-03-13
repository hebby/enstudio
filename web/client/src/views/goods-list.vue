<template>
  <div>
    <!-- <div class="search-result">
      <span class="search-key-text">{{total}}</span>
    </div> -->
    <goods-thumbnail :goods="goods"></goods-thumbnail>
  </div>
</template>

<script>
import Vue from 'vue'
import goodsThumbnail from '../components/goods-thumbnail.vue'
export default {
  name: 'goods',
  data () {
    return {
      goods: [],
      goodsCate: '',
      currentPage: 1,
      pageCount: 30,
      total: 0,
      pageFlag: {
        position: 0,
        cate: ''
      }
    }
  },
  created () {
    let goodsCate = this.$route.params.name
    this.goodsCate = goodsCate
    if (goodsCate) {
      this.getListByPage()
    }
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
  methods: {
    handleScroll () {
      let height = document.body.clientHeight
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let windowH = window.innerHeight
      let currentScrollH = scrollTop + windowH

      // 子控件不缓存的情况是不存在的
      if (this.pageFlag.cate && this.pageFlag.cate !== this.goodsCate) {
        this.pageFlag.position = 0
      }
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
    setCurrentMenu (cate) {
      let navs = []
      let gcate = this.goodsCate
      if (gcate === 'recommend' || gcate === 'hot') {
        this.$store.commit('setBreadCrumbNav', [
          {url: '/', name: '首页'},
          {url: '', name: gcate === 'recommend' ? '推荐' : '热门'} // 商品
        ])
        this.$store.commit('setCurrentMenu', {
          alias: gcate === 'recommend' ? gcate : '',
          name: gcate,
          url: '/Categorys/' + gcate
        })
        return
      }
      if (cate && cate.rootName) {
        navs = [
          {url: '/', name: '首页'},
          {url: '/category/' + cate.rootAlias, name: cate.rootName || ''},
          {url: '', name: cate.name}
        ]
        this.$store.commit('setBreadCrumbNav', navs)
      }
      if (cate && cate.rootAlias) {
        let menu = {
          alias: cate.rootAlias,
          name: cate.rootName,
          url: '/Categorys/' + cate.rootAlias
        }
        this.$store.commit('setCurrentMenu', menu)
      }
    },
    getListByPage () {
      let self = this
      self.$ajax.get('/goods/category/' + encodeURIComponent(self.goodsCate), {
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
            self.total = 0
            self.goods = []
          }
        } else {
          let result = response.data.data
          self.goods = self.goods.concat(result.goods)
          self.total = result.totalCount
          if (self.currentPage === 1) {
            self.setCurrentMenu(result.cateInfo)
          }
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
  font-size: 1.2rem;
  color: #888;
}
.search-key-text {
  color: #a5a5aa;
  font-weight: bold;
}
</style>