const path = require('path')
const fs = require('fs')
const Busboy = require('busboy')

// 写入目录
const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
  return false
}

// 获取文件后缀
function getSuffix (fileName) {
  return fileName.split('.').pop()
}

// 重命名
function Rename (options, fileName) {
  let prefixKey = options.prefixKey || ""
  if (options.needRename){
    return `${prefixKey}-${Math.random().toString(16).substr(2)}.${getSuffix(fileName)}`  
  }else{
    return `${prefixKey}-${fileName}`
  }
}

// 上传到本地服务器
function uploadFile (ctx, options) {
  	//在这里做一个头部数据检查
	if(!/multipart\/form-data/i.test(ctx.req.headers['content-type'])){
		return ctx.body('wrong');
	}
  const _emmiter = new Busboy({headers: ctx.req.headers})
  //const fileType = options.fileType
  const time = new Date()
  const rootPath = `${time.getFullYear()}/${time.getMonth() + 1}`
  const filePath = path.join(options.path, rootPath)
  const confirm = mkdirsSync(filePath)
  if (!confirm) {
    return
  }
  return new Promise((resolve, reject) => {
    _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
      filename = filename.replace(/\s+/,'-')
      const fileName = Rename(options, filename)
      const saveTo = path.join(filePath, fileName)
      file.pipe(fs.createWriteStream(saveTo))
      file.on('end', function () {
        resolve({
          // imgPath: `/${rootPath}/${fileName}`,
          imgPath: `/${rootPath}`,
          imgKey: fileName,
          saveTo: filePath
        })
      })
    })

    _emmiter.on('finish', function () {
      console.log('finished...')
      resolve()
    })

    _emmiter.on('error', function (err) {
      console.log('err...')
      reject(err)
    })

    ctx.req.pipe(_emmiter)
  })
}

module.exports = uploadFile