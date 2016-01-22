(function ()
{
  'use strict';

  angular
    .module('sxt')
    .factory('vankeAuth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,appConfig)
  {
    var service = {
      token   : token,
      profile : profile
    };

    return service;

    function token(user){
      user.grant_type = 'password';
      user.scope = 'sxt';
      return $q(function(resolve){
        $http({
          method: 'POST',
          url:  appConfig.apiUrl + '/auth/connect/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('59EEDFCCB53C451488E067522992853B:9d6ab75f921942e61fb43a9b1fc25c63')
          },
          transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: user
        }).then(function(result){
          var token = result.data;
          resolve(token);
        });
        //
      })
    }

    function profile(token){
      return $q(function(resolve){
        $http
          .get( appConfig.apiUrl + '/api/Security/Account/UserInfo', { t: new Date().getTime() })
          .then(function (d) {
            resolve(d && d.data);
          });
      });
    }
  }

})();
