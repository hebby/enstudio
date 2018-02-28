<template>
  <div class="nofound-wrap">
    <p>很抱歉，您访问的页面出现异常。 请联系我们或浏览其他页面，谢谢~</p>
    <a href="/" class="link-to">返回首页</a>
  </div>
</template>


<style scoped>
.nofound-wrap{
  width: 80%;
  margin: 130px auto;
  padding: 5rem;
  background-color: rgba(255,255,255,0.7);
  font-size: 1.2rem;
  color: #533f34;
  text-align: center;
}
.link-to{
  background-color:#533f34;
  color: #fff;
  padding: .9rem 2rem;
  margin: 2rem 0 0;
  display: inline-block;
}
.link-to:hover{
  opacity: .9;
}
</style>