<template>
  <div class="login-page">
    <form>
        <div class="form-container">
            <div class="login-title">EN STUDIO 后台管理系统</div>
            <div class="form-item">
                <div class="form-item-input">
                    <input type="text" autocomplete="off" placeholder="用户名" v-model="name">
                </div>
                <div class="form-item-error"></div>
            </div>
            <div class="form-item">
                <div class="form-item-input">
                    <input autocomplete="off" placeholder="密码" type="password" v-model="password"  @keyup.enter="onLogin">
                </div>
                <div class="form-item-error"></div>
            </div>
            <div class="form-item">
                <button type="button" class="button login-submit-btn button-primary" @click="onLogin">
                    <span>登陆</span>
                </button>
            </div>
        </div>
    </form>
  </div>
</template>

<script>
import common from '../lib/common'
import myCookie from '../lib/cookie'
// import md5 from '../lib/md5'
export default {
  data () {
    return {
      name: '',
      password: ''
    }
  },
  created: function () {
    this.clearLoginInfo()
  },
  methods: {
    clearLoginInfo () {
      myCookie.clearMutilKeys(['uid', 'name'])
    },
    onLogin () {
      let self = this
      let params = common.convertUrlParams({
        'name': self.name.trim(),
        // 'password': md5.md5(self.password.trim())
        'password': self.password.trim()
      })
      self.$ajax.post('/signin/', params)
      .then(function (response) {
        if (!response.data.data) {
          self.$message.error(response.data.error || '')
          self.clearLoginInfo()
          return
        } else {
          myCookie.setMutilValues(response.data.data)
          self.$store.commit('setLoginName', response.data.data.name)
          self.$router.push('/')
        }
      })
      .catch(function (error) {
        self.clearLoginInfo()
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.login-page {
  background-color: #324057 !important;
  width: 100%;
  min-height: 100vh;
}
.login-title {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 20px;
}
.form-container {
  width: 320px;
  height: 220px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -160px;
  padding: 35px 25px 30px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
}
.form-item-error {
  color: #ff4949;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  bottom: -15px;
  left: 5px;
}
.form-item {
  margin-bottom: 25px;
  position: relative;
}
.form-item-input {
  line-height: 36px;
  width: 100%;
}
.form-item-input input {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c4c4c4;
  color: #1f2d3d;
  margin: 0;
  padding: 10px 15px;
  border-radius: 4px;
}
.button-primary {
  color: #fff;
  background-color: #20a0ff;
  border-color: #20a0ff;
}
.login-submit-btn {
  width: 100%;
  font-size: 16px;
}
.button-primary:hover {
  opacity: 0.8;
}
</style>