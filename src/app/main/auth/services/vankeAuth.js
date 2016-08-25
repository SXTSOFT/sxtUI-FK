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
      profile : profile,
      refresh : refresh
    };
    $rootScope.$on('user:logout',function(){
      appCookie.remove('auth');
    });
    var cfg = {
        _id:'s_userinfo',
        idField:'Id',
        single:true,
        mode:1,
        local:true,
        filter:function () {
          return true;
        },
        dataType:3
      },
      userInfo = api.db(cfg).bind(function () {
      return $http.get(sxt.app.api + '/api/Security/Account/UserInfo', {t: new Date().getTime()});
    });
    return service;

    function refresh(s,response) {
      return $q(function (resolve,reject) {
        var authObj = appCookie.get('auth');
        if(authObj) {
          authObj = JSON.parse (authObj);
          s.login(authObj).then(function () {
            resolve();
          }).catch(function () {
            reject(response);
          });
        }
        else{
          reject(response);
        }
      })
    }

    function token(user){
      if(user) {
        api.setNetwork(0);
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
      if(!token || !token.username) {
        return $q (function (resolve, reject) {
          //api.setNetwork(0);
          cfg.local = false;
          cfg.mode = token?2:1;
          userInfo().then(function (d) {
            cfg.mode = 1;
            if(!d ||(!d.status && !d.data)){
              $rootScope.$emit('user:needlogin');
            }
            else{
            }
            resolve(d && d.data);
            //api.resetNetwork();
          }, function (rejection) {
            cfg.mode = 1;
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
