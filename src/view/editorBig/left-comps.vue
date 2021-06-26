<template>
  <!-- <p class="title">组件列表</p> -->
  <div>
    <el-collapse v-model="activeCollapse" accordion style="margin-left: 20px">
      <el-collapse-item :title="type.name" :name="index" v-for="(type, index) in comps" :key="index">
        <el-row style="height: calc(100%-450px)">
          <el-col :span="12" v-for="comp in type.components">
            <img :src="`../../../components/images/${comp.component.lib}/${comp.component.img}.png`" class="report-icon" @click="checkComp(comp)" />
            <div class="report-name" @click="checkComp(comp)">{{ comp.component.label }}</div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { ref, inject } from 'vue';

export default {
  // emits: ['checkComp'],
  setup(props, { emit }) {
    const active = ref(-1);
    const activeCollapse = ref(1);
    const comps = inject('comps');
    const checkComp = comp => {
      emit('checkComps', _.cloneDeep(comp));
    };
    return {
      active,
      activeCollapse,
      comps,
      checkComp,
    };
  },
};
</script>
<style lang="scss" scoped>
.report-name {
  color: #333;
  // height: 10px;
  margin-bottom: 10px;
}
.report-icon {
  width: 80px;
  height: 60px;
}
</style>
