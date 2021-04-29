/* eslint-disable */
const Interface = function (obj, { request }) {
  if (typeof request !== 'function') {
    return null;
  }
  const I = (function () {
    let _id = '';
    let _data = null;
    let _token = null;
    class Interface {
      constructor({ id, name, url, method, param, formatter, isUseToken, tokenId, tokenPosition, tokenKey, token }) {
        _id = id;
        _token = token;
        this.name = name;
        this.method = method;
        this.url = url;
        this.param = param;
        this.formatter = formatter;
        this.isUseToken = isUseToken || false;
        this.tokenId = tokenId || '';
        this.tokenPosition = tokenPosition;
        this.tokenKey = tokenKey || 'token';
        console.log('initInter：' + id);
      }
      setToken(token) {
        _token = token;
      }
      getId() {
        return _id;
      }
      getData(selParams = {}) {
        return new Promise(resolve => {
          const str = JSON.stringify(selParams);
          if (str === '{}' && _data) {
            resolve(_data);
          } else {
            this.queryData(selParams).then(() => {
              resolve(_data);
            });
          }
        });
      }
      queryData(selParams = {}) {
        return new Promise((resolve, reject) => {
          let params = {};
          const headers = {};
          const tokenParam = {};
          const formatter = eval(this.formatter);
          if (typeof this.param === 'string') {
            params = JSON.parse(this.param);
          }
          // if (typeof this.param === 'object') {
          //   params = Object.assign({}, this.param);
          // }
          let t = null;
          if (_token) {
            t = await _token.getToken();
          }
          if (this.isUseToken && this.tokenPosition === 'header' && t) {
            // 获取数据接口在header中传递token
            headers[this.tokenKey] = t;
          }
          if (this.isUseToken && this.tokenPosition === 'query' && t) {
            // 获取数据接口在参数中传递header
            tokenParam[this.tokenKey] = t;
          }
          request(this.method, this.url, Object.assign({}, params, tokenParam, selParams), headers).then(res => {
            _data = formatter(res);
            resolve(_data);
          }).catch(e => {
            // console.error(e);
            console.error('获取token报错');
          });
        });
      }
      toString() {
        const i = {};
        i.id = _id;
        i.name = this.name;
        i.url = this.url;
        i.method = this.method;
        i.param = this.param;
        i.formatter = this.formatter;
        i.isUseToken = this.isUseToken;
        i.tokenId = this.tokenId;
        i.tokenPosition = this.tokenPosition;
        i.tokenKey = this.tokenKey;
        return JSON.stringify(i);
      }
    }
    return Interface;
  })();
  return new I(obj);
};

export default Interface;
