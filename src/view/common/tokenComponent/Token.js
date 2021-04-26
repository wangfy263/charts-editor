import { get, post } from '@/network/api';
/* eslint-disable */
const Token = function (obj) {
  const T = (function () {
    let _token = ''; // token值
    let _expTime = ''; // token失效时间
    let _type = 0; // 0: 静态；1：动态
    let _id = '';
    class Token {
      constructor({ id, name, type, url, method, param, formatter, expCycle, token }) {
        this.name = name;
        this.url = url || ''; // 动态token获取url
        this.method = method || '';
        this.param = param || {};
        this.formatter = formatter || new Function('res', 'return res');
        this.expCycle = expCycle || 60 * 60 * 1000;
        _id = id;
        _type = type;
        if (type === 0) {
          _expTime = 'never';
          _token = token || '';
        }
        console.log('initToken：' + id);
      }
      getId() {
        return _id;
      }
      getType() {
        return _type;
      }
      setType(type) {
        _type = type;
      }
      getTokenValue() {
        return _token;
      }
      setExpTime(time) {
        _expTime = time;
      }
      getToken() {
        return new Promise(resolve => {
          const time = new Date().getTime();
          if (_expTime > time || _expTime === 'never') {
            resolve(_token);
          } else {
            this.getNewToken()
              .then(() => {
                resolve(_token);
              })
              .catch(e => {
                console.log('获取新token报错');
              });
          }
        });
      }
      getNewToken() {
        return new Promise(resolve => {
          let params = {};
          const formatter = this.formatter
            ? eval(this.formatter)
            : function (res) {
                return res;
              };
          if (typeof this.param === 'object') {
            params = Object.assign({}, this.param);
          }
          if (this.method.toLowerCase() === 'get') {
            get(this.url, params).then(res => {
              _token = formatter(res);
              _expTime = new Date().getTime() + this.expCycle;
              resolve();
            });
          }
          if (this.method.toLowerCase() === 'post') {
            post(this.url, params).then(res => {
              _token = formatter(res);
              _expTime = new Date().getTime() + this.expCycle;
              resolve();
            });
          }
        });
      }
      setStaticToken(token) {
        _token = token;
      }
      toString() {
        const o = {};
        o.id = _id;
        o.name = this.name;
        o.url = this.url; // 动态token获取url
        o.method = this.method;
        o.param = this.param;
        o.formatter = this.formatter;
        o.expCycle = this.expCycle;
        o.type = _type;
        o.token = _token;
        return JSON.stringify(o);
      }
    }
    return Token;
  })();
  return new T(obj);
};
export default Token;
