<template>
  <section>
    <div class="cate-bar" v-if="goods.data.length > 0">
      <div class="bar-title">{{goods.bar.name}}</div>
      <div>
        <a @click="switchPage(goods.bar)" class="bar-more">
          {{goods.bar.moreLinkText ? goods.bar.moreLinkText : "全部" + goods.bar.name}} 
          <i class="arrow-right"></i>
        </a>
      </div>
    </div>
    <goods-thumbnail :goods="goods.data || []"></goods-thumbnail>
  </section>
</template>

<script>
import goodsThumbnail from '../components/goods-thumbnail.vue'
export default {
  name: 'goods-banner-list',
  props: {
    goods: {
      type: Object,
      default: function () {
        return {
          bar: {},
          data: []
        }
      }
    }
  },
  components: {
    goodsThumbnail
  },
  methods: {
    switchPage (bar) {
      this.$router.push('/goods/' + bar.alias)
    }
  }
}
</script>

<style scoped>
.cate-bar{
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px #e1e1e1;
  padding: 14px 8px;
  margin-bottom: 10px;
}
.bar-title{
  font-weight: bold;
  font-size: 1.2rem;
}
/* .bar-more:after{
  border-top: solid 1px #000;
  border-right: solid 1px #000;
  width: 20px;
  height: 20px;
  transform: rotate(45deg)
} */
</style>
