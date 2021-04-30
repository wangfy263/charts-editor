/* eslint-disable */
const Token = function (obj, { request }) {
  if (typeof request !== 'function') {
    return null;
  }
  const T = (function () {
    let _token = ''; // token值
    let _expTime = 0; // token失效时间
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
        console.log(expCycle);
        console.log(this.expCycle);
        _expTime = new Date().getTime() + expCycle;
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
          console.log(this);
          console.log('time: ' + time)
          console.log('expTime: ' + _expTime);
          if (_expTime > time || _expTime === 'never') {
            resolve(_token);
          } else {
            this.getNewToken().then(() => {
              resolve(_token);
            });
          }
        });
      }
      getNewToken() {
        return new Promise((resolve, reject) => {
          let params = {};
          const formatter = eval(this.formatter);
          if (typeof this.param === 'string') {
            params = Object.assign({}, JSON.parse(this.param));
          }
          if (typeof this.param === 'object') {
            params = Object.assign({}, this.param);
          }
          request(this.method, this.url, params)
            .then(res => {
              _token = formatter(res);
              _expTime = new Date().getTime() + this.expCycle;
              resolve();
            })
            .catch(e => {
              console.error(e);
              console.error('获取token报错');
            });
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
