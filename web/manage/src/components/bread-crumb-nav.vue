<template>
    <div class="header_container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: nav.url }" v-for="(nav, index) in navList" :key="index">
                {{nav.name}}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link header-user">
                {{loginName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import myCookie from '../lib/cookie'
export default {
  computed: {
    navList () {
      return this.$store.state.breadCrumbNavs || []
    },
    loginName () {
      let name = this.$store.state.loginName || ''
      if (!name) {
        name = myCookie.get('name') || ''
      }
      return name
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        this.$store.commit('setLoginName', '')
        myCookie.clearMutilKeys(['uid', 'name'])
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
    .header_container {
        background-color: #eff2f7;
        height: 60px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding-left: 20px;
    }
    .header-user{
        margin-right: 30px;
        font-weight: bold;
    }
</style>
