<template>
  <div class="box-canvas">
    <div class="box-ruler-x">
      <div class="svg-icon-box">
        <!-- <svg>
          <use xlink:href="#icon-eye-open" />
        </svg> -->
        <SvgIcon name="eye-open" style="margin-bottom: 5px"></SvgIcon>
      </div>
      <canvas id="ruler-x" :width="boxWidth" height="20"></canvas>
    </div>
    <div class="box-ruler-y">
      <canvas id="ruler-y" width="20" :height="boxHeight"></canvas>
    </div>
    <div>
    <slot></slot>
    </div>
  </div>
</template>
<script>
import { computed, nextTick, watch } from 'vue';
import { scaleLinear } from 'd3-scale';

export default {
  props: {
    scale: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const scale = computed(() => props.scale / 100);
    const step = 10;
    const stepScale = computed(() => 10 * scale.value);
    const multiple = 5;
    const boxWidth = computed(() => props.width);
    const boxHeight = computed(() => props.height);

    const render = () => {
      // console.log(stepScale.value);
      // console.log(scale.value);
      // nextTick(() => {});
      console.log(boxWidth.value);
      console.log(boxHeight.value);
      const canX = document.getElementById('ruler-x');
      const canY = document.getElementById('ruler-y');
      const contextX = canX.getContext('2d');
      const contextY = canY.getContext('2d');
      contextX.clearRect(0, 0, canX.width, canX.height);
      contextY.clearRect(0, 0, canY.width, canY.height);
      contextX.beginPath();
      let x = 0;
      let xText = 0;
      let index = 0;
      while (x <= boxWidth.value) {
        contextX.moveTo(x, 0);
        if (index % multiple === 0 || index === 0) {
          contextX.lineTo(x, 12);
          contextX.font = '9px "微软雅黑"';
          contextX.textAlign = 'left';
          contextX.textBaseline = 'top';
          contextX.fillText(xText, x + 1, 11);
        } else {
          contextX.lineTo(x, 8);
        }
        x += stepScale.value;
        xText += step;
        index += 1;
      }
      contextX.strokeStyle = '#333';
      contextX.lineWidth = 1;
      contextX.stroke();

      contextY.beginPath();
      let y = 0;
      let yText = 0;
      index = 0;
      while (y <= boxHeight.value) {
        contextY.moveTo(0, y);
        if (index % multiple === 0 || index === 0) {
          contextY.lineTo(12, y);
          contextY.font = '9px "微软雅黑"';
          contextY.textAlign = 'center';
          contextY.textBaseline = 'top';
          // contextY.translate(12, y);
          // contextY.rotate((Math.PI / 180) * 90);
          contextY.fillText(yText, 12, y + 2);
          // contextY.rotate((Math.PI / 180) * -90);
          // contextY.translate(-12, -y);
        } else {
          contextY.lineTo(8, y);
        }
        y += stepScale.value;
        yText += step;
        index += 1;
      }
      contextY.strokeStyle = '#333';
      contextY.lineWidth = 1;
      contextY.stroke();
    };
    watch(scale, () => {
      render();
    });
    setTimeout(() => {
      render();
    }, 0);
    return {
      boxWidth,
      boxHeight,
    };
  },
};
</script>
<style lang="scss" scoped>
.box-canvas {
  width:inherit;
  height: inherit;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-top: 1px solid #999;
  border-left: 1px solid #999;
  // overflow: auto;
  .box-ruler-x {
    // margin-left: 22px;
    display: flex;
    flex-direction: row;
    canvas {
      border-bottom: 1px solid #666;
    }
    .svg-icon-box {
      width: 20px;
      height: 20px;
      text-align: center;
    }
  }
  .box-ruler-y {
    width: 20px;
    canvas {
      border-right: 1px solid #666;
    }
  }
}
</style>
