<template>
  <div>
    <div class="tool-bar">
      <el-button size="mini" type="success"  @click="cateVisible = true">添加一级分类</el-button>
    </div>
    <section class="cate-section">
      <div v-for="item in cateTree" :key="item['cate_id']">
        <div class="cate-leve-wrap">
          <div class="cate-leve-1">{{item.name}}({{item.alias}})</div>
          <div>
            <el-button @click="setChildCate('add', item)" size="mini" type="success">添加子类</el-button>
            <el-button @click="setChildCate('update', item)" size="mini" type="primary">编辑</el-button>
          </div>
        </div>
        <template v-if="item.children">
          <div v-for="child in item.children" :key="child['cate_id']">
            <div class="cate-leve-wrap sub-cate-line">
              <div class="cate-leve-1">{{child.name}}({{child.alias}})</div>
              <div>
                <!-- <el-button @click="setChildCate('add', child)" size="mini" type="success">添加子类</el-button> -->
                <el-button @click="setChildCate('update', child, item)" size="mini" type="primary">编辑</el-button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
    <el-dialog title="新增类型" :visible.sync="cateVisible">
      <el-form :model="cateInfo" status-icon :rules="cateRole" ref="cateInfo" label-width="100px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="cateInfo.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="cateInfo.alias" auto-complete="off" placeholder="用于构造类型URL，只允许为数字、字母和-"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-input v-model="cateInfo.parentName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch v-model="cateInfo.isDisabled"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import common from '../lib/common'
  export default {
    data () {
      var validateAlias = (rule, value, callback) => {
        var aliasRegex = /[^a-zA-Z0-9-]/g
        if (value === '') {
          callback(new Error('请输入别名'))
        } else if (aliasRegex.test(value)) {
          callback(new Error('别名只允许为数字、字母和-!'))
        } else {
          callback()
        }
      }
      return {
        cateTree: [],
        cateVisible: false,
        currentRootIndex: 0,
        currentIndex: 0,
        selectCateId: 0,
        cateInfo: {
          name: '',
          alias: '',
          parentName: '一级类别',
          parentId: 0,
          isDisabled: false
        },
        cateRole: {
          name: [
            { required: true, message: '请输入类型名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          alias: [
            { validator: validateAlias, trigger: 'blur' }
          ]
        }
      }
    },
    beforeCreate () {
      let self = this
      let breadNavs = [{url: '/', name: '首页'}, {url: '', name: '分类管理'}]
      self.$store.commit('setBreadCrumbNav', breadNavs)
    },
    created () {
      this.loadList()
    },
    watch: {
      cateVisible (val) {
        // 关闭模态窗口时清空表单数据
        if (!val) {
          this.cateInfo = {
            name: '',
            alias: '',
            parentName: '一级类别',
            parentId: 0,
            isDisabled: false
          }
          this.selectCateId = 0
          this.$refs['cateInfo'].resetFields()
        }
      }
    },
    methods: {
      loadList () {
        let self = this
        self.$ajax.get('/manage-categories/')
        .then(function (response) {
          if (response && Array.isArray(response.data.data)) {
            self.cateTree = response.data.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      cancelAdd () {
        this.cateVisible = false
      },
      // 暂只处理两级分类
      setChildCate (type, data, parent) {
        let cate = this.cateInfo
        if (type === 'add') {
          cate.parentId = data.cate_id
          cate.parentName = data.name
        } else {
          cate.name = data.name
          cate.alias = data.alias
          if (data['parent_id'] > 0) {
            cate.parentName = parent.name
            cate.parentId = parent['cate_id']
          }
          cate.isDisabled = data.disabled
          this.selectCateId = data['cate_id']
        }
        this.cateVisible = true
      },
      submit () {
        let self = this
        self.$refs['cateInfo'].validate((valid) => {
          if (!valid) {
            return false
          }
          let cateInfo = {
            name: self.cateInfo.name,
            alias: self.cateInfo.alias,
            parentName: self.cateInfo.parentName,
            parentId: self.cateInfo.parentId,
            isDisabled: self.cateInfo.isDisabled
          }
          let params = common.convertUrlParams({
            Categories: JSON.stringify(cateInfo)
          })
          let reqUrl = this.selectCateId > 0 ? ('/manage-categorie/' + this.selectCateId + '/') : '/manage-categorie/'
          self.$ajax.post(reqUrl, params)
          .then(function (response) {
            let resData = response.data
            if (resData.code) {
              self.$message.error(resData.error || '')
              return
            }
            self.$message({
              message: '数据提交成功！',
              type: 'success'
            })
            // 更新类型列表
            self.loadList()
            self.cateVisible = false
          })
          .catch(function (error) {
            console.log(error)
          })
        })
      }
    }
  }
</script>
<style scoped>
.tool-bar{
  margin-bottom: 15px;
  text-align: right;
}
.cate-leve-1{
  line-height: 1.8;
  flex: 3;
}
.cate-leve-wrap{
  display: flex;
  margin-bottom: 6px;
  padding-bottom: 5px;
  border-bottom: solid 1px #f2f2f2;
}
.sub-cate-line{
  padding-left: 5%;
  color: #888;
}
.cate-section{
  font-size: .9rem;
}
</style>
