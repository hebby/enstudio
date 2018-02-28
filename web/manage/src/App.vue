<template>
  <div id="app" class="fillcontain">
    <template v-if="hasPageFrame">
      <side-menu></side-menu>      
      <main class="fillcontain">
        <bread-crumb-nav></bread-crumb-nav>
        <section class="content">
            <router-view></router-view>
        </section>
      </main>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import sideMenu from './components/side-menu.vue'
import breadCrumbNav from './components/bread-crumb-nav.vue'

export default {
  name: 'app',
  computed: {
    hasPageFrame () {
      return this.$store.state.hasPageFrame || false
    }
  },
  components: {
    sideMenu,
    breadCrumbNav
  }
}
</script>

<style>
body {
  margin: 0;
}
body, html {
  height: 100%;
  width: 100%;
}
.fillcontain{
  width: 100%;
  min-height: 100vh;
}
ul {
  margin: 0;
  list-style: none;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
}
.content {
  padding: 20px;
  width: 80%;
  margin: 20px auto;
}
.main-title{
  font-size: 1.5rem;
  text-align: center;
}

h1 {
  font-size: 1.5rem;
}
a {
  color: #000;
  text-decoration: none;
}
</style>
