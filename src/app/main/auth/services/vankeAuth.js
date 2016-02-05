(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .factory('vankeAuth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,appConfig,sxt)
  {
    var service = {
      token   : token,
      profile : profile
    };

    return service;

    function token(user){
      if(!sxt.connection.isOnline())return user;
      if(user) {
        user.grant_type = 'password';
        user.scope = 'sxt';
        return $q (function (resolve,reject) {
          $http ({
            method: 'POST',
            url: sxt.app.api + '/auth/connect/token',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa ('59EEDFCCB53C451488E067522992853B:9d6ab75f921942e61fb43a9b1fc25c63')
            },
            transformRequest: function (obj) {
              var str = [];
              for (var p in obj)
                str.push (encodeURIComponent (p) + "=" + encodeURIComponent (obj[p]));
              return str.join ("&");
            },
            data: user
          }).then (function (result) {
            if(result) {
              var token = result.data;
              resolve(token);
            }
            else{
              reject({})
            }
          },function(){
            resolve(user);
          });
          //
        });
      }
      else{
        return user;
      }
    }

    function profile(token){
      if(!sxt.connection.isOnline())return token;
      if(!token || !token.username) {
        return $q (function (resolve, reject) {
          $http
            .get (sxt.app.api + '/api/Security/Account/UserInfo', {t: new Date ().getTime ()})
            .then (function (d) {
              resolve (d && d.data);
            }, function () {
              reject (token);
            });
        });
      }
      else{
        return token;
      }
    }
  }

})();
