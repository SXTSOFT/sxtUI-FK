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
    var forEach = angular.forEach,loginedUser={};
    // 是否转跳的登录
    var autoLoginPath = false;

    this.$get = appAuth;

    appAuth.$injector = ['$q','$injector','authToken','$state','$rootScope','$location','sxt'];

    function appAuth($q,$injector,authToken,$state,$rootScope,$location, sxt){

      $rootScope.$on('user:needlogin',function(){
        $state.go('app.auth.login');
      });
      var reversedInterceptors = [];

      forEach(interceptorFactories, function(interceptorFactory) {
        reversedInterceptors.unshift($injector.get(interceptorFactory));
      });

      return {
        isLoggedIn : isLoggedIn,
        token      : token,
        profile    : profile,
        login      : login,
        getUser    : getUser,
        autoLogin  : autoLogin,
        current    : currentUser,
        logout     : logout
      };

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
              $state.go('app.xhsc.home')
              //$location.path('/');
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

      }

      function currentUser(){
        return loginedUser;
      }
    }
  }
}());
