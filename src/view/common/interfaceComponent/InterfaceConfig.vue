<template>
  <div class="interface-list">
    <p><span>接口名称</span><span>接口地址</span><span>操作</span></p>
    <p v-for="(inter, index) in interfaces" :key="index">
      <span class="Interface-value">{{ inter.name }}</span>
      <span class="Interface-value" :title="inter.url">{{ inter.url }}</span>
      <span class="Interface-opt">
        <el-button type="text" size="mini" icon="el-icon-edit" @click="toEdit(index)"></el-button>
        <el-button type="text" size="mini" icon="el-icon-delete" @click="del(index)"></el-button>
      </span>
    </p>
    <div class="add-Interface"><el-button type="primary" size="medium" class="block" @click="toAdd()">添加接口</el-button></div>
    <el-drawer :title="title" v-model="visible" direction="rtl">
      <div style="margin: 20px; text-align: left">
        <el-form label-position="left" size="small">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="url地址">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="方法">
            <el-select v-model="form.method" placeholder="请选择">
              <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参数">
            <el-input type="textarea" :rows="10" v-model="form.param"></el-input>
          </el-form-item>
          <el-form-item label="是否需要认证">
            <el-switch v-model="form.isUseToken"></el-switch>
          </el-form-item>
          <template v-if="form.isUseToken">
            <el-form-item label="选择TOKEN">
              <el-select v-model="form.tokenId" placeholder="请选择">
                <el-option v-for="item in tokenList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="TOKEN传递位置">
              <el-select v-model="form.tokenPosition" placeholder="请选择">
                <el-option v-for="item in positions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="key">
              <el-input v-model="form.tokenKey"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="响应格式化">
            <el-input type="textarea" :rows="10" v-model="form.formatter"></el-input>
          </el-form-item>
          <el-form-item label-width="0px">
            <el-button type="primary" size="medium" @click="add()">保存</el-button>
            <el-button type="primary" size="medium" @click="getNewData()" v-if="form.id">刷新数据</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import InterClass from './Interface.js';

export default {
  setup() {
    const store = useStore(); // Vuex属性
    const tokens = computed(() => store.getters.tokens);
    // eslint-disable-next-line
    const tokenList = computed(() => {
      return tokens.value.map(item => {
        return {
          label: item.name,
          value: item.getId(),
        };
      });
    });
    const interfaces = computed(() => store.getters.interfaces);
    const methods = reactive([
      {
        label: 'GET',
        value: 'get',
      },
      {
        label: 'POST',
        value: 'post',
      },
    ]);
    const positions = reactive([
      {
        label: 'HEADER',
        value: 'header',
      },
      {
        label: 'QUERY',
        value: 'query',
      },
    ]);
    const visible = ref(false);
    const title = ref('新增INTERFACE');
    const form = reactive({
      id: '',
      name: '',
      url: '',
      method: 'get',
      param: '{}',
      formatter: '(res) => res',
      isUseToken: false,
      tokenId: '',
      tokenPosition: '',
      tokenKey: '',
    });

    const toAdd = () => {
      title.value = '新增INTERFACE';
      visible.value = true;
      form.id = '';
      form.name = '汾河排污';
      // form.url = '/api/lscy/industryLocation';
      form.url = '/test';
      form.method = 'get';
      form.param = '{}';
      form.formatter = '(res) => res';
      form.isUseToken = false;
      form.tokenId = '';
      form.tokenPosition = '';
      form.tokenKey = 'Authorization';
    };

    const toEdit = index => {
      title.value = '修改INTERFACE';
      visible.value = true;
      const inter = interfaces.value[index];
      form.id = inter.getId();
      form.name = inter.name;
      form.url = inter.url;
      form.method = inter.method;
      form.param = JSON.stringify(inter.param);
      form.formatter = inter.formatter;
      form.isUseToken = inter.isUseToken;
      form.tokenId = inter.tokenId;
      form.tokenPosition = inter.tokenPosition;
      form.tokenKey = inter.tokenKey;
    };

    const add = () => {
      if (form.id) {
        const inter = interfaces.value.filter(item => item.getId() === form.id)[0];
        inter.name = form.name;
        inter.url = form.url;
        inter.method = form.method;
        inter.param = JSON.parse(form.param);
        inter.formatter = form.formatter;
        inter.isUseToken = form.isUseToken;
        inter.tokenId = form.tokenId;
        inter.tokenPosition = form.tokenPosition;
        inter.tokenKey = form.tokenKey;
        inter.setToken(tokens.value.filter(item => item.getId() === form.tokenId)[0]);
      } else {
        const obj = JSON.parse(JSON.stringify(form));
        obj.param = JSON.parse(obj.param);
        obj.id = (Math.random() * 1000).toFixed(0) + new Date().getTime();
        [obj.token] = tokens.value.filter(item => item.getId() === form.tokenId);
        const inter = new InterClass(obj);
        store.commit('ADD_INTERFACE', inter);
      }
      visible.value = false;
    };

    const del = index => {
      store.commit('DEL_INTERFACE', index);
    };

    const getNewData = () => {
      add();
      if (form.id) {
        const inter = interfaces.value.filter(item => item.getId() === form.id)[0];
        inter.queryData().then(() => {
          visible.value = false;
        });
      }
    };
    const toJson = () => `[${interfaces.value.map(item => item.toString()).join(',')}]`;

    return {
      visible,
      title,
      methods,
      positions,
      form,
      toAdd,
      toEdit,
      add,
      del,
      getNewData,
      toJson,
      tokenList,
      interfaces,
    };
  },
};
</script>
<style lang="scss">
.el-drawer {
  overflow: scroll;
}
</style>
<style lang="scss" scoped>
.interface-list {
  font-size: 16px;
  .interface-value {
    margin-left: 10px;
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) */
    white-space: nowrap; /* 不换行 */
  }
  .interface-opt {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  p {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    span {
      width: 50%;
      text-align: center;
      height: 20px;
      line-height: 20px;
    }
  }
  p:first-child {
    // background: blue;
    color: #859094;
  }
  .add-interface {
    margin-top: 30px;
  }
  // element组件样式
  :deep(.el-select) {
    display: block;
  }
}
</style>
