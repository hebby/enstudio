<template>
  <div class="el-loading-mask" style="">
    <div class="el-loading-spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
      </svg><!---->
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {}
  }
}
</script>
<style scoped>
.el-loading-mask {
  position: absolute;
  z-index: 10000;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.el-loading-spinner {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
}
.el-loading-spinner .circular {
    height: 42px;
    width: 42px;
    -webkit-animation: loading-rotate 2s linear infinite;
    animation: loading-rotate 2s linear infinite;
}
.el-loading-spinner .path {
    -webkit-animation: loading-dash 1.5s ease-in-out infinite;
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90,150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #999;
    stroke-linecap: round;
}
@keyframes loading-dash {
  0% {
      stroke-dasharray: 1,200;
      stroke-dashoffset: 0;
  }
  50% {
      stroke-dasharray: 90,150;
      stroke-dashoffset: -40px;
  }
  100% {
      stroke-dasharray: 90,150;
      stroke-dashoffset: -120px;
  }
}
@keyframes loading-rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>