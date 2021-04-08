import { createStore } from 'vuex';
import { queryPageList } from '@/network/api';

// Create a new store instance.
const store = createStore({
  state() {
    return {
      baseList: [
        {
          label: '统计图表',
          // icon: 'icon-zhuzhuangtu',
          icon: 'data-analysis',
          children: [],
          img: 'chart',
        },
        {
          label: '卡片组件',
          icon: 'bank-card',
          children: [],
          img: 'card',
        },
        {
          label: '列表组件',
          icon: 'tickets',
          children: [],
          img: 'list',
        },
        {
          label: '其他组件',
          icon: 'menu',
          children: [],
          img: 'target',
        },
      ],
      tokens: [],
      interfaces: [],
      tempList: [],
      pageList: [],
      remMultiple: 1, // rem计算倍数
      project: {
        // id: 1,
        // name: '',
      },
    };
  },
  getters: {
    baseList: state => state.baseList,
    tokens: state => state.tokens,
    interfaces: state => state.interfaces,
    tempList: state => state.tempList,
    pageList: state => state.pageList,
    remMultiple: state => state.remMultiple,
    project: state => state.project,
  },
  mutations: {
    initChartBaseList(state, payload) {
      state.baseList[0].children.push(payload);
    },
    initCardBaseList(state, payload) {
      state.baseList[1].children.push(payload);
    },
    initListBaseList(state, payload) {
      state.baseList[2].children.push(payload);
    },
    initDescBaseList(state, payload) {
      state.baseList[3].children.push(payload);
    },
    SET_TOKENS(state, payload) {
      state.tokens = payload;
    },
    ADD_TOKEN(state, payload) {
      const list = state.tokens.map(item => item.getId());
      if (!list.includes(payload.getId())) {
        state.tokens.push(payload);
      }
    },
    DEL_TOKEN(state, payload) {
      state.tokens.splice(payload, 1);
    },
    SET_INTERFACES(state, payload) {
      state.interfaces = payload;
    },
    ADD_INTERFACE(state, payload) {
      const list = state.interfaces.map(item => item.getId());
      if (!list.includes(payload.getId())) {
        state.interfaces.push(payload);
      }
    },
    DEL_INTERFACE(state, payload) {
      state.interfaces.splice(payload, 1);
    },
    SET_TEMPLATE(state, payload) {
      state.tempList.push(payload);
    },
    SET_PAGELIST(state, payload) {
      state.pageList = payload;
    },
    ADD_PAGELIST(state, payload) {
      state.pageList.push(payload);
    },
    SET_REM_MULTIPLE(state, payload) {
      state.remMultiple = payload;
    },
    SET_PROJECT(state, { id, name }) {
      state.project = {
        id,
        name,
      };
    },
    CLEAN_PROJECT(state) {
      state.project = {};
    }
  },
  actions: {
    async queryPageList({ state, commit }) {
      const res = await queryPageList({ projectId: state.project.id });
      if (res.code === 200) {
        const pageList = res.result;
        commit('SET_PAGELIST', pageList);
      }
    },
  },
});

export default store;
