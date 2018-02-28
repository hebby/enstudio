
<template>
  <ol class="container crumb-links" v-if="links.length > 0">
    <li v-for="(item, index) in links" :key="index">
      <span v-if="index + 1 < links.length" class="crumb-link">
        <a @click="switchUrl(index, item.url)">{{item.name}}</a>
        <i class="arrow-right arr-split"></i>
      </span>
      <template v-else>{{item.name}}</template>
    </li>
  </ol>
</template>

<script>
export default {
  props: ['links'],
  data () {
    return {}
  },
  methods: {
    switchUrl (index, url) {
      let navs = this.$store.state.breadCrumbNav
      if (index === 0) {
        navs = []
      } else {
        navs.splice(index + 1)
      }
      this.$store.commit('setBreadCrumbNav', navs)
      this.$router.push(url)
    }
  }
}
</script>
<style scoped>
.crumb-links{
  height: 40px;
}
.crumb-links li{
  display: inline-block;
  padding-right: 10px;
  color: #b6b6b6;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  max-width: 10rem;
}
.crumb-links a{
  color: #b6b6b6;
}
.arr-split {
  color: #b6b6b6;
  padding-left: 18px;
}
.crumb-links a:hover{
  text-decoration: underline;
  color: #666664;
}
</style>


