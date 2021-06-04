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
        <el-container id="canvas-designer-big">
          <div><canvas id="ruler-x" :width="boxWidth" height="20"></canvas></div>
          <div><canvas id="ruler-y" width="20" :height="boxHeight"></canvas></div>
        </el-container>
      </el-main>
      <el-aside width="300px">配置选项区</el-aside>
    </el-container>
  </el-container>
</template>
<script>
import { onMounted, ref } from 'vue';

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
    let boxWidth = ref(0);
    let boxHeight = ref(0);
    onMounted(() => {
      const box = document.getElementById('canvas-designer-big');
      console.log(box);
      boxWidth.value = ref(box.offsetWidth);
      boxHeight.value = ref(box.offsetHeight);
    });

    return {
      showLayer,
      showComps,
      open,
      boxWidth,
      boxHeight,
    };
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/font/iconfont/iconfont.css';
@import '@/assets/css/style.scss';
#canvas-designer-big {
  height: calc(100% - 50px);
}
</style>
