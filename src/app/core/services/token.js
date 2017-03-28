/**
 * Created by jiuyuong on 2016/1/22.
 */
(function(){
  'use strict';
  angular
    .module('app.core')
    .factory('authToken',authToken);
  /** @ngInject */
  function authToken($cookies,$rootScope,$injector,$timeout,$q){
    var token,tokenInjector,_401,lastTipTime,
      lastRequestTime={},isNetworking;

    tokenInjector = {
      setToken      : setToken,
      getToken      : getToken,
      request       : onHttpRequest,
      response      : onResponse,
      responseError : onHttpResponseError,
      on401         : on401
    };

    return tokenInjector;

    function setToken(tk){
      token = tk && tk.access_token ? (tk.token_type||'Bearer') + ' ' + tk.access_token : null;
      if(token)
        $cookies.put('token',token);
      else
        $cookies.remove('token');
    }

    function getToken(){
      if(!token)
        token = $cookies.get('token');
      return token;
    }

    function onHttpRequest(config){
      var token = getToken();
      if(token && !config.headers['Authorization'])
        config.headers['Authorization'] = token;
      if(config.url.indexOf('api')!=-1) {
        lastRequestTime[config.url] = $timeout(function () {
          if(lastRequestTime[config.url]) {
            lastRequestTime[config.url].isNetworking = true;
            $rootScope.$emit('sxt:onNetworking', config);
          }
        }, 35000);
      }
      return config;
    }

    function onResponse(response) {
      cancelNetworking(response.config);
      return response;
    }

    function cancelNetworking(config) {
      if(lastRequestTime[config.url]) {
        cancelNetworking(config.url);
        $timeout.cancel(lastRequestTime[config.url]);
        delete lastRequestTime[config.url];
        var fg = false;
        for (var k in lastRequestTime) {
          if (lastRequestTime[k].isNetworking) {
            fg = true;
          }
        }
        if (!fg)
          $rootScope.$emit('sxt:cancelNetworking');

      }
    }


    function onHttpResponseError(rejection) {
      cancelNetworking(rejection.config);
      if(rejection.status == -1){
        $rootScope.$emit('$cordovaNetwork:setNetwork',1);
      }
      if (rejection.status == 401 && !rejection.config.isRetry) {
        if (_401) {
          rejection.config.isRetry = true;
          return _401.call(tokenInjector, rejection).then(function () {
            rejection.config.headers['Authorization'] = getToken();
            return $injector.get('$http')(rejection.config);
          }).catch(function () {
            $rootScope.$emit('user:needlogin');
            return $q.reject(rejection);
          });
        }
        else {
          $rootScope.$emit('user:needlogin');
        }
      }
      else if(rejection.status >= 500){
        if (rejection && rejection.status != -1 && rejection.status != 401) {
          if (!lastTipTime || new Date().getTime() - lastTipTime > 10000) {
            lastTipTime = new Date().getTime();
            $injector.invoke(['utils', function (utils) {
              utils.alert(rejection.data && rejection.data.Message ? rejection.data.Message : '网络错误');
            }]);
          }
        }
      }
      return $q.reject(rejection);
    }

    function on401(fn) {
      _401 = fn;
    }

  }
})();
