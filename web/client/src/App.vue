<template>
  <div id="app" v-cloak>
    <header class="m-header">
      <my-header></my-header>
    </header>
    <main>
      <div class="m-content">
        <div class="breadcrumbs">
          <bread-crumb-nav :links="breadCrumbs"></bread-crumb-nav>
        </div>
        <section class="container">
          <router-view></router-view> 
        </section>
      </div>
    </main>
    <my-footer></my-footer>
  </div>
</template>

<script>
import myHeader from './components/en-header.vue'
import myFooter from './components/en-footer.vue'
import breadCrumbNav from './components/bread-crumb-nav.vue'

export default {
  name: 'app',
  computed: {
    breadCrumbs () {
      return this.$store.state.breadCrumbNav || []
    }
  },
  components: {
    myHeader,
    myFooter,
    breadCrumbNav
  }
}
</script>
<style scoped>
.breadcrumbs{
  line-height: 40px;
  background-color: #eee;
}
</style>
