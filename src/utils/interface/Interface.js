/* eslint-disable */
const Interface = function (obj, { request, getTokenValueById }) {
  if (typeof request !== 'function') {
    return null;
  }
  if (typeof getTokenValueById !== 'function') {
    return null;
  }
  const I = (function () {
    let _id = '';
    let _data = null;
    let _promiseList = [];
    class Interface {
      constructor({ id, name, url, method, param, formatter, isUseToken, tokenId, tokenPosition, tokenKey }) {
        _id = id;
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
      getId() {
        return _id;
      }
      getData(selParams = {}) {
        return new Promise(resolve => {
          const str = JSON.stringify(selParams);
          if (str === '{}' && _data) {
            resolve(_data);
          } else {
            /** 当同一个页面多个组件公用该接口，并且所使用的入参不相同，也就是说返回的数据不同。
             *  由于接口响应的时机不同，可能出现前一次调用，但返回却出现在后面的情况
             *  导致数据出现错乱。
             *
             *  这里也不能用防抖函数debounce，因为2次调用，返回数据不同。
             * 
             *  为了解决这个问题，使用列表存储调用的promise，记录调用顺序，之后在返回结果中按照调用次数去取结果。
             *  同时，为了避免这个列表太过庞大，在每次调用完成后，检测此列表中的promise是否全部resolve，全部resolve则清空该列表。
             */
            _promiseList.push(this.queryData(selParams));
            let l = _promiseList.length;
            Promise.all(_promiseList)
              .then(resList => {
                if (l === _promiseList.length) { // 通过检测调用前列表长度和调用后列表长度是否相等，确定此次返回时并没有新增调用，列表中的promise均已resolve，可以清空。
                  _promiseList = [];
                }
                // _data = resList[l - 1];
                resolve(resList[l - 1]);
              })
              .catch(e => {
                console.error(e);
                console.error('接口调用异常');
              });
            // this.queryData(selParams)
            //   .then(() => {
            //     resolve(_data);
            //   })
            //   .catch(e => {
            //     console.error(e);
            //     console.error('接口调用异常');
            //   });
          }
        });
      }
      async queryData(selParams = {}) {
        let params = {};
        const headers = {};
        const tokenParam = {};
        const formatter = eval(this.formatter);
        if (typeof this.param === 'string') {
          params = JSON.parse(this.param);
        }
        if (typeof this.param === 'object') {
          params = this.param;
        }
        let token = '';
        if (this.isUseToken && this.tokenId) {
          token = await getTokenValueById(this.tokenId);
        }
        if (this.isUseToken && this.tokenPosition === 'header' && token) {
          // 获取数据接口在header中传递token
          headers[this.tokenKey] = token;
        }
        if (this.isUseToken && this.tokenPosition === 'query' && token) {
          // 获取数据接口在参数中传递header
          tokenParam[this.tokenKey] = token;
        }
        const res = await request(this.method, this.url, Object.assign({}, params, tokenParam, selParams), headers);
        return formatter(res);
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
