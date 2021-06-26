<template>
  <el-form-item label="top"><el-input v-model="propsObj.activeObj.base.top"></el-input></el-form-item>
  <el-form-item label="left"><el-input v-model="propsObj.activeObj.base.left"></el-input></el-form-item>
  <el-form-item label="width"><el-input v-model="propsObj.activeObj.base.width"></el-input></el-form-item>
  <el-form-item label="height"><el-input v-model="propsObj.activeObj.base.height"></el-input></el-form-item>
</template>
<script>
export default {
  props: {
    propsObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
}
</script>
