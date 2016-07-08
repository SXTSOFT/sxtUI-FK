/**
 * Created by jiuyuong on 2016/7/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .factory('ys7',ys7);
  /** @ngInject */
  function ys7($http,$q,xhUtils){
   var accessToken,
     userId,
     id = 13823315505,
     api = 'https://open.ys7.com/api/method',
     appKey = '346249221d154bac9ba686873c2dffec',
     phone = '13823315505';

    function signData(time,method,params) {
      var p = [], v = [];

      for (var k in params) {
        p.push({key: k, value: params[k]});
      }
      p.sort(function (s1, s2) {
        return s1.key.localeCompare(s2.key);
      });
      p.push({key: 'method', value: method});
      p.push({key: 'time', value: time});
      p.push({key: 'secret', value: 'f637ad66df8d77133f43f28ddf9942d7'});
      p.forEach(function (m) {
        v.push(m.key + ':' + m.value);
      });
      return xhUtils.md5(v.join(','));
    }

    function request(method,params) {
      return $http({
        method: 'POST',
        url: 'https://open.ys7.com/api/time/get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push (encodeURIComponent (p) + "=" + encodeURIComponent (obj[p]));
          return str.join ("&");
        },
        data: {
          id:id,
          appKey:appKey
        }
      }).then(function(result){
        var t = result.data.result.data.serverTime;
        return $http.post(api,{
          system:{
            ver:1.0,
            sign:signData(t,method,params),
            key:appKey,
            time:t
          },
          method:method,
          params:params,
          id:id
        });
      });
    }

    function getToken() {
      return $q(function (resolve) {
        if(accessToken)
          resolve(accessToken);
        else{
          request('token/getAccessToken',{
            phone:phone
          }).then(function (result) {
            accessToken = result.data.result.data.accessToken,
              userId = result.data.result.data.userId;
            resolve(accessToken);
          })
        }
      })
    }

    function post(method,params) {
      return getToken().then(function (token) {
         return request(method,angular.extend(params||{},{accessToken:token}));
      })
    }

    return {
      token:getToken,
      request:request,
      post:post
    };
  }
})();
