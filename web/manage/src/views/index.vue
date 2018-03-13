<template>
  <div>
    <div v-show="loading" class="loading">
      加载中...
    </div>
    <div class="container" v-show="!loading">
      <section>
        <div class="title">产品类型数量 统计</div>
        <ve-pie :data="chartCount.data" :settings="chartCount.settings"></ve-pie>
      </section>
      <section>
        <div class="title">产品类型浏览量统计</div>
        <ve-histogram :data="chartView.data" :settings="chartView.settings"></ve-histogram>
      </section>
    </div>
  </div>
</template>
<style scoped>
  .container{
    max-width: 60%;
    min-width: 200px;
  }
  .title{
    font-size: 1.3rem;
    line-height: 3;
  }
  .loading{
    text-align: center;
  }
</style>
<script>
  export default {
    beforeCreate () {
      this.$store.commit('setBreadCrumbNav', [{url: '/', name: '首页'}])
    },
    data () {
      return {
        loading: true,
        chartView: {
          data: {},
          settings: {}
        },
        chartCount: {
          data: {},
          settings: {}
        }
      }
    },
    created: function () {
      this.getChartData()
    },
    methods: {
      getBaseData (data) {
        return data.map((item) => {
          return {
            'name': item['parent_name'] + '-' + item['name'],
            'total': item['total']
          }
        })
      },
      getChartData () {
        let self = this
        self.$ajax.get('/statistics/')
        .then(function (response) {
          if (response && Array.isArray(response.data.data)) {
            let result = response.data.data
            self.chartView = {
              data: {
                columns: ['name', 'total'],
                rows: self.getBaseData(result[0])
              },
              setting: {
                labelMap: {
                  resume: '类型',
                  uplevel: '商品查阅量'
                }
              }
            }
            self.chartCount = {
              data: {
                columns: ['name', 'total'],
                rows: self.getBaseData(result[1])
              },
              setting: {
                labelMap: {
                  dimension: '类型',
                  metrics: '商品总数'
                }
              }
            }
          }
          self.loading = false
        })
        .catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>