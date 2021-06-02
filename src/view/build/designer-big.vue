<template>
  <el-container>
    <el-header height="46">
      工具栏
      <el-button @click="open(1)">打开/隐藏图层区</el-button>
      <el-button @click="open(2)">打开/隐藏组件区</el-button>
    </el-header>
    <el-container class="chart-components-box">
      <el-aside v-if="showLayer" width="200px" class="animate__animated animate__fadeInLeft">图层区</el-aside>
      <el-aside v-if="showComps" width="200px" class="animate__animated animate__fadeInLeft">组件区</el-aside>
      <el-main>
        <el-header height="46">画布工具</el-header>
        <el-container class="canvas-designer-big"> 画布区域 </el-container>
      </el-main>
      <el-aside width="300px">配置选项区</el-aside>
    </el-container>
  </el-container>
</template>
<script>
import { ref } from 'vue';

export default {
  setup() {
    let showLayer = ref(false);
    let showComps = ref(true);
    const open = n => {
      if (n === 1) {
        showLayer.value = !showLayer.value;
      }
      if (n === 2) {
        showComps.value = !showComps.value;
      }
    };
    return {
      showLayer,
      showComps,
      open,
    };
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/font/iconfont/iconfont.css';
@import '@/assets/css/style.scss';
.canvas-designer-big {
  height: calc(100% - 50px);
}
</style>
