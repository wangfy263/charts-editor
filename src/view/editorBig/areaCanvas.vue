<template>
  <div class="editor-area">
    <Shape
      v-for="element in elements"
      @mousedown="handleMousedown"
      @click="handleClick(element)"
      :defaultStyle="element.base"
      :key="element.base.id"
    >
      <component
        v-if="element.component"
        :component="element.component"
        :is="'echartsComponent'"
        :dataSource="element.dataSource"
        :data="element.data"
        :option="element.option"
        :specialOption="element.specialOption"
        :id="element.base.id"
      ></component>
    </Shape>
  </div>
</template>
<script>
import { reactive, computed } from 'vue';

export default {
  props: {
    elements: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const activeComp = computed(() => props.elements.filter(item => item.base.active)[0]);
    const handleClick = ele => {
      props.elements.forEach(item => {
        item.base.active = false;
      });
      ele.base.active = true;
    }
    const handleMousedown = e => {
      console.log(activeComp.value);
      if (!activeComp.value) {
        return;
      }
      e.stopPropagation();
      const defaultStyle = activeComp.value.base;
      const startY = e.clientY;
      const startX = e.clientX;
      const pos = { ...defaultStyle };
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
        defaultStyle.top = pos.top + 'px';
        defaultStyle.left = pos.left + 'px';
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
      handleClick,
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
  // .comps {
  //   // position: absolute;
  //   border: 1px solid #666;
  //   width: 50px;
  //   height: 25px;
  // }
}
</style>
