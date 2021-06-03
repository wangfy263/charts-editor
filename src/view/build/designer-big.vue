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
          <div class="box-canvas">
            <div class="box box-ruler-x"><canvas id="ruler-x" :width="boxWidth" height="20"></canvas></div>
            <div class="box box-ruler-y"><canvas id="ruler-y" width="20" :height="boxHeight"></canvas></div>
          </div>
        </el-container>
      </el-main>
      <el-aside width="300px">配置选项区</el-aside>
    </el-container>
  </el-container>
</template>
<script>
import { ref, onMounted } from 'vue';

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
    const boxWidth = ref(0);
    const boxHeight = ref(0);
    onMounted(() => {
      const box = document.getElementById('canvas-designer-big');
      boxWidth.value = box.offsetWidth - 24;
      boxHeight.value = box.offsetHeight - 24;

      const canX = document.getElementById('ruler-x');
      const canY = document.getElementById('ruler-y');
      const contextX = canX.getContext('2d');
      const contextY = canY.getContext('2d');
      // boxWidth.value =
      setTimeout(() => {
        const step = 10;
        const multiple = 5;
        contextX.beginPath();
        let x = 0;
        let index = 0;
        while (x < boxWidth.value) {
          contextX.moveTo(x, 0);
          if (index % multiple === 0 || index === 0) {
            contextX.lineTo(x, 12);
            contextX.font = '9px "微软雅黑"';
            contextX.textAlign = 'left';
            contextX.textBaseline = 'top';
            contextX.fillText(x, x+1, 12);
          } else {
            contextX.lineTo(x, 8);
          }

          x += step;
          index += 1;
        }
        contextX.strokeStyle = '#000';
        contextX.lineWidth = 1;
        contextX.stroke();

        // contextY.beginPath();
        let y = 0;
        index = 0;
        while (y < boxHeight.value) {
          contextX.beginPath();
          contextY.moveTo(0, y);
          if (index % multiple === 0 || index === 0) {
            contextY.lineTo(12, y);
            contextY.strokeStyle = '#000';
            contextY.lineWidth = 1;
            contextY.stroke();

            // console.log(100);
            console.log(y);
            contextY.font = '9px "微软雅黑"';
            contextY.textAlign = 'center';
            contextY.textBaseline = 'top';
            // contextY.translate(12, y);
            // contextY.rotate((Math.PI / 180) * 90);
            contextY.fillText(y, 12, y+2);
            // contextY.rotate((Math.PI / 180) * -90);
            // contextY.translate(-12, -y);
          } else {
            contextY.lineTo(8, y);
            contextY.strokeStyle = '#000';
            contextY.lineWidth = 1;
            contextY.stroke();
          }
          y += step;
          index += 1;
        }
      }, 100);
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
  .box-canvas {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #999;
    border-left: 1px solid #999;
    .box {
      height: 22px;
    }
    .box-ruler-x {
      margin-left: 22px;
      canvas {
        border-bottom: 1px solid #666;
      }
    }
    .box-ruler-y {
      canvas {
        border-right: 1px solid #666;
      }
    }
  }
}
</style>
