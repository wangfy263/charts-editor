import Token from './Token';

const tokens = [];

export function createToken({ name, type, url, method, param = {}, formatter = resp => resp, expCycle, token }) {
  if (!name) {
    console.error('名称不能为空');
    return null;
  }
  if (type === 0 && token) {
    console.error('静态token, 值不能为空！');
    return null;
  }
  // 静态token, 无需设置param和formatter
  if (type === 0) {
    url = '';
    method = '';
    param = {};
    formatter = resp => resp;
  }
  // 格式化入参
  try {
    if (typeof param === 'string') {
      param = JSON.parse(param);
    }
  } catch (e) {
    console.error('参数JSON格式不正确,请检查！');
    return false;
  }
  // 格式化响应处理函数
  try {
    if (typeof formatter === 'string') {
      formatter = new Function('resp', formatter);
    }
  } catch (e) {
    console.error('响应处理函数格式不正确,请检查！');
    return false;
  }
  const id = (Math.random() * 1000).toFixed(0) + new Date().getTime();
  const t = new Token({ id, name, type, url, method, param, formatter, expCycle, token });
  tokens.push(t);
  return id;
}

export function updateToken({ id, name, type, url, method, param = {}, formatter = resp => resp, expCycle, token }) {
  if (!id) {
    console.error('修改token, 必须传id!');
    return false;
  }
  if (!name) {
    console.error('名称不能为空');
    return false;
  }
  if (type === 0 && token) {
    console.error('静态token, 值不能为空！');
    return false;
  }
  // 静态token, 无需设置param和formatter
  if (type === 0) {
    url = '';
    method = '';
    param = {};
    formatter = resp => resp;
  }
  // 格式化入参
  try {
    if (typeof param === 'string') {
      param = JSON.parse(param);
    }
  } catch (e) {
    console.error('参数JSON格式不正确,请检查！');
    return false;
  }
  // 格式化响应处理函数
  try {
    if (typeof formatter === 'string') {
      formatter = new Function('resp', formatter);
    }
  } catch (e) {
    console.error('响应处理函数格式不正确,请检查！');
    return false;
  }
  const t = tokens.filter(item => item.getId() === id)[0];
  t.name = name;
  t.url = url;
  t.method = method;
  t.param = param;
  t.formatter = formatter;
  t.setType(type);
  if (t.getType() === 0) {
    t.setStaticToken(token);
    t.setExpTime('never');
  }
  if (t.getType() === 1) {
    t.setStaticToken('');
    t.setExpTime(new Date().getTime());
  }
  return true;
}

export function delToken(id) {
  if (!id) {
    console.error('删除token, 必须传id!');
    return false;
  }
  const index = tokens.map(item => item.getId()).indexOf(id);
  if (index >= 0) {
    tokens.splice(index, 1);
  }
}

export function getTokens() {
  return tokens;
}

export function getTokenById(id) {
  return tokens.filter(item => item.getId() === id)[0];
}

export function initTokenStr(tokenJson) {
  try {
    const tokenList = JSON.parse(tokenJson);
    tokenList.forEach(item => {
      const token = new Token(item);
      tokens.push(token);
    });
  } catch (e) {
    console.error('tokenJson格式错误！');
  }
}

export function tokenToJson() {
  return `[${tokens.map(item => item.toString()).join(',')}]`;
}

export function refreshToken(id) {
  const token = tokens.filter(item => item.getId() === id)[0];
  token.getNewToken()
}
