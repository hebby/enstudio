
<template>
  <div>
    <div class="header-top">
      <h1 class="logo"><a @click="switchPage" class="logo-link" title="EN STUDIO">EN STUDIO</a></h1>
    </div>
    <nav class="header-nav">
      <div class="container nav-search-container">
        <my-menu></my-menu>
        <div class="search-container">
          <input class="search-ipt" id="searchIpt" ref="searchIpt" type="text" v-model="keyword" @keyup.enter="handleSearch()" placeholder="请输入商品关键字" autocomplete='off'>
          <a class="search-link" @click="handleSearch()">
              <svg version="1.1" x="0px" y="0px" viewBox="0 0 7.2 7.2" xml:space="preserve" aria-labelledby="search-form0" role="img" class="currentColor">
              <title>搜索</title>
                  <path d="M6.964,6.506L5.22,4.762C5.175,4.717,5.109,4.704,5.04,4.701
                  c0.357-0.469,0.578-1.047,0.578-1.682c0-1.539-1.247-2.786-2.786-2.786c-1.539,0-2.786,1.248-2.786,2.786s1.247,2.786,2.786,2.786
                  c0.669,0,1.274-0.245,1.754-0.638C4.593,5.229,4.61,5.289,4.652,5.331l1.744,1.744C6.519,7.199,6.84,7.154,6.964,7.03
                  C7.087,6.906,7.087,6.63,6.964,6.506z M2.879,4.95c-1.083,0-1.961-0.878-1.961-1.961s0.878-1.961,1.961-1.961
                  c1.083,0,1.961,0.878,1.961,1.961S3.962,4.95,2.879,4.95z"></path>
              </svg>
          </a>
        </div>
      </div>
    </nav>
    <div class="m-search-box" ref="mSearchBox">
       <input class="min-search-ipt"  id="mSearchIpt" type="text" v-model="keyword" @keyup.enter="openMiniSearch()" placeholder="请输入商品关键字" autocomplete='off'>
       <button class="search-btn" @click="openMiniSearch">搜索</button>
    </div>
</div>
</template>

<script>
import myMenu from './menu.vue'
export default {
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    switchPage () {
      this.$store.commit('setBreadCrumbNav', [])
      this.$store.commit('setCurrentMenu', {
        index: -2,
        name: '',
        url: '/'
      })
      this.$router.push('/')
    },
    handleSearch () {
      let searchIpt = this.$refs.searchIpt
      let miniSearchIpt = this.$refs.mSearchBox
      if (searchIpt.offsetHeight === 0) {
        miniSearchIpt.style.display = miniSearchIpt.offsetHeight > 0 ? 'none' : 'flex'
        document.getElementById('mSearchIpt').focus()
        return
      }
      this.openMiniSearch()
    },
    openMiniSearch () {
      let keyword = this.keyword.trim()
      if (!keyword) {
        return
      }
      this.$router.push({path: '/search', query: {q: this.keyword}})
      this.keyword = ''
      let miniSearchIpt = this.$refs.mSearchBox
      if (miniSearchIpt.offsetHeight > 0) {
        miniSearchIpt.style.display = 'none'
      }
    }
  },
  components: {
    myMenu
  }
}
</script>


