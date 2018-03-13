<template>
  <div>
    <div class="tool-bar">
      <el-button size="mini" type="primary" @click="add()">添加</el-button>
    </div>
    <el-table v-loading="loading" :data="banners" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="subTitle" label="副标题" width="300"></el-table-column>
      <el-table-column label="广告链接">
        <template scope="scope">
          <span><a :href="scope.row.linkUrl" class="tb-cell-link" target="_blank">广告链接</a></span>
        </template>
      </el-table-column>    
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  // import common from '../lib/common'
  export default {
    data () {
      return {
        loading: true,
        banners: []
      }
    },
    beforeCreate () {
      let self = this
      let breadNavs = [{url: '/', name: '首页'}, {url: '', name: '广告栏位列表'}]
      self.$store.commit('setBreadCrumbNav', breadNavs)
    },
    mounted () {
      this.initData()
    },
    methods: {
      // 获取广告数据
      initData () {
        let self = this
        self.$ajax.get('/manage-banners/')
        .then(function (response) {
          if (response && Array.isArray(response.data.data)) {
            self.banners = response.data.data
          }
          self.loading = false
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      edit (row) {
        this.$router.push('/banner/' + row.id)
      },
      add () {
        this.$router.push('/banners/add/')
      }
    }
  }
</script>
<style>
.tool-bar{
  margin-bottom: 15px;
  text-align: right;
}
.el-table th{
  background-color: #f2f2f2;
}
.tb-cell-link{
  text-decoration: underline;
}
</style>
