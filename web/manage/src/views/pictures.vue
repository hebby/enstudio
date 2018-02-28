<template>
  <div>
    <div>
      <el-date-picker
        v-model="filterDateRange"
        type="datetimerange"
        :picker-options="dateShortcuts"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right" 
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="handleFilterChange">
      </el-date-picker>
      <el-switch v-model="filterIsUsed" active-text="已使用" inactive-text="未使用" @change="handleFilterChange"></el-switch>      
    </div>
    <div class="selected-container" v-show="selectedImgs.length > 0">
      <div>
        <span>已选 {{selectedImgs.length}} 个</span>
        <el-button type="primary" size="mini" @click="switchAddProduct">插入产品</el-button>
      </div>
      <ul class="selected-imgs-wrap">
        <li v-for="(item, index) in selectedImgs" :key="index" class="selected-imgs-cell">
          <i class="el-icon-remove img-remove" v-show="item.checked" @click="handleRemoveItem(item, index)"></i>
          <img :src="baseUrl + item.url" alt="">
        </li>
      </ul>
    </div>
    <div class="list-wrap">
      <ul>
        <li v-for="(item, index) in imgList" :key="index" class="list-item-wrap" :class="item.checked ? 'list-item-wrap-selected' : ''" @click="handleSelected(item)">
          <i class="el-icon-success img-selected" v-show="item.checked"></i>
          <div class="list-item">
            <img :src="baseUrl + item.url" alt="">
          </div>
        </li>
      </ul>
    </div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
const getDefaultDate = function (rangeDays) {
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * rangeDays)
  return [start, end]
}
const PageCount = 24
export default {
  name: 'upload',
  data () {
    let dateShortcuts = {
      shortcuts: [{
        text: '最近三天',
        onClick (picker) {
          let [start, end] = getDefaultDate(3)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近一周',
        onClick (picker) {
          let [start, end] = getDefaultDate(7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近一个月',
        onClick (picker) {
          let [start, end] = getDefaultDate(30)
          picker.$emit('pick', [start, end])
        }
      }]
    }
    let [start, end] = getDefaultDate(30)
    let baseUrl = `${location.origin}/static/uploads`
    return {
      imgList: [],
      selectedImgs: [],
      currentPage: 1,
      total: 0,
      pageSize: PageCount,
      filterIsUsed: false,
      filterDateRange: [start, end],
      dateShortcuts: dateShortcuts,
      baseUrl: baseUrl
    }
  },
  beforeCreate () {
    let self = this
    let breadNavs = [{url: '/', name: '首页'}, {url: '', name: '图片列表'}]
    self.$store.commit('setBreadCrumbNav', breadNavs)
  },
  created () {
    this.getImgList()
  },
  methods: {
    getImgList () {
      let self = this
      let beginDate = self.filterDateRange ? self.filterDateRange[0].getTime() : ''
      let endDate = self.filterDateRange ? self.filterDateRange[1].getTime() : ''
      let params = {
        filters: JSON.stringify({
          isused: self.filterIsUsed,
          beginDate: beginDate,
          endDate: endDate,
          currentPage: self.currentPage,
          pageCount: PageCount
        })
      }
      self.$ajax.get('/manage-pictures/', {params: params})
      .then(function (response) {
        if (response && Array.isArray(response.data.data)) {
          let imgs = response.data.data.map((item) => {
            item.checked = false
            return item
          })
          self.imgList = imgs
          self.total = response.data.imgCount
        }
        self.loading = false
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    switchAddProduct () {
      this.$router.push('/products/add')
      this.$store.commit('setProductPictures', this.selectedImgs)
    },
    _listMapFilter (id, list, callback) {
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].id === id) {
          callback(i, list[i])
          break
        }
      }
    },
    handleCurrentChange (curPage) {
      this.currentPage = curPage
      this.getImgList()
    },
    handleFilterChange () {
      this.getImgList()
    },
    handleSelected (item) {
      if (item.checked) {
        item.checked = false
        let selecteds = this.selectedImgs
        this._listMapFilter(item.id, selecteds, function (index, item) {
          selecteds.splice(index, 1)
        })
      } else {
        item.checked = true
        this.selectedImgs.push(item)
      }
    },
    handleRemoveItem (item, sIndex) {
      let selecteds = this.selectedImgs
      // 更新已选项
      // this._listMapFilter(item.id, selecteds, function (index, item) {
      //   selecteds.splice(sIndex, 1)
      // })
      selecteds.splice(sIndex, 1)
      // 更新列表中已选择的状态
      this._listMapFilter(item.id, this.imgList, function (index, item) {
        item.checked = false
      })
    }
  }
}
</script>
<style scoped>
.selected-container{
  font-size: .9rem;
  font-weight: bold;
  color: #333;
  margin-top: 15px;
}
.selected-imgs-wrap{
  overflow: hidden;
  margin: 20px 0;
  clear: both;
  border-bottom: solid 1px #ccc;
  padding-bottom: 20px;
}
.img-remove{
  position: absolute;
  color: red;
  right: -5px;
  top: -5px;
  z-index: 1;
  font-size: 1.1rem;
  opacity: .8;
  cursor: pointer;
}
.selected-imgs-cell{
  width: 50px;
  height: 50px;
  float: left;
  margin: 5px 10px 0 0;
  border: 1px solid #ccc;
  background-color: #f2f2f2;
  text-align: center;
  position: relative;
}
.list-item-wrap{
  /* box-shadow: inset 0 0 0 3px #fff, inset 0 0 0 7px #0073aa; */
  border: solid 2px transparent;
  float: left;
  margin: 0px 15px 10px 0px;
  position: relative;
}
.list-item-wrap:hover{
  border-color: #67c23a;
}
.list-item-wrap-selected{
  border-color: #67c23a;
}
.img-selected{
  color: #67c23a;
  position: absolute;
  right: -4px;
  top: -4px;
  z-index: 1;
  font-size: 1.3rem;
}
.el-range-editor{
  margin-right: 30px;
}
.el-pagination{
  text-align: center;
}
.list-wrap{
  margin: 20px 0 10px;
  overflow: auto;
  padding: 5px 0;
}
.list-item{
  position: relative;
  height: 100px;
  width: 100px;
  border: 1px solid #ccc;
  float: left;
  line-height: 100px;
  text-align: center;
  background-color: #eee;
  cursor: pointer;
  overflow: hidden;
}
.list-item img, .selected-imgs-cell img{
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
</style>