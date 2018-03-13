<template>
  <div class="goods-list">
    <div class="good-item" v-for="(item, index) in goods" :key="index" @click="handleItemOpen(item)">
      <div class="good-img-wrap">
        <img v-lazy="baseUrl + item.mainPictureUrl" :alt="item.title">
      </div>
      <div class="good-title"><a>{{item.title}}</a></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'goods-thumbnail',
  props: ['goods'],
  data () {
    let basePictureUrl = this.pictureBaseUrl
    return {
      baseUrl: basePictureUrl
    }
  },
  methods: {
    handleItemOpen (item) {
      this.$router.push({ path: `/detail/${item.pid}` })
    }
  }
}
</script>