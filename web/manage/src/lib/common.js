export default {
  convertUrlParams (params) {
    var urlParams = new URLSearchParams()
    Object.keys(params).forEach(function (key) {
      urlParams.append(key, params[key])
    })
    return urlParams
  }
}
