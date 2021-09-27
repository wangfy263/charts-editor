<template>
  <el-container>
    <el-header height="46">
      工具栏
      <el-button @click="open(1)">打开/隐藏图层区</el-button>
      <el-button @click="open(2)">打开/隐藏组件区</el-button>
    </el-header>
    <el-container class="chart-components-box">
      <el-aside v-if="showLayer" width="200px" class="animate__animated animate__fadeInLeft">图层区</el-aside>
      <el-aside v-if="showComps" width="200px" class="animate__animated animate__fadeInLeft">
        <LeftComps @checkComps="checkComps"></LeftComps>
      </el-aside>
      <el-main>
        <el-header height="46"> 缩放比例：<el-input-number size="mini" v-model="num" :step="5"></el-input-number> </el-header>
        <el-container id="canvas-designer-big">
          <Ruler
            :width="config.width > boxWidth ? config.width : boxWidth"
            :height="config.height > boxHeight ? config.height : boxHeight"
            :scale="num"
          >
            <!-- <div class="editor-area"></div> -->
            <AreaCanvas v-model:elements="elements" :scale="num" :config="config"></AreaCanvas>
          </Ruler>
        </el-container>
      </el-main>
      <el-aside width="300px">
        <el-form class="page-config-box" ref="form" size="small" style="text-align: left">
          <el-tabs type="border-card" style="height: calc(100% - 2px); overflow: auto">
            <el-tab-pane label="基本属性" v-if="!active">
              <PageConfig :config="config"></PageConfig>
            </el-tab-pane>
            <el-tab-pane label="组件配置" v-if="active">
              <el-form-item label="图层名称"><el-input v-model="propsObj.activeObj.title"></el-input></el-form-item>
              <component :is="`${propsObj.activeObj.component.config}`" :propsObj="propsObj"></component>
            </el-tab-pane>
            <!-- <el-tab-pane label="数据配置" v-if="active">
              <InterfaceForComp v-model:propsObj="propsObj" v-on:handleRefresh="handleRefresh"></InterfaceForComp>
            </el-tab-pane> -->
            <el-tab-pane label="基本属性" v-if="active">
              <BaseConfig :propsObj="propsObj"></BaseConfig>
            </el-tab-pane>
            <el-tab-pane label="TOKEN" v-if="!active">
              <TokenConfig ref="tokenConf"></TokenConfig>
            </el-tab-pane>
            <el-tab-pane label="接口" v-if="!active">
              <InterfaceConfig ref="interfaceConf"></InterfaceConfig>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script>
import { ref, reactive, nextTick, watch, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import TokenConfig from '@/view/common/template/TokenConfig.vue';
import InterfaceConfig from '@/view/common/template/InterfaceConfig.vue';
import InterfaceForComp from '@/view/common/template/InterfaceForComp.vue';
import BaseConfig from '@/view/common/template/BaseConfig.vue';
import PageConfig from '@/view/common/template/PageConfig.vue';
import AreaCanvas from './area-canvas.vue';
import LeftComps from './left-comps.vue';

import Tesseract from 'tesseract.js';
import { saveAs } from 'file-saver';

export default {
  components: {
    BaseConfig,
    PageConfig,
    TokenConfig,
    InterfaceConfig,
    InterfaceForComp,
    AreaCanvas,
    LeftComps,
  },
  setup() {
    // Tesseract.recognize(
    //   'http://192.168.26.94:8009/1234.png',
    //   'eng',
    //   { logger: m => console.log(m) }
    // ).then(({ data: { text } }) => {
    //   console.log(text);
    // })

    // saveAs("http://localhost:8009/wz/uploaded/steel/2021/08/10/181610.png", "image.jpg");

    let files = ['https://img02.mysteelcdn.com/wz/uploaded/steel/2021/08/10/181610.png', 'https://img02.mysteelcdn.com/wz/uploaded/steel/2021/08/10/181610.png']; // 所有文件
    files.forEach(url => {
      let a = document.createElement('a'); // 创建a标签
      let e = document.createEvent('MouseEvents'); // 创建鼠标事件对象
      // e.initEvent('click', false, false); // 初始化事件对象
      a.href = url; // 设置下载地址
      a.download = '测试.png'; // 设置下载文件名
      a.click();
      // a.remove();
    });

    /* 编辑区域宽度设置 */
    let boxWidth = ref(0);
    let boxHeight = ref(0);
    const boxResize = () => {
      nextTick(() => {
        const box = document.getElementById('canvas-designer-big');
        boxWidth.value = box.offsetWidth;
        boxHeight.value = box.offsetHeight;
      });
    };
    boxResize();
    window.onresize = function () {
      boxResize();
    };
    /* 左侧操作区域设置 */
    let showLayer = ref(false);
    let showComps = ref(true);
    const open = n => {
      if (n === 1) {
        showLayer.value = !showLayer.value;
      }
      if (n === 2) {
        showComps.value = !showComps.value;
      }
      boxResize();
    };
    /* 大屏画布设置 */
    const config = ref({
      width: 1200,
      height: 700,
    });

    /* 画布中组件列表 */
    const active = ref(false);
    const elements = reactive([]);
    const propsObj = reactive({
      activeObj: {},
    });
    const checkComps = ele => {
      // console.log(ele);
      ele.base = {
        active: false,
        id: uuidv4(),
        index: elements.length,
        zIndex: elements.length,
        top: '0px',
        left: '0px',
        width: 200,
        height: 150,
      };
      elements.push(ele);
    };
    const handleRefresh = () => {
      // //数据处理
      // itemRefs.filter(item => item.id === `component_${active.value}`)[0].initChart();
      // ElMessage.success('刷新成功');
    };
    watch(elements, () => {
      const comp = elements.filter(item => item.base.active)[0];
      if (comp) {
        propsObj.activeObj = comp;
        active.value = true;
      } else {
        active.value = false;
      }
    });
    return {
      num: ref(100),
      showLayer,
      showComps,
      open,
      boxWidth,
      boxHeight,
      config,
      elements,
      checkComps,
      propsObj,
      active,
      handleRefresh,
    };
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/font/iconfont/iconfont.css';
@import '@/assets/css/style.scss';
#canvas-designer-big {
  height: calc(100% - 55px);
}
.page-config-box {
  text-align: left;
  height: 100%;
  :deep(.el-color-picker--mini .el-color-picker__trigger) {
    width: 23px;
    height: 23px;
  }
  :deep(.el-form-item__label) {
    float: none;
    display: inline-block;
    text-align: left;
  }
  :deep(.el-form-item__label) {
    padding: 0;
    font-weight: 500;
  }
  :deep(.right-margin) {
    margin-left: 15px;
  }
}
</style>
