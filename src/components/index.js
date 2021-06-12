import SvgIcon from './svgIcon/SvgIcon.vue';
import Ruler from './ruler/Ruler.vue';
import Shape from './shape/Shape.vue';

export default {
  install: app => {
    app.component('SvgIcon', SvgIcon);
    app.component('Ruler', Ruler);
    app.component('Shape', Shape);    
  }
}