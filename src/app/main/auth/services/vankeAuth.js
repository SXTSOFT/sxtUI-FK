(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .factory('vankeAuth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,appConfig,$state)
  {
    var service = {
      token   : token,
      profile : profile
    };

    return service;

    function token(user){
      if(user) {
        user.grant_type = 'password';
        return $q (function (resolve,reject) {
          $http ({
            method: 'POST',
            url: sxt.app.api + '/token',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'//,
              //'Authorization': 'Basic ' + btoa ('59EEDFCCB53C451488E067522992853B:9d6ab75f921942e61fb43a9b1fc25c63')
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
              //appCookie.put('auth',JSON.stringify(user));
              var token = result.data;
              resolve(token);
            }
            else{
              reject({})
            }
          },function(){
            //resolve(user);
          });
          //
        });
      }
      else{
        return user;
      }
    }

    function profile(token){
      if(!token || !token.username) {
        return $q (function (resolve, reject) {
          //api.setNetwork(0);
          $http.get(sxt.app.api +'/api/Security/profile').then(function (d) {
            if(!d.status && !d.data){
              $rootScope.$emit('user:needlogin');
            }
            resolve(d && d.data);
            //api.resetNetwork();
          }, function (rejection) {

            //utils.alert(rejection.data && rejection.data.Message?rejection.data.Message:'网络错误');
            reject(token);
          });
        });
      }
      else{
        return token;
      }
    }
  }

})();
