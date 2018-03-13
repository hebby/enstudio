<template>
  <ul class="en-nav">
    <li>
      <a title='推荐' @click='onMenuClick("/goods/recommend", "推荐", -1)' 
        :class="currentMenu.alias === 'recommend' ? 'nav-selected' : ''">推荐</a>
    </li>
    <li v-for="(m,index) in menus" :key="index">
      <a :title='m.name' @click='onMenuClick(m.alias, m.name, index)' 
        :class="currentMenu.alias === m.alias ? 'nav-selected' : ''">{{m.name}}</a>
    </li>
    <!-- <li>
      <router-link :to="{ name: 'about'}">联系我们</router-link>
    </li> -->
  </ul>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  computed: {
    currentMenu () {
      return this.$store.state.currentMenu
    }
  },
  created () {
    let self = this
    this.$ajax.get('/goods/categorys')
    .then(function (response) {
      if (response && Array.isArray(response.data.data)) {
        self.menus = response.data.data
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  methods: {
    onMenuClick (url, name, index) {
      let routeUrl = index === -1 ? '/goods/recommend/' : '/category/' + url + '/'
      if (url) {
        this.$router.push(routeUrl)
      }
    }
  }
}
</script>

<style scoped>
.en-nav{
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  flex: 2;
  margin-left: -10px;
}
.en-nav > li{
  padding: 0 15px;
}
.en-nav li a{
  display: block;
  line-height: 45px;
  height: 45px;
  font-size: 1.1rem;
  margin: 0 5px;
  color: #fff;
  letter-spacing: .3rem;
  padding-left: 2px;
}
.en-nav li a:hover{
  border-bottom: solid 3px #fff;
}
.en-nav li a:link{
  color: #fff;
}
.nav-selected {
  border-bottom: solid 3px #fff;
}
@media only screen and (max-width: 1024px){
  .en-nav {
    margin-left: -5px;
  }
  .en-nav > li{
    padding: 0 5px;
  }
  .en-nav li a{
    font-size: 1rem;
  }
}
@media only screen and (max-width: 450px){
  .en-nav{
    flex: 3;
  }
}
</style>
