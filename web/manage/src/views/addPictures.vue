<template>
  <div class="upload">  
    <div class="upload">
      <div class="upload-warp">
        <div class="upload-warp-drag" @click="fileClick"  @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">
          <i class="el-icon-upload"></i>
          <p>将文件拖至此处，或点击此面板上传</p>
          <span class="txt-remark">( 每次最多支持上传100张图 )</span>
        </div>
      </div>
      <div class="upload-head"  v-show="imgList.length!=0">
      <el-button type="primary" @click="goUpload()" :disabled="uploadStatus!==-1">开始上传</el-button> 
      <div class="upload-process" v-if="uploadStatus!==-1">
        已上传 <span class="info-mark">{{doneCount}}</span> 张图片，
        失败 <span class="info-mark error-mark">{{failCount}}</span> 张
        <el-progress :text-inside="true" :stroke-width="15" :percentage="updateProcess" status="success"></el-progress>
      </div>
    </div>  
      <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none" accept="image/*"/>
      <div class="upload-warp-img" v-show="imgList.length!=0">
        <div class="upload-warp-text">
          已选中 <span class="info-mark">{{imgList.length}}</span> 张图，共 <span class="info-mark">{{bytesToSize(this.size)}}</span>
        </div>
        <transition-group name="list" tag="div">
        <div class="upload-warp-img-content list-item" v-for="(item,index) of imgList" :key="index" >
          <div class="upload-warp-img-mask" v-show="!item.uploaded">
            <i class="el-icon-close pic-del" title="删除" @click="fileDel(index)" v-show="uploadStatus===-1"></i>
          </div>
          <img :src="item.file.src">
        </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'upload',
  data () {
    return {
      imgList: [],
      size: 0,
      doneCount: 0,
      failCount: 0,
      updateProcess: 0,
      uploadStatus: -1,
      limitCount: 100
    }
  },
  beforeCreate () {
    let breadNavs = [{url: '/', name: '首页'}, {url: '/pictures', name: '图片列表'}, {url: '', name: '上传图片'}]
    this.$store.commit('setBreadCrumbNav', breadNavs)
  },
  watch: {
    doneCount () {
      let total = this.imgList.length
      if (total > 0) {
        this.updateProcess = Math.round(this.doneCount / total * 100)
      }
    }
  },
  methods: {
    fileClick () {
      document.getElementById('upload_file').click()
    },
    fileChange (el) {
      if (!el.target.files[0].size) return
      this.fileList(el.target)
      el.target.value = ''
    },
    fileList (fileList) {
      let files = fileList.files
      for (let i = 0; i < files.length; i++) {
        // 判断是否为文件夹
        if (files[i].type !== '') {
          this.fileAdd(files[i])
        } else {
          // 文件夹处理
          this.folders(fileList.items[i])
        }
      }
    },
    // 文件夹处理
    folders (files) {
      let _this = this
      // 判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry()
      }
      files.createReader().readEntries(function (file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i])
          } else {
            _this.folders(file[i])
          }
        }
      })
    },
    foldersAdd (entry) {
      let _this = this
      entry.file(function (file) {
        _this.fileAdd(file)
      })
    },
    fileAdd (file) {
      let _this = this
      // 仅处理图片
      if (file.type.indexOf('image') >= 0) {
        this.limitCount--
        if (_this.limitCount < 0) {
          _this.$message.error('单次最多只能上传100张图片！')
          return
        }
        // 总大小
        _this.size = _this.size + file.size
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          file.src = this.result
          _this.imgList.push({
            file: file,
            uploaded: false
          })
        }
      }
    },
    fileDel (index) {
      this.size = this.size - this.imgList[index].file.size // 总大小
      this.imgList.splice(index, 1)
      this.limitCount++
    },
    bytesToSize (bytes) {
      if (bytes === 0) return '0 B'
      let k = 1024 //  or 1024
      let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    },
    dragenter (el) {
      el.stopPropagation()
      el.preventDefault()
    },
    dragover (el) {
      el.stopPropagation()
      el.preventDefault()
    },
    drop (el) {
      el.stopPropagation()
      el.preventDefault()
      this.fileList(el.dataTransfer)
    },
    listReset () {
      let _this = this
      _this.imgList = []
      _this.size = 0
      _this.doneCount = 0
      _this.failCount = 0
      _this.updateProcess = 0
      _this.uploadStatus = -1
      _this.limitCount = 100
    },
    uploadedCallback () {
      let _this = this
      this.$confirm('上传完成，是否继续上传?', '提示', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonText: '完成上传',
        cancelButtonText: '继续上传',
        type: 'success'
      }).then(() => {
        // 完成后跳转至添加商品
        _this.$router.push('/products/add')
      }).catch(() => {
        // 重置后重新开始
        _this.listReset()
      })
    },
    uploadByOne (file, index) {
      let _this = this
      return new Promise((resolve, reject) => {
        var formData = new FormData() // FormData 对象
        formData.append('file', file)
        // console.log('index', index, file)
        _this.$ajax.post('/manage-upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
          }
        }).then((response) => {
          // console.log('....response', response)
          // // 更新总进度
          // _this.doneCount++
          // _this.imgList[index].uploaded = true
          resolve(response)
        }).catch(function () {
          _this.failCount++
          // console.log(error)
          // reject()
        })
      })
    },
    goUpload () {
      let _this = this
      if (_this.imgList.length === 0) {
        _this.$message.error('请先选择上传文件！')
        return
      }
      _this.uploadStatus = 1
      let uploadPromises = _this.imgList.map((item, index) => {
        return _this.uploadByOne(item.file, index).then((data) => {
          // 更新总进度
          _this.doneCount++
          _this.imgList[index].uploaded = true
        })
      })
      Promise.all(uploadPromises).then((data) => {
        // 上传结束
        _this.uploadedCallback()
      })
    }
  }
}
</script>
<style scoped>
.info-mark{
  font-weight: bold;
}
.error-mark{
  color: red;
}
.txt-remark{
  font-size: .7rem;
  color: #888;
}
.upload-head{
  margin-bottom: 10px;
}
.upload-process{
  margin-top: 15px;
}
.upload-warp-img-mask {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 30px;
  text-align: left;
  color: #fff;
  font-size: 12px;
  text-indent: 4px;
}
.upload-warp-img-content img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
.upload-warp-img-content {
  position: relative;
  height: 100px;
  width: 120px;
  border: 1px solid #ccc;
  margin: 0px 30px 10px 0px;
  float: left;
  line-height: 100px;
  display: table-cell;
  text-align: center;
  background-color: #eee;
  cursor: pointer;
}
.upload-warp-img {
  border-top: 1px solid #d2d2d2;
  padding: 14px 0 0 14px;
  overflow: hidden;
}
.upload-warp-text {
  text-align: left;
  margin-bottom: 10px;
  padding-top: 10px;
  /* text-indent: 14px;
  border-top: 1px solid #ccc; */
  font-size: 14px;
}
.upload-warp-drag {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 360px;
    height: 180px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.el-icon-upload{
  font-size: 2.8rem;
  color: #c0c4cc;
  margin-top: 40px;
}
.upload-warp {
  margin-bottom: 14px;
}
.pic-del{
  float: right;
  margin: 5px;
  font-size: 1.0rem;
}
.pic-del:hover{
  font-size: 1.1rem;
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to{
  opacity: 0;
  transition: opacity .3s ease;
}
.upload{
  font-size: .8rem;
}
</style>