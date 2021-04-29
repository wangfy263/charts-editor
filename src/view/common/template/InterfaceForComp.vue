<template>
  <div class="interface-for-comp">
    <el-form  label-position="left" size="small">
      <el-form-item label="数据类型">
        <el-radio v-model="propsObj.activeObj.dataType" :label="0">静态数据</el-radio>
        <el-radio v-model="propsObj.activeObj.dataType" :label="1">动态数据</el-radio>
      </el-form-item>
      <el-form-item label="数据值" v-if="propsObj.activeObj.dataType === 0">
        <el-input type="textarea" :rows="10" v-model="jsonData"></el-input>
        <!-- <el-button type="primary" @click="inputData">输入数据</el-button> -->
      </el-form-item>
      <template v-if="propsObj.activeObj.dataType === 1">
        <el-form-item label="选择数据源">
          <el-select v-model="propsObj.activeObj.dataSource.interfaceId" placeholder="请选择">
            <el-option v-for="item in interfaceList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自动刷新">
          <el-switch v-model="propsObj.activeObj.dataSource.autoRefresh"></el-switch>
        </el-form-item>
        <template v-if="propsObj.activeObj.dataSource.autoRefresh">
          <el-form-item label="刷新时间">
            <el-input-number v-model="propsObj.activeObj.dataSource.time"></el-input-number>
          </el-form-item>
        </template>
        <el-form-item label="数据处理">
          <el-input type="textarea" :rows="10" v-model="propsObj.activeObj.dataSource.dataFormatterRaw"></el-input>
          <!-- <el-button type="primary" @click="inputFunc">输入数据</el-button> -->
        </el-form-item>
      </template>
      <el-form-item label-width="0">
        <el-button type="primary" size="small" class="block" @click="handleRefresh()">刷新数据</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { ref, reactive, computed, watch, watchEffect, toRefs, nextTick, isReadonly, isReactive, isRef } from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

export default {
  // emits: ['update:propsObj.activeObj', 'handleRefresh'],
  props: {
    propsObj: {
      type: Object,
      default: () => {
        return {
          activeObj: {
            dataSource: {},
          },
        };
      },
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    // 接口列表
    const interfaces = computed(() => store.getters.interfaces);
    // eslint-disable-next-line
    const interfaceList = computed(() => {
      return interfaces.value.map(item => {
        return {
          label: item.name,
          value: item.getId(),
        };
      });
    });

    // eslint-disable-next-line
    const propsObj = props.propsObj;

    // 是否是JSON
    function isJson(str) {
      if (Array.isArray(str)) {
        if (str[0] instanceof Object) {
          return true;
        }
      } else if (str instanceof Object) {
        return true;
      }
      return false;
    }
    // 静态数据
    const jsonData = computed({
      get() {
        const data = propsObj.activeObj.data;
        if (isJson(data)) {
          return JSON.stringify(data, null, 4);
        }
        return '';
      },
      set(val) {
        let data;
        try {
          data = JSON.parse(val, null, 4);
          propsObj.activeObj.data = data;
        } catch (error) {
          ElMessage.error('json格式错误，检查控制台');
        }
      },
    });

    // 更新组件数据
    const handleRefresh = () => {
      emit('handleRefresh');
    };

    // watch(
    //   () => innerObj.dataSource,
    //   () => {
    //     if (this.isWatch) {
    //       emit('update:propsObj.activeObj', innerObj);
    //     }
    //   }
    // );
    return {
      interfaceList,
      jsonData,
      handleRefresh,
    };
  },
};
</script>
