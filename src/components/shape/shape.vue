<template>
  <div :class="defaultStyle.active ? 'shape active' : 'shape'" :style="styleSize">
    <div
      class="shape-point"
      v-for="item in isActive() ? pointList : []"
      :key="item"
      :style="getPointStyle(item)"
      @mousedown="handleMouseDownOnPoint(item)"
    ></div>
    <slot></slot>
  </div>
</template>

<script>
import { computed, watch } from 'vue';

export default {
  props: {
    defaultStyle: {
      type: Object,
    },
    scale: {
      type: Number,
    },
  },
  setup(props, { emit }) {
    const pointList = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l']; // 八个方向
    const initialAngle = {
      // 每个点对应的初始角度
      lt: 0,
      t: 45,
      rt: 90,
      r: 135,
      rb: 180,
      b: 225,
      lb: 270,
      l: 315,
    };
    const angleToCursor = [
      // 每个范围的角度对应的光标
      { start: 338, end: 23, cursor: 'nw' },
      { start: 23, end: 68, cursor: 'n' },
      { start: 68, end: 113, cursor: 'ne' },
      { start: 113, end: 158, cursor: 'e' },
      { start: 158, end: 203, cursor: 'se' },
      { start: 203, end: 248, cursor: 's' },
      { start: 248, end: 293, cursor: 'sw' },
      { start: 293, end: 338, cursor: 'w' },
    ];
    const styleSize = computed(() => {
      return {
        left: props.defaultStyle.left,
        top: props.defaultStyle.top,
        width: props.defaultStyle.width + 'px',
        height: props.defaultStyle.height + 'px',
        // left: props.defaultStyle.left * props.scale / 100,
        // top: props.defaultStyle.top * props.scale / 100,
        // width: props.defaultStyle.width * props.scale / 100 + 'px',
        // height: props.defaultStyle.height * props.scale / 100 + 'px',
      };
    });
    const isActive = () => props.defaultStyle.active;
    const cursors = {};
    const getPointStyle = point => {
      const { width, height } = props.defaultStyle;
      const hasT = /t/.test(point);
      const hasB = /b/.test(point);
      const hasL = /l/.test(point);
      const hasR = /r/.test(point);
      let newLeft = 0;
      let newTop = 0;

      // 四个角的点
      if (point.length === 2) {
        newLeft = hasL ? 0 : width;
        newTop = hasT ? 0 : height;
      } else {
        // 上下两点的点，宽度居中
        if (hasT || hasB) {
          newLeft = width / 2;
          newTop = hasT ? 0 : height;
        }
        // 左右两边的点，高度居中
        if (hasL || hasR) {
          newLeft = hasL ? 0 : width;
          newTop = Math.floor(height / 2);
        }
      }

      const style = {
        marginLeft: hasR ? '-4px' : '-4px',
        marginTop: '-4px',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        cursor: cursors[point],
      };

      return style;
    };
    const pos = computed(() => props.defaultStyle);
    const handleMouseDownOnPoint = point => {
      const downEvent = window.event;
      downEvent.stopPropagation();
      downEvent.preventDefault();

      const height = Number(pos.value.height);
      const width = Number(pos.value.width);
      const top = parseInt(pos.value.top);
      const left = parseInt(pos.value.left);
      const startX = downEvent.clientX;
      const startY = downEvent.clientY;

      // 是否需要保存快照
      let needSave = false;
      const move = moveEvent => {
        needSave = true;
        const currX = moveEvent.clientX;
        const currY = moveEvent.clientY;
        const disY = currY - startY;
        const disX = currX - startX;
        const hasT = /t/.test(point);
        const hasB = /b/.test(point);
        const hasL = /l/.test(point);
        const hasR = /r/.test(point);
        const newHeight = height + (hasT ? -disY : hasB ? disY : 0);
        const newWidth = width + (hasL ? -disX : hasR ? disX : 0);
        const newPos = {};
        newPos.height = newHeight > 0 ? newHeight : 0;
        newPos.width = newWidth > 0 ? newWidth : 0;
        newPos.left = left + (hasL ? disX : 0) + 'px';
        newPos.top = top + (hasT ? disY : 0) + 'px';
        newPos.active = true;
        // console.log(newPos.height);
        emit('update:defaultStyle', newPos);
      };

      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        // needSave && this.$store.commit('recordSnapshot');
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    };
    return {
      isActive,
      pointList,
      styleSize,
      getPointStyle,
      handleMouseDownOnPoint,
    };
  },
};
</script>

<style lang="scss" scoped>
.shape {
  position: absolute;
  &:hover {
    cursor: move;
  }
}
.active {
  outline: 1px solid #70c0ff;
  user-select: none;
}
.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 1;
}
.icon-xiangyouxuanzhuan {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: 600;
  cursor: grab;
  color: #59c7f9;
  font-size: 20px;
  font-weight: 600;
  &:active {
    cursor: grabbing;
  }
}
.icon-suo {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
