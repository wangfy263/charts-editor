import Token from './Token';
import request from './axios-drive';

const _tokens = [];

const drive = {
  request, // ajax驱动,这里使用的是axios
};

export function createToken({ name, type, url, method, param = '{}', formatter = 'resp => resp', expCycle = 0, token }) {
  // 静态token, 无需设置param和formatter
  if (type === 0) {
    url = '';
    method = '';
    param = '{}';
    formatter = 'resp => resp';
    expCycle = 0;
  }
  // 超时设置
  let exp = 0;
  if (type === 1) {
    const expCycleType = typeof expCycle;
    if (expCycle === 'never' || expCycleType === 'number') {
      exp = expCycle || 'never'; // 设置为0时，也重置为never.
    } else if (expCycleType === 'string') {
      exp = parseInt(expCycle, 10);
    } else {
      exp = NaN;
    }
  }
  console.log('exp: ' + exp);
  if (!checkInParam({ name, type, url, method, param, formatter, exp, token })) {
    return _tokens;
  }
  const id = (Math.random() * 1000).toFixed(0) + new Date().getTime();
  const obj = { id, name, type, url, method, param, formatter, token };
  obj.expCycle = exp;
  const t = new Token(obj, drive);
  _tokens.push(t);
  return _tokens;
}

export function updateToken({ id, name, type, url, method, param = '{}', formatter = 'resp => resp', expCycle = 0, token }) {
  if (!id) {
    console.error('修改token, 必须传id!');
    return _tokens;
  }
  // 静态token, 无需设置param和formatter
  if (type === 0) {
    url = '';
    method = '';
    param = '{}';
    expCycle = 0;
    formatter = resp => resp;
  }
  // 超时设置
  let exp = 0;
  if (type === 1) {
    const expCycleType = typeof expCycle;
    if (expCycle === 'never' || expCycleType === 'number') {
      exp = expCycle || 'never'; // 设置为0时，也重置为never.
    } else if (expCycleType === 'string') {
      exp = parseInt(expCycle, 10);
    } else {
      exp = NaN;
    }
  }
  if (!checkInParam({ name, type, url, method, param, formatter, exp, token })) {
    return _tokens;
  }
  const t = _tokens.filter(item => item.getId() === id)[0];
  t.name = name;
  t.url = url;
  t.method = method;
  t.param = param;
  t.formatter = formatter;
  t.expCycle = exp;
  t.setType(type);
  if (t.getType() === 0) {
    t.setStaticToken(token);
    t.setExpTime('never');
  }
  if (t.getType() === 1) {
    t.setStaticToken('');
    t.setExpTime(new Date().getTime() + exp);
  }
  return _tokens;
}

export function delToken(id) {
  if (!id) {
    console.error('删除token, 必须传id!');
    return false;
  }
  const index = _tokens.map(item => item.getId()).indexOf(id);
  if (index >= 0) {
    _tokens.splice(index, 1);
  }
  return _tokens;
}

export function getTokens() {
  return _tokens;
}

export function getTokenById(id) {
  return _tokens.filter(item => item.getId() === id)[0];
}

export function getTokenValueById(id) {
  let t = _tokens.filter(item => item.getId() === id)[0];
  if (!t) {
    console.error('token不存在');
    return Promise.resolve('');
  }
  return t.getToken();
}

export function initTokenStr(tokenJson) {
  try {
    const tokenList = JSON.parse(tokenJson);
    tokenList.forEach(item => {
      createToken(item);
    });
    return _tokens;
  } catch (e) {
    console.error('tokenJson格式错误！');
  }
}

export function tokenToJson() {
  return `[${_tokens.map(item => item.toString()).join(',')}]`;
}

export async function refreshToken(id) {
  const token = _tokens.filter(item => item.getId() === id)[0];
  console.log(token);
  await token.getNewToken();
  return _tokens;
}

export function checkTokenEquals({ id, name, type, url, method, param = '{}', formatter = 'resp => resp', expCycle = 0, token }) {
  if (!id && id !== 0) {
    return false;
  }
  const t = _tokens.filter(item => item.getId() === id)[0];
  if (t.name === name && t.type === type && t.url === url && t.method === method && t.param === param && t.formatter === formatter) {
    return true;
  } else {
    return false;
  }
}

function checkInParam({ name, type, url, method, param, formatter, exp, token }) {
  if (!name) {
    console.error('名称不能为空');
    return false;
  }
  if (type === 0 && !token) {
    console.error('静态token, 值不能为空！');
    return false;
  }
  if (typeof param !== 'object' && typeof param !== 'string') {
    console.error('参数JSON格式不正确,请检查！');
    return false;
  }
  // 格式化入参
  try {
    if (typeof param === 'string') {
      JSON.parse(param);
    }
  } catch (e) {
    console.error('参数JSON格式不正确,请检查！');
    return false;
  }
  // 格式化响应处理函数
  if (typeof formatter === 'string') {
    const fn = eval(formatter);
    if (typeof fn !== 'function') {
      console.error('响应处理函数格式不正确,请检查！');
      return false;
    }
  }
  if (type === 1) {
    // 验证時間格式
    if (isNaN(exp)) {
      console.error('超时时间设置不正确，请检查！');
      return false;
    }
    // 方法类型验证
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const m = method.toUpperCase();
    if (!methods.includes(m)) {
      console.error('接口调用方式错误,请检查！');
      return false;
    }
    // url
    if (!url) {
      console.error('接口地址不能为空!');
      return false;
    }
  }
  return true;
}
