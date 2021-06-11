import Shape from './shape/index.vue';

export default {
  install: app => {
    app.component('Shape', Shape);
  }
}