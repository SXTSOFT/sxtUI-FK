(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .factory('vankeAuth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,$rootScope,api,utils)
  {
    var service = {
      token   : token,
      profile : profile
    };
    $rootScope.$on('user:logout', function () {
      utils.cookies.remove('auth');
    });
/*    var userInfo = api.db({
      _id:'s_userinfo',
      idField:'UserId',
      filter:function () {
        return true;
      },
      dataType:3
    }).bind(function () {
      return $http.get(sxt.app.api + '/api/Security/profile', {t: new Date().getTime()});
    });*/
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
              utils.cookies.put('auth',JSON.stringify(user));
              var token = result.data;
              resolve(token);
            }
            else{
              utils.cookies.remove('auth');
              reject({})
            }
          },function(){
            utils.cookies.remove('auth');
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
          api.setNetwork(0);
          api.xhsc.profile().then(function (d) {
            if(!d ||(!d.status && !d.data)){
              $rootScope.$emit('user:needlogin');
            }
            resolve(d && d.data);
            api.resetNetwork();
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
