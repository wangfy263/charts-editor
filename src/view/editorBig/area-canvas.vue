<template>
  <div class="editor-area" :style="pageStyle">
    <Shape
      v-for="element in elements"
      @mousedown="handleMousedown(element)"
      v-model:defaultStyle="element.base"
      :key="element.base.id"
      :scale="scale"
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
        :base="element.base"
      ></component>
    </Shape>
  </div>
</template>
<script>
import { reactive, computed, watch, toRaw } from 'vue';

export default {
  props: {
    config: {
      type: Object,
    },
    scale: {
      type: Number,
      default: 100,
    },
    elements: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const scale = computed(() => props.scale / 100);
    const pageStyle = computed(() => {
      return {
        width: props.config.width * scale.value + 'px',
        height: props.config.height * scale.value + 'px',
      };
    });

    const handleMousedown = ele => {
      const downEvent = window.event;
      downEvent.stopPropagation();
      downEvent.preventDefault();
      props.elements.forEach(item => {
        item.base.active = false;
      });
      ele.base.active = true;
      emit('update:elements', props.elements);

      const activeComp = computed(() => props.elements.filter(item => item.base.active)[0]);
      if (!activeComp.value) {
        return;
      }
      const defaultStyle = activeComp.value.base;
      // const startY = e.clientY;
      // const startX = e.clientX;
      const startY = downEvent.clientY;
      const startX = downEvent.clientX;
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

    // const elementList = computed(() => {
    //   const list = _.cloneDeep(props.elements)
    //   return list.map(item => {
    //     item.base.width *= scale.value;
    //     item.base.height *= scale.value;
    //     return item;
    //   })
    // });
    return {
      pageStyle,
      // elementList,
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
  // width: calc(100% - 1px);
  // height: 100%;
  background: #eee;
  // .comps {
  //   // position: absolute;
  //   border: 1px solid #666;
  //   width: 50px;
  //   height: 25px;
  // }
}
</style>
