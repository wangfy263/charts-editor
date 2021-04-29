import Interface from './Interface';
import { getTokenValueById } from '../tokenComponent/TokenUtil';
import request from './axios-drive';

const interfaces = [];

const drive = {
  request,   // ajax驱动,这里使用的是axios
  getTokenValueById,  // 获取token的方法
};

export function createInterface({name, url, method, param, formatter, isUseToken, tokenId, tokenPosition, tokenKey }) {
  if (!checkInParam) {
    return interfaces;
  }
  const id = (Math.random() * 1000).toFixed(0) + new Date().getTime();
  const i = new Interface({ id, name, url, method, param, formatter, isUseToken, tokenId, tokenPosition, tokenKey }, drive);
  interfaces.push(i);
  return interfaces;
}

export function updateInterface({ id, name, url, method, param, formatter, isUseToken, tokenId, tokenPosition, tokenKey }) {
  if (!id) {
    console.error('修改接口, 必须传id!');
    return interfaces;
  }
  if (!checkInParam) {
    return interfaces;
  }
  const i = interfaces.filter(item => item.getId() === id)[0];
  i.name = name;
  i.url = url;
  i.method = method;
  i.param = param;
  i.formatter = formatter;
  i.isUseToken = isUseToken;
  i.tokenId = tokenId;
  i.tokenPosition = tokenPosition;
  i.tokenKey = tokenKey;
  return interfaces;
}

export function delInterface(id) {
  if (!id) {
    console.error('删除接口, 必须传id!');
    return interfaces;
  }
  const index = interfaces.map(item => item.getId()).indexOf(id);
  if (index >= 0) {
    interfaces.splice(index, 1);
  }
  return interfaces;
}

export function getInterfaces() {
  return interfaces;
}

export function getInterfaceById(id) {
  return interfaces.filter(item => item.getId() === id)[0];
}

export function checkInterfaceEquals({ id, name, url, method, param, formatter, isUseToken, tokenId, tokenPosition, tokenKey }) {
  if (!id && id !== 0) {
    return false;
  }
  const i = interfaces.filter(item => item.getId() === id)[0];
  if (
    i.name === name &&
    i.url === url &&
    i.method === method &&
    i.param === param &&
    i.formatter === formatter &&
    i.isUseToken === isUseToken &&
    i.tokenId === tokenId &&
    i.tokenPosition === tokenPosition &&
    i.tokenKey === tokenKey
  ) {
    return true;
  } else {
    return false;
  }
}

export function initInterfaceStr(interfaceJson) {
  const interfaceList = JSON.parse(interfaceJson);
  interfaceList.forEach(item => {
    createInterface(item);
  });
}

export function interfaceToJson() {
  return `[${interfaces.map(item => item.toString()).join(',')}]`;
}

export async function refreshDataById(id, selParams) {
  const inter = interfaces.filter(item => item.getId() === id)[0];
  console.log(inter);
  await inter.queryData(selParams);
  return interfaces;
}

function checkInParam({ name, url, method, param, formatter, isUseToken, tokenId, tokenPosition, tokenKey }) {
  if (!name) {
    console.error('接口名称不能为空');
    return false;
  }
  if (!url) {
    console.error('接口地址不能为空！');
    return false;
  }
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const m = method.toUpperCase();
  if (!methods.includes(m)) {
    console.error('接口调用方式错误,请检查！');
    return false;
  }
  try {
    if (typeof param !== 'object' && typeof param !== 'number') {
      console.error('参数格式不正确,请检查！');
      return false;
    }
    if (typeof param === 'string') {
      JSON.parse(param);
    }
  } catch (e) {
    console.error('参数JSON格式不正确,请检查！');
    return false;
  }
  if (typeof formatter === 'string') {
    const fn = eval(formatter);
    if (typeof fn !== 'function') {
      console.error('响应处理函数格式不正确,请检查！');
      return false;
    }
  }
  if (isUseToken) {
    if (!tokenId || !tokenPosition || !tokenKey) {
      console.error('Token设置不正确,请检查！');
      return false;
    }
  }
  return true;
}
