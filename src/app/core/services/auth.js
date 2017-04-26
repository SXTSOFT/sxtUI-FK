(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('auth', appAuthProvider)

  /** @ngInject */
  function appAuthProvider()
  {
    // 第三方登录插件
    var interceptorFactories = this.interceptors = [];
    var forEach = angular.forEach,loginedUser;
    // 是否转跳的登录
    var autoLoginPath = false;

    this.$get = appAuth;

    appAuth.$injector = ['$q','$injector','authToken','$state','$rootScope','$location','sxt','$http'];

    function appAuth($q,$injector,authToken,$state,$rootScope,$location, sxt,api,$http){

      var s = {
        isLoggedIn : isLoggedIn,
        token      : token,
        profile    : profile,
        login      : login,
        getUser    : getUser,
        autoLogin  : autoLogin,
        current    : currentUser,
        logout     : logout,
        reset      : reset,
      };

      authToken.on401(function (response) {
        var self = this;
        if(!self.lastTry || (new Date().getTime()-self.lastTry)>100000){
          self.lastTry = new Date().getTime();
          autoLoginPath = true;
          return (self.lastRefresh = $q(function (resolve,reject) {
            refresh(s,response).then(function () {
              resolve();
            }).catch(function () {
              autoLoginPath =false;
              reject(response);
            });
          }));
        }
        else return self.lastRefresh || $q(function (resolve,reject) {
          reject(response);
        })
      });
/*    $rootScope.$on('sxt:online', function(event, state){
        refresh(s);
      });*/

      $rootScope.$on('user:needlogin',function(){
        $state.go('app.auth.login');
      });
      var reversedInterceptors = [];

      forEach(interceptorFactories, function(interceptorFactory) {
        reversedInterceptors.unshift($injector.get(interceptorFactory));
      });

      return s;

      //判断用户是否登录
      function isLoggedIn(){
        return !!loginedUser;
      }

      //根据用户凭据获取token
      function token(user) {
        return sxt.invoke(reversedInterceptors, 'token' ,user)
      }

      //根据token获取个人信息调用
      function profile(token) {
        return sxt.invoke(reversedInterceptors, 'profile' ,token)
      }

      function refresh(s) {
        return sxt.invoke(reversedInterceptors, 'refresh' ,s);
      }

      // 根据用户凭据登录系统
      function login(user){
        return token(user).then(function(token){
          authToken.setToken(token);
          getProfile(token,user);
        },function(){
          //$state.go('app.auth.login');
          return $q.reject("用户名或密码错误");

        });
      }

      // 根据用户token登录系统
      function getProfile(token,user){
         profile(token).then(function(profile){
           if(token == profile)
            profile = null;

           loginedUser = profile;
          if(!loginedUser) {
            //$state.go('app.auth.login');
          }
          else {
            profile.username = profile.username || profile.Id;
            profile.token = token;
            profile.user = user;
            $rootScope.$emit('user:login', profile);
            if (!autoLoginPath) {
              $state.go('app.xhsc.jthome');
            }
          }
        });
      }

      // 获取当前用户
      function getUser(){
        return $q(function(resolve){
          if(loginedUser)
            resolve(loginedUser);
          else {
            $rootScope.$on ('user:login', function () {
              resolve (loginedUser);
            });
            getProfile();
          }
        })
      }

      //修改密码
      function reset(input){
          return $http.post('http://emp.chngalaxy.com:9090/Api/User/ChangePassword',input);
        }

      // 自动登录获取，不跳转
      function autoLogin(){
        autoLoginPath = true;
        return getUser().then(function(user){
          autoLoginPath = false;
          return user;
        });
      }

      // 退出登录
      function logout() {
        $rootScope.$emit('user:logout', loginedUser);
        $state.go('app.auth.login');
        api.xhsc.logout();
      }

      function currentUser(){
        return loginedUser;
      }
    }
  }
}());
