/**
 * Created by jiuyuong on 2016/1/22.
 */
(function(){
  'use strict';
  angular
    .module('app.auth')
    .factory('authToken',authToken);
  /** @ngInject */
  function authToken($cookies){
    var token,tokenInjector;

    tokenInjector = {
      setToken      : setToken,
      getToken      : getToken,
      request       : onHttpRequest,
      responseError : onHttpResponseError
    };

    return tokenInjector;

    function setToken(tk){
      token = tk? tk.token_type + ' ' + tk.access_token : null;
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
      return config;
    }

    function onHttpResponseError(rejection){
      if(rejection.status == 401){
        setToken(null);
      }
    }

  }
})();
