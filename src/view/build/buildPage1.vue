<template>
  <el-container>
    <el-header height="46"> 组件可编辑测试 </el-header>
    <el-container class="chart-components-box">
      <el-aside width="300px">
        <p class="title">组件列表</p>
        <div>
          <el-collapse v-model="activeCollapse" accordion style="margin-left: 20px">
            <el-collapse-item :title="type.name" :name="index" v-for="(type, index) in comps" :key="index">
              <el-row style="height: calc(100%-450px)">
                <el-col :span="12" v-for="comp in type.components">
                  <img
                    :src="`../../../components/images/${comp.component.lib}/${comp.component.img}.png`"
                    class="report-icon"
                    @click="checkComp(comp)"
                  />
                  <div class="report-name" @click="checkComp(comp)">{{ comp.label }}</div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-aside>
      <el-main>
        <div class="chart-box">
          <component
            v-if="element.component"
            :component="element.component"
            :is="'echartsComponent'"
            :dataSource="element.dataSource"
            :data="element.data"
            :option="element.option"
            :specialOption="element.specialOption"
          ></component>
        </div>
      </el-main>
      <el-aside width="360px">
        <el-form class="page-config-box" ref="form" size="small" style="text-align: left">
          <el-tabs type="border-card" style="height: calc(100% - 2px); overflow: auto">
            <el-tab-pane label="组件配置" v-if="active !== -1">
              <el-form-item label="图层名称"><el-input v-model="propsObj.activeObj.title"></el-input></el-form-item>
              <component :is="`${propsObj.activeObj.component.config}`" v-model:propsObj="propsObj"></component>
            </el-tab-pane>
            <el-tab-pane label="接口管理" v-if="active !== -1">
              <InterfaceForComp v-model:propsObj="propsObj" v-on:handleRefresh="handleRefresh"></InterfaceForComp>
            </el-tab-pane>
            <el-tab-pane label="TOKEN">
              <TokenConfig ref="tokenConf"></TokenConfig>
            </el-tab-pane>
            <el-tab-pane label="接口">
              <InterfaceConfig ref="interfaceConf"></InterfaceConfig>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus';
// import { v4 as uuidv4 } from 'uuid';
import TokenConfig from '@/view/common/template/TokenConfig.vue';
import InterfaceConfig from '@/view/common/template/InterfaceConfig.vue';
import InterfaceForComp from '@/view/common/template/InterfaceForComp.vue';
import { ref, reactive, computed, watchEffect, onBeforeUpdate, toRaw, nextTick, provide, inject } from 'vue';
// import { useStore } from 'vuex';
// import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    TokenConfig,
    InterfaceConfig,
    InterfaceForComp,
  },
  setup() {
    /* 选中组件 */
    const active = ref(-1);
    const activeCollapse = ref(1);
    const propsObj = reactive({
      activeObj: {},
    });
    const comps = inject('comps');
    const element = ref({});

    /* 组件数据刷新 */
    const handleRefresh = () => {
      // //数据处理
      itemRefs.filter(item => item.id === `component_${active.value}`)[0].initChart();
      // this.$refs['list_' + this.active][0].updateData();
      ElMessage.success('刷新成功');
    };

    const checkComp = comp => {
      active.value = 0;
      // element.value = {};
      // propsObj.activeObj = {};
      console.log('---');
      // nextTick(() => {
        element.value = comp;
        propsObj.activeObj = comp;
        console.log(propsObj.activeObj.component.config);
      // });
    };

    return {
      active,
      activeCollapse,
      propsObj,
      handleRefresh,
      comps,
      element,
      checkComp,
    };
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/font/iconfont/iconfont.css';
@import '@/assets/css/style.scss';
</style>
