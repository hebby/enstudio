var cookie = {
  get: function (cname) {
    var reg = new RegExp('(^| )' + cname + '=([^;]*)(;|$)')
    var arr = document.cookie.match(reg)
    if (arr && arr.length > 3) {
      return decodeURI(arr[2])
    }
    return null
  },
  set: function (name, value, expHour) {
    expHour = expHour || 24
    var date = new Date()
    date.setTime(date.getTime() + (expHour * 60 * 60 * 1000))
    var expires = 'expires=' + date.toUTCString()
    document.cookie = name + '=' + encodeURI(value) + '; ' + expires + ';path=/'
  },
  clear: function (name) {
    this.set(name, '', -1)
  },
  setMutilValues: function (values, expHour) {
    expHour = expHour || 24
    if (!values) {
      return
    }
    for (var key in values) {
      if (key && values.hasOwnProperty(key)) {
        this.set(key, values[key], expHour)
      }
    }
  },
  clearMutilKeys: function (keys) {
    if (!keys) {
      return
    }
    for (var k of keys) {
      if (k) {
        cookie.clear(k)
      }
    }
  }
}

export default cookie
