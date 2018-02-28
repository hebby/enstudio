
<template>
<div>
  <p class="main-title">新增用户</p>
  <el-form class="user-form" :model="userInfo" status-icon :rules="userRole" ref="userInfo" label-width="100px">
    <el-form-item label="登录名" prop="name">
      <el-input v-model="userInfo.name"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password" required>
      <el-input type="password" v-model="userInfo.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPassword" required>
      <el-input type="password" v-model="userInfo.checkPassword" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="email" prop="email">
      <el-input v-model="userInfo.email" type="email"></el-input>
    </el-form-item>
    <el-form-item label="管理员" prop="isAdmin">
      <el-switch v-model="userInfo.isAdmin"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitUser('userInfo')">提交</el-button>
      <el-button @click="resetForm('userInfo')">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<style>
  .user-form{
    width: 80%;
  }
</style>

<script>
  import common from '../lib/common'
  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6 || value.length > 20) {
          callback(new Error('密码须为 6 到 20 个字符'))
        } else {
          if (this.userRole.checkPassword !== '') {
            this.$refs.userInfo.validateField('checkPassword')
          }
          callback()
        }
      }
      var validateComPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userInfo.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userInfo: {
          name: '',
          password: '',
          checkPassword: '',
          email: '',
          isAdmin: true
        },
        userRole: {
          name: [
            { required: true, message: '请输入登录名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPassword: [
            { validator: validateComPassword, trigger: 'blur' }
          ]
        }
      }
    },
    beforeCreate () {
      let breadNavs = [
        {url: '/', name: '首页'},
        {url: '/users/', name: '用户列表'},
        {url: '/user/', name: '新增用户'}
      ]
      this.$store.commit('setBreadCrumbNav', breadNavs)
    },
    methods: {
      submitUser (formName) {
        let self = this
        self.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          }
          let userInfo = {
            name: self.userInfo.name,
            password: self.userInfo.password,
            email: self.userInfo.email,
            isAdmin: self.userInfo.password
          }
          let params = common.convertUrlParams({
            user: JSON.stringify(userInfo)
          })
          self.$ajax.post('/user/', params)
          .then(function (response) {
            let resData = response.data
            if (resData.code) {
              self.$message.error(resData.error || '')
              return
            }
            self.$message({
              message: '恭喜，注册成功！',
              type: 'success'
            })
            self.$router.push('/users/')
          })
          .catch(function (error) {
            console.log(error)
          })
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>