var myMixin = {
  methods: {
    $get: function (url, fn) {
      let self = this
      self.$ajax.get(url)
      .then(function (response) {
        if (!response || response.data.error) {
          self.$router.replace({name: 'error'})
          return
        }
        fn(response)
      }).catch(function (error) {
        console.log(error)
      })
    }
  }
}
export default myMixin
