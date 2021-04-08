<template>
  <BaseLayout />
</template>
<script>
import BaseLayout from './layout/BaseLayout.vue';

export default {
  components: {
    BaseLayout,
  },
  setup() {},
};
</script>

<style>
body {
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
::-webkit-scrollbar {
  width: 5px; /* 纵向滚动条*/
  height: 5px; /* 横向滚动条 */
  background-color: #fff;
}

/*定义滑块 内阴影*/
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: #d5d5d5;
}

/*定义滚动条轨道 内阴影*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: #fff;
}

/* 滚动条的滑轨背景颜色 */

::-webkit-scrollbar-button {
  background-color: transparent;
  height: 0px;
  width: 0px;
}

/* 滑轨两头的监听按钮颜色 */

::-webkit-scrollbar-corner {
  background-color: transparent;
  height: 0px;
  width: 0px;
}

/* 横向滚动条和纵向滚动条相交处尖角的颜色 */
</style>
