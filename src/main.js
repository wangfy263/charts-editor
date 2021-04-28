import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
// eslint-disable-next-line
import _ from 'lodash';
import './libs/echarts';
import App from './App.vue';
import router from './router';
import store from './store';
import comps from '../components';

const app = createApp(App);
// app.config.globalProperties._ = _; // 挂载loadsh
// app.provide('_', _);
window._ = _;
app.use(comps);
app.use(router).use(store).use(ElementPlus);
app.mount('#app');