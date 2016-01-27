/**
 * Created by jiuyuong on 2016/1/23.
 */
(function(){
  'use strict';
  angular
    .module('app.core')
    .factory('localAuth',localAuth);
  /** @ngInject */
  function localAuth(sxt,$q){
    var auth = {
      token:token,
      profile:profile
    };

    return auth;

    function token(user){
      return user;
    }
    function profile(token,user){
      if(!token || !token.RealName){
        if(sxt.connection.isOnline())return token;
        return $q(function(resolve) {
          sxt.cache.getProfile (function (profile) {
            resolve(profile||token);
          },user);
        });
      }
    }
  }
})();
