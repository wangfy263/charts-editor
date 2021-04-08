import request from '@/network/request';

export function get(url, params) {
  return request({
    method: 'GET',
    url,
    params,
  });
}

export function post(url, data) {
  return request({
    method: 'POST',
    url,
    data,
  });
}

export function savePage(data = {}) {
  return request({
    method: 'POST',
    url: '/dimp/interface/Pages',
    data,
  });
}
export function saveAsPage(data = {}) {
  const { id } = data;
  return request({
    method: 'POST',
    url: `/dimp/interface/Pages/saveAs/${id}`,
    data,
  });
}
export function updPage(data = {}) {
  const { id } = data;
  // delete data.id;
  return request({
    method: 'PUT',
    url: `/dimp/interface/Pages/${id}`,
    data,
  });
}
export function queryPageById(params) {
  return request({
    method: 'GET',
    // url: '/queryPageById',
    url: `/dimp/interface/Pages/${params.id}`,
    params,
  });
}

export function queryPageList(params) {
  return request({
    method: 'GET',
    url: '/dimp/interface/Pages',
    params,
  });
}

export function delPage(data) {
  return request({
    method: 'DELETE',
    url: `/dimp/interface/Pages/${data.id}`,
    data,
  });
}

export function saveApp(data = {}) {
  return request({
    method: 'POST',
    url: '/dimp/interface/Apps',
    data,
  });
}
export function saveAsApp(data = {}) {
  const { appId } = data;
  return request({
    method: 'POST',
    url: `/dimp/interface/Apps/saveAs/${appId}`,
    data,
  });
}
export function updApp(data = {}) {
  const { appId } = data;
  // delete data.appId;
  return request({
    method: 'PUT',
    url: `/dimp/interface/Apps/${appId}`,
    data,
  });
}
export function queryAppById(params) {
  return request({
    method: 'GET',
    // url: '/queryPageById',
    url: `/dimp/interface/Apps/${params.appId}`,
    params,
  });
}
export function queryAppList(params) {
  return request({
    method: 'GET',
    url: '/dimp/interface/Apps',
    params,
  });
}

export function delApp(data) {
  return request({
    method: 'DELETE',
    url: `/dimp/interface/Apps/${data.appId}`,
    data,
  });
}

export function getPagesHistory(params) {
  const { id } = params;
  return request({
    method: 'GET',
    url: `/dimp/interface/Pages/His/${id}`,
    params,
  });
}
export function getAppsHistory(params) {
  const { id } = params;
  return request({
    method: 'GET',
    url: `/dimp/interface/Apps/His/${id}`,
    params,
  });
}
export function getPagesHistoryInfo(params) {
  const { id } = params;
  return request({
    method: 'GET',
    url: `/dimp/interface/HisPages/${id}`,
    params,
  });
}
export function getAppsHistoryInfo(params) {
  const { appId } = params;
  return request({
    method: 'GET',
    url: `/dimp/interface/HisApps/${appId}`,
    params,
  });
}
export function recoverPagesHistory(data) {
  const { id } = data;
  return request({
    method: 'PUT',
    url: `/dimp/interface/Pages/recover/${id}`,
    data,
  });
}
export function recoverAppsHistory(data) {
  const { id } = data;
  return request({
    method: 'PUT',
    url: `/dimp/interface/Apps/recover/${id}`,
    data,
  });
}

export function uploadImg(data) {
  return request({
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/dimp/upload_mobile_img/add',
    data,
  });
}

export function queryChannels(params) {
  return request({
    method: 'GET',
    url: '/dimp/interface/Channels',
    params,
  });
}

export function publishApp(data) {
  const { appId } = data;
  return request({
    method: 'PUT',
    url: `/dimp/interface/Apps/publish/${appId}`,
    data,
  });
}

export function unpublished(data) {
  const { appId } = data;
  return request({
    method: 'PUT',
    url: `/dimp/interface/Apps/unpublished/${appId}`,
    data,
  });
}

export function queryProjects(params) {
  return request({
    method: 'GET',
    url: '/dimp/interface/Projects',
    params,
  });
}

export function addPro(data) {
  return request({
    method: 'POST',
    url: '/dimp/interface/Projects',
    data,
  });
}

export function updatePro(data) {
  const { id } = data;
  return request({
    method: 'PUT',
    url: `/dimp/interface/Projects/${id}`,
    data,
  });
}

export function deletePro(data) {
  const { id } = data;
  return request({
    method: 'DELETE',
    url: `/dimp/interface/Projects/${id}`,
    data,
  });
}
