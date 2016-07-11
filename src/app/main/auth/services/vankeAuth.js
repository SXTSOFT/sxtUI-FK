(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .factory('vankeAuth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,api,sxt,appCookie,$rootScope,utils)
  {
    var service = {
      token   : token,
      profile : profile
    };
    $rootScope.$on('user:logout',function(){
      appCookie.remove('auth');
    });
    var userInfo = api.db({
      _id:'s_userinfo',
      idField:'Id',
      filter:function () {
        return true;
      },
      dataType:3
    }).bind(function () {
      return $http.get(sxt.app.api + '/api/Security/Account/UserInfo', {t: new Date().getTime()});
    });
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
              appCookie.put('auth',JSON.stringify(user));
              var token = result.data;
              resolve(token);
            }
            else{
              appCookie.remove('auth');
              reject({})
            }
          },function(){
            appCookie.remove('auth');
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
          userInfo().then(function (d) {
            if(!d.status && !d.data){
              $rootScope.$emit('user:needlogin');
            }
            resolve(d && d.data);
          }, function (rejection) {

            utils.alert(rejection.data && rejection.data.Message?rejection.data.Message:'网络错误');
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
