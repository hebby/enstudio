<template>
  <div>
    <div class="tool-bar">
      <el-button
            size="mini" type="primary"
            @click="addUser()">添加</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="users" border
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="登录名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="Email"
        width="180">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template scope="scope">{{scope.row.userStatus.toString() === '1' ? '正常' : '禁用'}}</template>
      </el-table-column>
      <el-table-column
        label="用户角色">
        <template scope="scope">{{scope.row.userRole === 0 ? '管理员' : '普通用户'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <!-- <el-button
            size="mini"
            @click="modifyUser(scope.$index, scope.row)">编辑</el-button> -->
          <el-button
            size="mini"
            :type="scope.row.userStatus.toString() === '1' ? 'danger' : 'success'"
            @click="disabledUser(scope.$index, scope.row)">{{scope.row.userStatus.toString() === '1' ? '禁用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import common from '../lib/common'
  export default {
    data () {
      return {
        loading: true,
        users: []
      }
    },
    beforeCreate () {
      let self = this
      let breadNavs = [{url: '/', name: '首页'}, {url: '', name: '用户列表'}]
      self.$store.commit('setBreadCrumbNav', breadNavs)
      self.$ajax.get('/manage-users/')
      .then(function (response) {
        console.log(response)
        if (response && Array.isArray(response.data.data)) {
          self.users = response.data.data
        }
        self.loading = false
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    methods: {
      disabledUser (index, row) {
        let self = this
        let status = row['userStatus'] === 1 ? '0' : '1'
        let userInfo = {
          id: row['userId'],
          status: status
        }
        let params = common.convertUrlParams({
          user: JSON.stringify(userInfo)
        })
        console.log('params', userInfo, params)
        self.$ajax.post('/modify-user-status/', params)
        .then(function (response) {
          let resData = response.data
          if (resData.code) {
            self.$message.error(resData.error || '')
            return
          }
          self.$message({
            message: '修改成功！',
            type: 'success'
          })
          row['userStatus'] = status
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      modifyUser (index, row) {
        console.log(index, row)
      },
      addUser () {
        this.$router.push('/user/')
      }
    }
  }
</script>
<style>
.tool-bar{
  margin-bottom: 15px;
  text-align: right;
}
</style>
