// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, LineChart, PieChart, RadarChart, GaugeChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  GridSimpleComponent,
  GridComponent,
  PolarComponent,
  RadarComponent,
  GeoComponent,
  SingleAxisComponent,
  ParallelComponent,
  CalendarComponent,
  GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  TitleComponent,
  TimelineComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
  LegendScrollComponent,
  LegendPlainComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
  AriaComponent,
  TransformComponent,
  DatasetComponent,
} from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';


// 注册必须的组件
echarts.use([
  // 图表
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GaugeChart,
  // 组件
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  PolarComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  // 渲染器
  CanvasRenderer,
]);

window.echarts = echarts;
export default echarts;
