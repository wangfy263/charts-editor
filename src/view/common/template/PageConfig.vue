<template>
  <el-form>
    <el-form-item label="width"><el-input v-model="config.width"></el-input></el-form-item>
    <el-form-item label="height"><el-input v-model="config.height"></el-input></el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>
