<template>
<div>
  <div class="tb-filter">
    <el-select class="form-ipt" v-model="filter.postStartDate" placeholder="请选择时间" @change="handleFilterChange">
      <el-option :label="date.name" v-for="(date, index) in rangDates" :key="index"  :value="date.value"></el-option>
    </el-select>
    <el-select class="form-ipt" v-model="filter.isRecommend" placeholder="请选择推荐状态" @change="handleFilterChange">
      <el-option label="推荐不限" value=""></el-option>
      <el-option label="已推荐" value="1"></el-option>
      <el-option label="未推荐" value="0"></el-option>
    </el-select>
    <el-select class="form-ipt" placeholder="请选择商品类别" v-model="filter.categories" @change="handleFilterChange" multiple filterable allow-create default-first-option>
      <el-option-group
        v-for="group in allCategories"
        :key="group.cate_id"
        :label="group.name">
        <el-option
          v-for="item in group.children"
          :key="item.cate_id"
          :label="item.name"
          :value="item.cate_id">
        </el-option>
      </el-option-group>
    </el-select>
    <el-input class="form-ipt" v-model="filter.title" placeholder="请输入商品关键字"></el-input>
    <el-button type="primary" @click="handleFilterChange">搜索</el-button>
  </div>
  <el-table v-loading="loading" :data="goods" style="width: 100%">
    <el-table-column label="封面图">
      <template scope="scope">
        <div class="main-pic"><img :src="baseUrl + scope.row.mainPictureUrl" alt=""></div>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="商品名称" width="180"></el-table-column>
    <el-table-column prop="categories" label="类别" width="180"></el-table-column>
    <el-table-column prop="viewCount" label="查阅量" width="180"></el-table-column>
    <el-table-column label="是否推荐">
      <template scope="scope">{{scope.row.isRecommend === 1 ? '是' : '否'}}</template>
    </el-table-column>
    <el-table-column label="是否禁用">
      <template scope="scope">
        <span :class="scope.row.disabled === 1 ? 'disabled-text' : ''">
          {{scope.row.disabled === 1 ? '是' : '否'}}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <el-button size="mini" @click="switchToModify(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="pager-wrap"
    background
    layout="total, prev, pager, next"
    @current-change="handleCurrentChange"
    :current-page.sync="currentPage"
    :page-size="pageSize"
    :total="total">
  </el-pagination>
</div>
</template>
<style scoped>
.tb-filter {
  display: flex;
  border-bottom: 1px solid #d8d8d8;
  padding-bottom: 10px;
  justify-content: center;
}
.form-ipt {
  width: 20%;
  min-width: 150px;
  margin-right: 10px;
}
.pager-wrap {
  text-align: center;
  margin-top: 20px;
}
.disabled-text{
  color: #e6a23c;
}
.main-pic{
  width: 50px;
  height: 50px;
}
.main-pic img{
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
</style>

<script>
  const PageCount = 10
  let baseUrl = `${location.origin}/static/uploads`
  export default {
    data () {
      let self = this
      let endDates = [
        {name: '时间不限', value: ''},
        {name: '一月内', value: self._getRangeDate(30)},
        {name: '三月内', value: self._getRangeDate(90)},
        {name: '一年内', value: self._getRangeDate(365)}
      ]
      return {
        loading: true,
        filter: {
          categories: [],
          title: '',
          isRecommend: '',
          postStartDate: ''
        },
        rangDates: endDates,
        goods: [],
        currentPage: 1,
        total: 0,
        pageSize: PageCount,
        baseUrl: baseUrl,
        allCategories: []
      }
    },
    beforeCreate () {
      let breadNavs = [
        {url: '/', name: '首页'},
        {url: '', name: '商品列表'}
      ]
      this.$store.commit('setBreadCrumbNav', breadNavs)
    },
    created () {
      this._getCategories()
      this.getGoods()
    },
    methods: {
      _getCategories () {
        let self = this
        self.$ajax.get('/manage-categories/')
        .then(function (response) {
          if (response && Array.isArray(response.data.data)) {
            self.allCategories = response.data.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      _getRangeDate (rangeDays) {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * rangeDays)
        return start
      },
      getGoods () {
        let self = this
        let filters = self.filter
        let startDate = self.postStartDate ? self.postStartDate[0].getTime() : ''
        let params = {
          filters: JSON.stringify({
            cateIds: filters.categories,
            title: filters.title,
            isRecommend: filters.isRecommend,
            postStartDate: startDate,
            currentPage: self.currentPage,
            pageCount: PageCount
          })
        }
        self.$ajax.get('/manage-products/', {params: params})
        .then(function (response) {
          if (response && Array.isArray(response.data.data)) {
            self.goods = response.data.data
            self.total = response.data.goodsCount
          }
          self.loading = false
        })
        .catch(function (error) {
          console.log(error)
          self.loading = false
        })
      },
      handleFilterChange () {
        this.getGoods()
      },
      handleCurrentChange (curPage) {
        this.currentPage = curPage
        this.getImgList()
      },
      switchToModify (item) {
        // this.$store.commit('setEditProductInfo', this.goods)
        this.$router.push('/product/' + item.id)
      }
    }
  }
</script>