<template>
  <el-container>
    <el-header height="46"> 报表页面设计 </el-header>
    <el-container>
      <el-main @click.capture="active = -1">
        <div class="left-trigger">
          <div style="width: 50%; display: flex">
            <el-col :span="2">
              <el-button
                :icon="isTriggle ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"
                size="small"
                style="height: 40px; color: #409eff; border: 0; border-right: 2px solid #e8e8e8"
                @click="leftTrigger"
              ></el-button>
            </el-col>
            <el-col :span="3" v-for="(item, index) in baseList" :key="index" class="hover-style">
              <el-dropdown>
                <span class="el-dropdown-link" :title="item.label">
                  <el-button
                    :icon="`el-icon-${item.icon}`"
                    size="small"
                    style="height: 40px; border-radius: 0; border: 0; font-size: 16px"
                  ></el-button>
                  <!-- <i :class="'nav__icon iconfont ' + item.icon"></i> -->
                  <!-- <i class="el-icon-arrow-down el-icon--right icon-style"></i> -->
                </span>
                <template #dropdown>
                  <el-dropdown-menu style="padding: 0 20px">
                    <el-row :gutter="20">
                      <el-col
                        :span="item.children.length > 12 ? 2 : 24 / item.children.length"
                        class="dropdown-menu-li"
                        v-for="(v, i) in item.children"
                        :key="`${index}_${i}`"
                        @click="handleCommand(index, i)"
                      >
                        <img :src="`${baseUrl}icon/${v.option.img}.png`" class="report-icon" />
                        <div class="report-name">{{ v.label }}</div>
                      </el-col>
                    </el-row>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
          </div>
          <div class="save-btn">
            <!-- <el-button type="text" icon="el-icon-view" @click="preview()">预览</el-button>
            <el-button type="text" icon="el-icon-document-add" @click="savePageInfo()">保存</el-button>
            <el-button type="text" icon="el-icon-document-add" @click="saveAsPageInfo()">另存</el-button>
            <el-button type="text" icon="el-icon-back" style="color: #f56c6c" @click="goBack()">返回</el-button> -->
          </div>
        </div>
        <div class="phone-page" :style="pageStyle">
          <div class="app-canvas" id="J_app_canvas" :style="pageStyle">
            <component
              :id="'component_' + element.index"
              :componentId="element.componentId"
              :width="element.component.width"
              :height="element.component.height"
              :is="element.component.name"
              :ref="setItemRef"
              :component="element.component"
              :data="element.data"
              :dataSource="element.dataSource"
              :dataType="element.dataType"
              :option="element.component.option"
            ></component>
          </div>
        </div>
      </el-main>
      <el-aside width="360px">
        <el-form class="page-config-box" ref="form" size="small" style="text-align: left">
          <el-tabs type="border-card" style="height: calc(100% - 2px); overflow: auto">
            <el-tab-pane label="页面配置" v-if="active === -1">
              <el-form-item label="报表名称">
                <el-input v-model="pageConfig.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="报表简介">
                <el-input type="textarea" v-model="pageConfig.desc"></el-input>
              </el-form-item>
              <el-form-item label="背景颜色">
                <el-input v-model="pageConfig.bgColor">
                  <template #append><el-color-picker size="mini" show-alpha v-model="pageConfig.bgColor"></el-color-picker></template>
                </el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="TOKEN" v-if="active === -1">
              <TokenConfig ref="tokenConf"></TokenConfig>
            </el-tab-pane>
            <el-tab-pane label="接口" v-if="active === -1">
              <InterfaceConfig ref="interfaceConf"></InterfaceConfig>
            </el-tab-pane>
            <el-tab-pane label="组件配置" v-if="active !== -1">
              <!-- <InterfaceForComp v-model:propsObj="propsObj" v-on:handleRefresh="handleRefresh"></InterfaceForComp> -->
              <el-form-item label="图层名称"><el-input v-model="propsObj.activeObj.title"></el-input></el-form-item>
              <component :is="`${propsObj.activeObj.component.name}-config`" v-model:propsObj="propsObj">
                <el-tabs v-model="configActiveName" v-if="propsObj.activeObj.component.option.chartOption.componentId">
                  <el-tab-pane label="子组件配置" name="0"
                    ><component
                      :is="`${propsObj.activeObj.component.option.chartOption.component.name}-config`"
                      v-model:propsObj="childPropsObj"
                    ></component
                  ></el-tab-pane>
                  <el-tab-pane label="子组件数据" name="1">
                    <InterfaceForComp v-model:propsObj="childPropsObj" v-on:handleRefresh="handleRefresh"></InterfaceForComp>
                  </el-tab-pane>
                </el-tabs>
              </component>
            </el-tab-pane>
            <el-tab-pane label="接口管理" v-if="active !== -1">
              <InterfaceForComp v-model:propsObj="propsObj" v-on:handleRefresh="handleRefresh"></InterfaceForComp>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { v4 as uuidv4 } from 'uuid';
import TokenConfig from '@/view/common/tokenComponent/TokenConfig.vue';
import InterfaceConfig from '@/view/common/interfaceComponent/InterfaceConfig.vue';
import InterfaceForComp from '@/view/common/interfaceComponent/InterfaceForComp.vue';
import { ref, reactive, computed, watchEffect, onBeforeUpdate, toRaw, nextTick, provide } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Token from '../common/tokenComponent/Token.js';
import InterClass from '../common/interfaceComponent/Interface.js';

export default {
  components: {
    TokenConfig,
    InterfaceConfig,
    InterfaceForComp,
    draggable,
    ImageDepot,
  },
  setup() {
    const store = useStore(); // Vuex属性
    const baseList = computed(() => store.getters.baseList); // 可选组件列表
    const router = useRouter();
    const project = computed(() => store.getters.project);
    const route = useRoute();
    const pageId = route.params.id;
    const saveId = ref(0);
    const elements = reactive([]); // 画布的组件列表
    // 组件ref
    let itemRefs = [];
    const setItemRef = el => {
      let list = itemRefs.filter(item => !item.destruction);
      if (list.length > 0) {
        list = list.map(item => item.componentId);
      }
      if (el && !list.includes(el.componentId)) {
        itemRefs.push(el);
      }
    };
    onBeforeUpdate(() => {
      itemRefs = [];
    });

    const handlePhoneChange = val => {
      // eslint-disable-next-line
      const _xy = val.split(',');
      phoneWidth.value = parseInt(_xy[0], 10);
      phoneHeight.value = parseInt(_xy[1], 10);
      inputDisabled.value = !(phoneWidth.value === 400 && phoneHeight.value === 600);
      nextTick(() => {
        itemRefs.forEach(item => {
          item.initChart();
        });
      });
    };

    /* 页面加载初始化 */
    const queryPageInfo = id => {
      queryPageById({ id }).then(res => {
        if (res.code === 200) {
          const obj = res.result;
          const elementList = JSON.parse(obj.desScreenItemJson);
          const info = JSON.parse(obj.desScreenMainJson);
          pageConfig.name = obj.pageName;
          pageConfig.desc = obj.pageDesc;
          pageConfig.thumbnail = obj.thumbnail;
          pageConfig.bgColor = info.backgroundColor;
          pageConfig.backgroundImage = info.backgroundImage;
          // 初始化token
          const tokenList = JSON.parse(info.desTokenJson);
          tokenList.forEach(item => {
            const token = new Token(item);
            store.commit('ADD_TOKEN', token);
          });
          // 初始化接口
          const interfaceList = JSON.parse(info.desInterfaceJson);
          interfaceList.forEach(item => {
            const inter = new InterClass(item);
            store.commit('ADD_INTERFACE', inter);
          });
          // 初始化组件
          elementList.forEach((item, i) => {
            item.index = i;
            elements.push(item);
          });
        }
      });
    };
    if (pageId || pageId === 0) {
      queryPageInfo(pageId);
    }
    /* 选中组件 */
    const active = ref(-1); // 当前选中的组件,在列表elements中的下标
    const propsObj = reactive({});
    watchEffect(() => {
      const activeObj = elements.filter(item => active.value === item.index)[0] || {};
      propsObj.activeObj = activeObj;
    });
    // 点击选中组件
    const handleClick = index => {
      console.log(`active: ${index}`);
      active.value = index;
    };

    /* 添加组件 */
    function addComponent(parentIndex, childIndex) {
      const opt = _.cloneDeep(baseList.value[parentIndex].children[childIndex].option);
      opt.index = elements.length;
      opt.componentId = uuidv4();
      elements.push(opt);
    }
    function handleCommand(index, i) {
      addComponent(index, i);
    }

    /* 拖曳组件 */
    const enabled = ref(true);
    const dragging = ref(false);
    const checkMove = e => {
      console.log(`Future index: ${e.draggedContext.futureIndex}`);
    };
    /* 复制组件 */
    const handleCopy = id => {
      let index;
      const obj = elements.filter((item, i) => {
        if (item.componentId === id) {
          index = i;
          return true;
        }
        return false;
      })[0];
      // active.value = obj.index;
      const copyObj = _.cloneDeep(toRaw(obj));
      copyObj.index = elements.length;
      copyObj.componentId = uuidv4();
      if (copyObj.component.option.chartOption && copyObj.component.option.chartOption.componentId) {
        copyObj.component.option.chartOption.componentId = uuidv4();
      }
      elements.splice(index + 1, 0, copyObj);
      active.value = elements[index].index;
    };
    /* 删除组件 */
    const handleDel = id => {
      let index;
      elements.forEach((item, i) => {
        if (item.componentId === id) {
          index = i;
        }
      });
      active.value = -1;
      elements[index].destruction = true;
    };

    /* 组件数据刷新 */
    const handleRefresh = () => {
      // //数据处理
      itemRefs.filter(item => item.id === `component_${active.value}`)[0].initChart();
      // this.$refs['list_' + this.active][0].updateData();
      ElMessage.success('刷新成功');
    };
    // 左侧收起/展开
    const isTriggle = ref(true);
    const leftTrigger = () => {
      isTriggle.value = !isTriggle.value;
    };

    /* 保存数据 */
    const tokenConf = ref(null);
    const interfaceConf = ref(null);
    const savePageInfo = (isToPreview = false) => {
      active.value = -1;
      nextTick(() => {
        if (!pageConfig.name) {
          ElMessage.error('请先输入报表名称');
          return;
        }
        const l = elements.filter(item => !item.destruction);
        if (l.length === 0) {
          ElMessage.error('页面内容为空!');
          return;
        }
        const desScreenItemJson = JSON.stringify(elements.filter(item => !item.destruction));
        const allData = {
          desScreenItemJson, // 组件列表
          desScreenMainJson: JSON.stringify({
            // 大屏配置
            backgroundColor: pageConfig.bgColor, // 背景颜色
            backgroundImage: pageConfig.backgroundImage, // 背景图片
            desTokenJson: tokenConf.value.toJson(), // token列表
            desInterfaceJson: interfaceConf.value.toJson(), // 接口列表
          }),
          id: '',
          projectId: project.value.id,
          pageName: pageConfig.name, // 页面名称
          pageDesc: pageConfig.desc, // 页面简介
          thumbnail: 'https://y.app.10086.cn/YXMB/v3/oss/template/material/1612244274819_首页.png', // 缩略图地址
        };
        let SaveOrUpdate = savePage;
        if (pageId || saveId.value) {
          allData.id = pageId || saveId.value;
          SaveOrUpdate = updPage;
        }
        Html2canvas().then(img => {
          allData.thumbnail = img;
          SaveOrUpdate(allData).then(res => {
            if (res.code === 200) {
              ElMessage.success('保存成功!');
              saveId.value = res.result.id;
              if (isToPreview) {
                router.push(`/preview/${res.result.id}`);
              }
            }
          });
        });
      });
    };
    const preview = () => {
      ElMessageBox.confirm('预览需要先保存，是否保存当前页面?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        savePageInfo(true);
      });
    };
    const saveAsPageInfo = () => {
      active.value = -1;
      nextTick(() => {
        if (!pageId && !saveId.value) {
          ElMessage.error('请先保存！');
          return;
        }
        if (!pageConfig.name) {
          ElMessage.error('请先输入报表名称');
          return;
        }
        const l = elements.filter(item => !item.destruction);
        if (l.length === 0) {
          ElMessage.error('页面内容为空!');
          return;
        }
        const desScreenItemJson = JSON.stringify(elements.filter(item => !item.destruction));
        const allData = {
          desScreenItemJson, // 组件列表
          desScreenMainJson: JSON.stringify({
            // 大屏配置
            backgroundColor: pageConfig.bgColor, // 背景颜色
            backgroundImage: pageConfig.backgroundImage, // 背景图片
            desTokenJson: tokenConf.value.toJson(), // token列表
            desInterfaceJson: interfaceConf.value.toJson(), // 接口列表
          }),
          id: pageId || saveId.value,
          projectId: project.value.id,
          pageName: pageConfig.name, // 页面名称
          pageDesc: pageConfig.desc, // 页面简介
          thumbnail: 'https://y.app.10086.cn/YXMB/v3/oss/template/material/1612244274819_首页.png', // 缩略图地址
        };
        saveAsPage(allData).then(res => {
          if (res.code === 200) {
            ElMessage.success('另存成功!');
          }
        });
      });
    };
    // 子组件的处理
    const configActiveName = ref('0');
    const childPropsObj = reactive({
      activeObj: {},
    });
    watchEffect(() => {
      if (propsObj.activeObj.component) {
        childPropsObj.activeObj = propsObj.activeObj.component.option.chartOption;
      }
    });
    const goBack = () => {
      ElMessageBox.confirm('返回操作将丢失未保存数据，是否返回?', '提示', {
        confirmButtonText: '已保存，返回',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        router.push('/pageList');
      });
    };
    /* 编辑页面不可跳转 */
    provide('toDetail', () => {});
    provide('toPrev', () => {});

    return {
      baseList,
      elements,
      active,
      addComponent,
      phoneModel,
      phoneList,
      phoneWidth,
      phoneHeight,
      handlePhoneChange,
      inputDisabled,
      pageConfig,
      pageStyle,
      propsObj,
      handleRefresh,
      handleCommand,
      enabled,
      dragging,
      checkMove,
      handleClick,
      setItemRef,
      isTriggle,
      leftTrigger,
      handleCopy,
      handleDel,
      tokenConf,
      interfaceConf,
      savePageInfo,
      saveAsPageInfo,
      imgVisible,
      handleOpenImg,
      handleSetimg,
      configActiveName,
      childPropsObj,
      preview,
      goBack,
      baseUrl: import.meta.env.BASE_URL,
    };
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/font/iconfont/iconfont.css';
@import '@/assets/css/style.scss';
</style>
