<template>
  <div class="el-col-4 full-height">
    <el-menu
      default-active="2"
      class="nav"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item @click="onMemuClick('/')" index="0">
          <i class="el-icon-news"></i>
          <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-goods"></i>
          <span>商品管理</span>
        </template>
        <el-menu-item index="1-1" @click="onMemuClick('/products/add')">添加商品</el-menu-item>
        <el-menu-item index="1-2" @click="onMemuClick('/products')">商品列表</el-menu-item>
      </el-submenu>
      <el-menu-item v-for="(item, index) in menus" :key="index" @click="onMemuClick(item.url)" :index="item.url">
          <i :class="item.icon"></i>
          <span slot="title">{{item.title}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menus: [
        {icon: 'el-icon-menu', url: '/banners', title: '广告栏位管理'},
        {icon: 'el-icon-setting', url: '/categories', title: '分类管理'},
        {icon: 'el-icon-picture', url: '/pictures/add', title: '上传图片'},
        {icon: 'el-icon-service', url: '/users', title: '用户管理'}
      ]
    }
  },
  methods: {
    onMemuClick (url) {
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
.el-menu-item{
  min-width: 150px;
}
.nav{
  min-width: 150px;
  height: 100%;
}
.full-height{
  min-height: 100%;
}
</style>
