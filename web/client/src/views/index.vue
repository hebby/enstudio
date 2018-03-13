<template>
  <div class="content-wrapper">
    <swiper :options="swiperOption" v-if="banners.length > 0">
      <swiper-slide v-for="banner in banners" :key="banner.id" 
        :style="getBannerStyle(banner.pictureUrl)">
        <div class="banner-content" @click="onBannerClick(banner.linkUrl)">
          <div class="title swiper-text">{{banner.title}}</div>
          <div class="subtitle swiper-text">{{banner.subTitle}}</div>  
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div v-show="!loadding" class="main-lists">
      <goods-banner-list :goods="recommendGoods" v-show="recommendGoods"></goods-banner-list>
      <goods-banner-list :goods="hotGoods" v-show="hotGoods"></goods-banner-list>
    </div>
  </div>
</template>

<script>
import goodsBannerList from '../components/goods-banner-list.vue'
import Loading from '../components/loading.vue'
import mixin from '../mixin/index'
export default {
  name: 'hot',
  mixins: [mixin],
  data () {
    let basePictureUrl = this.pictureBaseUrl
    let defaultGoods = {
      bar: {},
      data: []
    }
    return {
      hotGoods: defaultGoods,
      recommendGoods: defaultGoods,
      loadding: false,
      banners: [],
      baseUrl: basePictureUrl,
      swiperOption: {
        speed: 800,
        loop: true,
        autoplay: {
          delay: 3000
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  created () {
    this.$store.commit('setBreadCrumbNav', [])
    this.getBanners()
    this.getHotGoods()
    this.getRecommendGoods()
  },
  methods: {
    go (id) {
      this.$router.push({
        path: 'article',
        query: {
          id: id
        }
      })
    },
    getBanners () {
      let self = this
      self.$get('/goods/banners/', (response) => {
        if (response && response.data && Array.isArray(response.data.data)) {
          self.banners = response.data.data || []
        }
      })
    },
    getHotGoods () {
      let self = this
      self.$get('/goods/hot/10/', (response) => {
        if (response && response.data && Array.isArray(response.data.data)) {
          self.hotGoods = {
            bar: {
              name: '热门',
              alias: 'hot',
              moreLinkText: '全部热门'
            },
            data: response.data.data
          }
        } else {
          if (!self.hotGoods) {
            self.hotGoods = null
          }
        }
      })
    },
    getRecommendGoods () {
      let self = this
      self.$get('/goods/recommend/10/', (response) => {
        if (response && response.data.data && Array.isArray(response.data.data)) {
          self.recommendGoods = {
            bar: {
              name: '推荐', // 商品
              alias: 'recommend',
              moreLinkText: '全部推荐'
            },
            data: response.data.data
          }
        } else {
          if (!self.recommendGoods) {
            self.recommendGoods = null
          }
        }
      })
    },
    getBannerStyle (image) {
      return {backgroundImage: 'url(' + this.baseUrl + image.replace('/thumbnail-en-studio-', '/en-studio-') + ')'}
    },
    onBannerClick (url) {
      window.location.href = url
    }
  },
  components: {
    goodsBannerList,
    Loading
  }
}
</script>

<style>
.content-wrapper{
  padding-top: 5px;
}
.main-lists{
  margin-top: 10px;
}
.swiper-slide {
  background-position: center;
  background-size: cover;
  height: 15rem !important;
  position: relative;
}
.swiper-pagination-bullet{
  background-color: #777 !important;
}
.swiper-pagination-bullet-active {
  background-color: #777 !important;
}
.banner-content {
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 7rem;
  width: 100%;
  height: 100%;
}
.swiper-text {
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 90%;
  line-height: 1.5;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.swiper-slide .title {
  font-size: 2.2rem;
  font-weight: 300;
}
.swiper-slide .subtitle {
  font-size: 1.3rem;
}
</style>
