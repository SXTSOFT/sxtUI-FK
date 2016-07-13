(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .factory('Auth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,appConfig,$state)
  {
    var service = {
      token   : token,
      profile : profile
    };

    return service;

    function token(user){
      return $q(function(resolve,reject){
        user ? resolve(user):reject('');
      })
    }

    function profile(token){
      return $q(function(resolve,reject){
        token?resolve({
          id:1,
          RealName:token.username,
          Token:'429ad0b0d7ab966180cc4718324c50ddf176d099',
          Username:token.username,
          Partner:''
        }):$state.go('app.auth.login');
      })
    }
  }

})();
