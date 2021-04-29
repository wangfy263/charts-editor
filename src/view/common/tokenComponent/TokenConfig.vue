<template>
  <div class="token-list">
    <p><span>名称</span><span>TOKEN</span><span>操作</span></p>
    <p v-for="(token, index) in state.tokens" :key="index">
      <span class="token-value">{{ token.name }}</span>
      <span class="token-value" :title="token.getTokenValue()">{{ token.getTokenValue() }}</span>
      <span class="token-opt">
        <el-button type="text" size="mini" icon="el-icon-edit" @click="toEdit(token.getId())"></el-button>
        <el-button type="text" size="mini" icon="el-icon-delete" @click="del(token.getId())"></el-button>
      </span>
    </p>
    <div class="add-token"><el-button type="primary" size="medium" class="block" @click="toAdd()">添加token</el-button></div>
    <el-drawer :title="title" v-model="visible" direction="rtl">
      <div style="margin: 20px">
        <el-form label-position="left" size="small">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <span v-if="form.id">{{ types.filter(item => item.value === form.type)[0].label }}</span>
            <el-select v-model="form.type" placeholder="请选择" v-else>
              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.type === 0">
            <el-form-item label="token"><el-input v-model="form.token" type="textarea" :rows="10"></el-input></el-form-item>
          </template>
          <template v-if="form.type === 1">
            <el-form-item label="url地址">
              <el-input v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="方法">
              <el-select v-model="form.method" placeholder="请选择">
                <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="失效时间">
              <el-input v-model="form.expCycle"></el-input>
            </el-form-item>
            <el-form-item label="参数">
              <el-input type="textarea" :rows="10" v-model="form.param"></el-input>
            </el-form-item>
            <el-form-item label="响应格式化">
              <el-input type="textarea" :rows="10" v-model="form.formatter"></el-input>
            </el-form-item>
          </template>
          <el-form-item label-width="0px">
            <el-button type="primary" size="medium" @click="add()" plain>保存</el-button>
            <el-button type="primary" size="medium" @click="getNewToken()" v-if="form.id && form.type === 1" plain>刷新TOKEN</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { ref, reactive, computed, nextTick } from 'vue';
// import Token from './Token.js';
import { createToken, updateToken, delToken, getTokens, getTokenById, tokenToJson, refreshToken, checkTokenEquals } from './TokenUtil';

export default {
  setup() {
    const state = reactive({
      tokens: getTokens(),
    });
    const visible = ref(false);
    const title = ref('新增token');
    const form = reactive({
      id: '',
      name: '',
      url: '',
      type: 0,
      method: 'get',
      param: '{}',
      token: '',
      formatter: '() => {}',
      expCycle: 3600000,
    });
    const types = reactive([
      {
        label: '静态token',
        value: 0,
      },
      {
        label: '动态token',
        value: 1,
      },
    ]);
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
    const toAdd = () => {
      title.value = '新增TOKEN';
      visible.value = true;
      form.id = '';
      form.name = '灵石大屏';
      form.url = '';
      form.type = 0;
      form.method = 'get';
      // eslint-disable-next-line operator-linebreak
      form.token =
        'Bearer-eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NzcxNDk3MDksInVzZXJuYW1lIjoiYWRtaW4ifQ.nIPbEChzi5TwuvpD0ZcfxSlt0u3iK-fDqLO76uWaM38';
      form.param = '{}';
      form.expCycle = 3600000;
      form.formatter = '(res) => res';
    };
    const toEdit = id => {
      title.value = '修改TOKEN';
      visible.value = true;
      const token = getTokenById(id);
      form.id = token.getId();
      form.name = token.name;
      form.url = token.url;
      form.type = token.getType();
      form.method = token.method;
      form.token = token.getType() === 0 ? token.getTokenValue() : '';
      form.param = token.param;
      form.expCycle = token.expCycle;
      form.formatter = token.formatter;
    };
    const add = () => {
      if (form.id) {
        state.tokens = updateToken(form);
      } else {
        const obj = JSON.parse(JSON.stringify(form));
        state.tokens = createToken(obj);
      }
      visible.value = false;
    };
    const del = id => {
      state.tokens = [];
      state.tokens = delToken(id);
    };
    const getNewToken = () => {
      console.log(checkTokenEquals(form));
      if (!checkTokenEquals(form)) {
        updateToken(form);
      }
      refreshToken(form.id).then(res => {
        state.tokens = res;
        visible.value = false;
      })
    };
    const toJson = tokenToJson();
    return {
      state,
      visible,
      title,
      form,
      types,
      methods,
      toAdd,
      toEdit,
      add,
      del,
      getNewToken,
      toJson,
    };
  },
};
</script>
<style lang="scss" scoped>
.token-list {
  font-size: 16px;
  .token-value {
    margin-left: 10px;
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) */
    white-space: nowrap; /* 不换行 */
  }
  .token-opt {
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
  .add-token {
    margin-top: 30px;
  }

  // element组件样式
  :deep(.el-select) {
    display: block;
  }
}
</style>
