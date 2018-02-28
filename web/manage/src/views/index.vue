<template>
  <div>
    <h1>index page</h1>
  </div>
</template>
<script>
  export default {
    beforeCreate () {
      this.$store.commit('setBreadCrumbNav', [{url: '/', name: '首页'}])
    }
  }
</script>