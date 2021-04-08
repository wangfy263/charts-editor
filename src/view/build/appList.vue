<template>
  <el-container v-if="!pro.id">
    <el-header height="46">我的项目</el-header>
    <el-main style="margin: 50px 50px 10px 50px">
      <el-button type="primary" style="margin-left: 18px" @click="dialogNewProjectVisible = true">新建</el-button>
      <div class="item-list">
        <el-card
          style="margin: 20px 0 0 15px; width: 250px"
          :body-style="{ height: '260px', padding: '0px' }"
          v-for="(project, index) in status.projects"
          :key="index"
        >
          <div
            style="border-bottom: 1px solid #ccc; height: 200px; display: flex; justify-content: center"
            @click="checkProject(project.id, project.name)"
          >
            <i class="el-icon-folder" style="line-height: 200px; font-size: 50px; color: #409eff"></i>
          </div>
          <div style="padding: 10px; line-height: 50px; display: flex; justify-content: space-between">
            <div>
              {{ project.name }}<i class="el-icon-edit" style="margin-left: 15px; color: #409eff" @click="openDialog(project.id, project.name)"></i>
            </div>
            <div v-if="isAllowDel">
              <el-dropdown style="height: 16px">
                <el-button type="text"><i class="el-icon-more-outline el-icon--right"></i> </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <div style="width: 100px; text-align: center">
                      <el-button type="text" icon="el-icon-delete" class="button" style="color: #f56c6c" @click="toDelPro(project.id)"
                        >删除</el-button
                      >
                    </div>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-card>
      </div>
    </el-main>
  </el-container>
  <el-container v-else>
    <!-- <el-header height="46"><i style="margin-right: 10px" @click="cleanCheck()">&lt</i>{{ pro.name }}</el-header> -->
    <el-header height="46">
      <i style="margin-right: 10px" @click="cleanCheck()">&lt</i>
      <el-select v-model="pro.name" placeholder="请选择" @change="(val) => { checkProject(val, pro.name) }">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </el-header>
    <el-main style="margin: 50px 50px 10px 50px">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="我的应用" name="app">
          <div class="item-list">
            <div style="display: flex; flex-direction: row-reverse; width: 100%; margin-bottom: 10px">
              <el-button type="primary" @click="dialogTemplateVisible = true">Create</el-button>
            </div>
            <el-table :data="status.appList" border style="width: 100%">
              <el-table-column prop="appName" label="APP名称"> </el-table-column>
              <el-table-column prop="createUserName" label="创建人"> </el-table-column>
              <el-table-column prop="createTime" label="创建时间"> </el-table-column>
              <el-table-column prop="isPublishedName" label="发布状态" width="100"> </el-table-column>
              <el-table-column prop="channelName" label="发布渠道" width="200"> </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" width="300">
                <template #default="scope">
                  <el-button @click="toPreviewApp(scope.row.appId)" type="text" size="small">预览</el-button>
                  <el-button @click="toEditAPPById(scope.row.appId)" type="text" size="small">编辑</el-button>
                  <el-button @click="toDelApp(scope.row.appId)" type="text" size="small" v-if="scope.row.isPublished === '0'">删除</el-button>
                  <el-button
                    @click="
                      dialogFormVisible = true;
                      status.issue.id = scope.row.appId;
                      status.issue.name = scope.row.appName;
                    "
                    v-if="scope.row.isPublished === '0'"
                    type="text"
                    size="small"
                    >发布</el-button
                  >
                  <el-button @click="downLine(scope.row.appId, scope.row.appName)" v-if="scope.row.isPublished === '1'" type="text" size="small">
                    下线
                  </el-button>
                  <el-button type="text" size="small" @click="alertHistory(scope.row, 'app')">历史版本</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的页面" name="page">
          <div class="item-list">
            <div class="add-page" @click="toAddPage()">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <el-card style="margin: 20px 0 0 15px; width: 284px" :body-style="{ height: '447px' }" v-for="page in status.pages">
              <img :src="page.thumbnail" class="image" @click="toEditPage(page.id)" height="380" />
              <div style="padding: 10px">
                <span>{{ page.pageName }}</span>
                <div class="bottom">
                  <time class="time">{{ page.createTime }}</time>
                  <div>
                    <el-dropdown style="height: 16px">
                      <el-button type="text"><i class="el-icon-more-outline el-icon--right"></i> </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <div style="width: 100px; text-align: center">
                            <el-button type="text" icon="el-icon-delete" class="button" style="color: #f56c6c" @click="toDelPage(page.id)"
                              >删除</el-button
                            >
                          </div>
                          <div style="width: 100px; text-align: center">
                            <el-button type="text" icon="el-icon-s-grid" class="button" @click="alertHistory(page, 'page')">历史</el-button>
                          </div>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <historyTable v-model="hisVisible" :page="pageInfo" v-if="hisVisible" :type="pageType"></historyTable>
  </el-container>
  <el-dialog title="发布" v-model="dialogFormVisible">
    <el-form>
      <el-form-item label="选择发布渠道" label-width="80">
        <el-checkbox-group v-model="status.checkedChannels">
          <el-checkbox v-for="channel in status.channels" :label="channel.code" :key="channel.id">{{ channel.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="issue()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="选择应用模板，创建应用 >>" v-model="dialogTemplateVisible">
    <div class="item-list">
      <el-card style="margin: 20px 0 0 15px; width: 284px" :body-style="{ height: '447px' }" v-for="(temp, index) in temps" :key="index">
        <img :src="`/icon/${temp.option.icon}.png`" class="image" @click="toEditAPP(temp, index)" height="390" />
        <div style="padding: 10px">
          <span>{{ temp.label }}</span>
          <div class="bottom">
            <time class="time">{{ temp.option.desc }}</time>
            <el-button type="text" icon="el-icon-edit" class="button" @click="toEditAPP(temp, index)">编辑</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTemplateVisible = false">取 消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="新建项目" v-model="dialogNewProjectVisible">
    <el-form>
      <el-form-item label="项目名称" label-width="80">
        <el-input v-model="projectName" placeholder="请输入项目名称" :maxlength="20"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogNewProjectVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProject()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="修改项目" v-model="dialogUpdProjectVisible">
    <el-form>
      <el-form-item label="项目名称" label-width="80">
        <el-input v-model="projectName" placeholder="请输入项目名称" :maxlength="20"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogUpdProjectVisible = false">取 消</el-button>
        <el-button type="primary" @click="toUpdPro()">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import {
  queryPageList,
  queryAppList,
  delApp,
  delPage,
  queryChannels,
  publishApp,
  unpublished,
  queryProjects,
  addPro,
  updatePro,
  deletePro,
} from '@/network/api';
import { setCookie } from '@/utils/util';
import historyTable from '../common/historyTableComponent/historyTable.vue';

export default {
  components: {
    historyTable,
  },
  setup() {
    const store = useStore();
    const activeName = ref('app');
    const temps = computed(() => store.getters.tempList);
    const router = useRouter();
    const route = useRoute();
    const { token } = route.query;
    if (token) {
      setCookie('Authorization', `Bearer-${token}`);
    }
    const toAddPage = () => {
      router.push('/page');
    };
    const toEditAPP = (temp, index) => {
      router.push(`/app/${index}`);
    };
    const toEditAPPById = id => {
      router.push(`/appEdit/${id}`);
    };
    const toEditPage = id => {
      router.push(`/page/${id}`);
    };
    const toPreviewApp = appId => {
      router.push(`/previewApp/${appId}`);
    };
    const status = reactive({
      pages: [],
      appList: [],
      checkedChannels: [],
      channels: [],
      issue: {},
      projects: [],
    });
    const toDelApp = appId => {
      ElMessageBox.confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delApp({ appId }).then(res => {
          if (res.code === 200) {
            ElMessage.success('删除成功!');
            initAppList();
          } else {
            ElMessage.error('error!');
          }
        });
      });
    };
    const toDelPage = id => {
      ElMessageBox.confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delPage({ id }).then(res => {
          if (res.code === 200) {
            ElMessage.success('删除成功!');
            initPageList();
          } else {
            ElMessage.error('error!');
          }
        });
      });
    };
    const hisVisible = ref(false);
    const pageInfo = ref({});
    const pageType = ref(null);
    const alertHistory = (data, type) => {
      hisVisible.value = true;
      if (type === 'page') {
        pageType.value = type;
        pageInfo.value = data;
      } else {
        pageType.value = type;
        pageInfo.value = data;
      }
    };
    // 发布
    const getChannels = () => {
      queryChannels({}).then(res => {
        if (res.code === 200) {
          status.channels = res.result;
        }
      });
    };
    getChannels();
    const dialogFormVisible = ref(false);
    const dialogTemplateVisible = ref(false);
    const dialogNewProjectVisible = ref(false);
    const dialogUpdProjectVisible = ref(false);
    const issue = () => {
      if (status.checkedChannels.length === 0) {
        ElMessage.error('请先选择发布渠道!');
        return;
      }
      dialogFormVisible.value = false;
      ElMessageBox.confirm(`是否发布${status.issue.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        publishApp({
          appId: status.issue.id,
          channel: status.checkedChannels.join(','),
        }).then(res => {
          if (res.code === 200) {
            ElMessage.success('发布成功!');
            initAppList();
          } else {
            ElMessage.error('error!');
          }
        });
      });
    };
    // 下线
    const downLine = (appId, name) => {
      ElMessageBox.confirm(`是否下线${name}?下线后${name}将不能访问`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        unpublished({ appId }).then(res => {
          if (res.code === 200) {
            ElMessage.success('下线操作成功!');
            initAppList();
          } else {
            ElMessage.error('error!');
          }
        });
      });
    };

    // 当前项目
    const project = computed(() => store.getters.project);
    const initPageList = () => {
      if (project.value.id) {
        queryPageList({ projectId: project.value.id }).then(res => {
          if (res.code === 200) {
            status.pages = res.result;
          }
        });
      }
    };
    const initAppList = () => {
      if (project.value.id) {
        queryAppList({ projectId: project.value.id }).then(res => {
          if (res.code === 200) {
            status.appList = res.result;
          }
        });
      }
    };
    const checkProject = (id, name) => {
      store.commit('SET_PROJECT', { id, name });
      initPageList();
      initAppList();
    };
    initPageList();
    initAppList();
    const cleanCheck = () => {
      store.commit('CLEAN_PROJECT');
    };
    // 查询项目
    const options = computed(() => status.projects.map(item => {
      return {
        label: item.name,
        value: item.id,
      }
    }))
    const getProjects = () => {
      queryProjects({}).then(res => {
        if (res.code === 200) {
          status.projects = res.result;
        }
      });
    };
    getProjects();

    // 新建项目
    const projectName = ref('');
    const updateProId = ref('');
    const addProject = () => {
      if (!projectName.value) {
        ElMessage.error('请先输入名称!');
        return;
      }
      const param = {
        name: projectName.value,
      };
      addPro(param).then(res => {
        if (res.code === 200) {
          ElMessage.success('保存成功!');
          dialogNewProjectVisible.value = false;
          getProjects();
        }
      });
    };
    const toDelPro = id => {
      deletePro({ id }).then(res => {
        if (res.code === 200) {
          ElMessage.success('删除成功!');
          getProjects();
        }
      });
    };
    const openDialog = (id, name) => {
      updateProId.value = id;
      projectName.value = name;
      dialogNewProjectVisible.value = true;
    };
    const toUpdPro = () => {
      if (!projectName.value) {
        ElMessage.error('请先输入名称!');
        return;
      }
      const param = {
        id: updateProId.value,
        name: projectName.value,
      };
      updatePro(param).then(res => {
        if (res.code === 200) {
          ElMessage.success('修改成功!');
          dialogUpdProjectVisible.value = false;
          getProjects();
        }
      });
    };
    const isAllowDel = ref(false);
    isAllowDel.value = import.meta.env.VITE_APP_PROJECT_DEL === 'true';
    return {
      activeName,
      toAddPage,
      temps,
      toEditAPP,
      status,
      toEditPage,
      toEditAPPById,
      toDelApp,
      toDelPage,
      toPreviewApp,
      alertHistory,
      hisVisible,
      pageInfo,
      pageType,
      dialogFormVisible,
      dialogTemplateVisible,
      dialogNewProjectVisible,
      dialogUpdProjectVisible,
      issue,
      downLine,
      pro: project,
      checkProject,
      cleanCheck,
      projectName,
      addProject,
      toDelPro,
      openDialog,
      toUpdPro,
      isAllowDel,
      options,
    };
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/font/iconfont/iconfont.css';
@import '@/assets/css/style.scss';
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin: 10px 0;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button {
  // padding: 0;
  // min-height: auto;
}
.image {
  width: 100%;
  display: block;
}
.add-page {
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  width: 284px;
  height: 488px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  text-align: center;
  line-height: 479px;
  font-size: 40px;
  margin: 20px 0 0 15px;
}
.item-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
