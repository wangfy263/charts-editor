<template>
  <div class="editor-area">
    <Shape v-for="element in elements" @mousedown="handleMousedown" v-model:defaultStyle="element.base">
      <component
        v-if="element.component"
        :id="element.base.id"
        :component="element.component"
        :is="'echartsComponent'"
        :dataSource="element.dataSource"
        :data="element.data"
        :option="element.option"
        :specialOption="element.specialOption"
      ></component>
    </Shape>
  </div>
</template>
<script>
import { ref } from 'vue';

export default {
  props: {
    elements: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const activeComp = ref({});

    const handleMousedown = e => {
      e.stopPropagation();
      const startY = e.clientY;
      const startX = e.clientX;
      const pos = { ...defaultStyle.value };
      const startTop = parseInt(pos.top);
      const startLeft = parseInt(pos.left);

      const move = moveEvent => {
        const currX = moveEvent.clientX;
        const currY = moveEvent.clientY;
        pos.top = currY - startY + startTop;
        pos.left = currX - startX + startLeft;
        // console.log(pos);
        if (pos.top < 0) {
          pos.top = 0;
        }
        if (pos.left < 0) {
          pos.left = 0;
        }
        // 修改当前组件样式
        defaultStyle.value.top = pos.top + 'px';
        defaultStyle.value.left = pos.left + 'px';
        // console.log(defaultStyle);
      };

      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    };
    // const handleMousemove = () => {};
    // const handleMouseup = () => {};
    return {
      // defaultStyle,
      handleMousedown,
      // handleMousemove,
      // handleMouseup,
    };
  },
};
</script>
<style lang="scss" scoped>
.editor-area {
  position: relative;
  width: calc(100% - 1px);
  height: 100%;
  background: #eee;
}
</style>
