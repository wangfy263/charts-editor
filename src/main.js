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
import components from './components';
import animated from 'animate.css';

const app = createApp(App);
// app.config.globalProperties._ = _; // 挂载loadsh
// app.provide('_', _);
window._ = _;
app.use(comps);
app.use(components);
app.use(router).use(store).use(ElementPlus);
// app.use(animated); 
app.mount('#app');