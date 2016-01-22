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

    appAuth.$injector = ['$q','$injector','authToken','$state','$rootScope','$location'];

    function appAuth($q,$injector,authToken,$state,$rootScope,$location){

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
        currentUser: loginedUser
      };

      //判断用户是否登录
      function isLoggedIn(){
        return !!loginedUser;
      }

      //根据用户凭据获取token
      function token(user) {
        var chain = [];
        var promise = $q.when (user);
        forEach (reversedInterceptors, function (interceptor) {
          if (interceptor.token) {
            chain.unshift(interceptor.token);
          }
        });

        while (chain.length) {
          var thenFn = chain.shift ();
          promise = promise.then(thenFn);
        }
        return promise;
      }

      //根据token获取个人信息调用
      function profile(token) {
        var chain = [];
        var promise = $q.when (token);
        forEach (reversedInterceptors, function (interceptor) {
          if (interceptor.profile) {
            chain.unshift(interceptor.profile);
          }
        });

        while (chain.length) {
          var thenFn = chain.shift ();
          promise = promise.then(thenFn)
        }
        return promise;
      }

      // 根据用户凭据登录系统
      function login(user){
        return token(user).then(function(token){
          authToken.setToken(token);
          getProfile(token);
        },function(){
          $state.go('app.auth.login');
        });
      }

      // 根据用户token登录系统
      function getProfile(token){
        profile(token).then(function(user){
          loginedUser = user;
          if(!loginedUser)
            $state.go('app.auth.login');
          else {
            $rootScope.$emit ('user:login', user);
            if(!autoLoginPath){
              $location.path('/');
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
    }
  }
}());
