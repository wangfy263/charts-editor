import svgIcon from './svgIcon/svgIcon.vue';
import ruler from './ruler/ruler.vue';
import Shape from './shape/index.vue';

export default {
  install: app => {
    app.component('svgIcon', svgIcon);
    app.component('ruler', ruler);
    app.component('Shape', Shape);
  }
}