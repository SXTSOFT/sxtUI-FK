/**
 * Created by jiuyuong on 2016/1/21.
 */
(function ()
{
  'use strict';

  angular
    .module('app.auth', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.auth', {
        url    : '/auth',
        views    : {
          'main@'                       : {
            templateUrl: 'app/core/layouts/content-only.html',
            controller : 'MainController as vm'
          }
        },
        abstract:true
      })
      .state('app.auth.login', {
        auth     : false,
        url      : '/login',
        views    : {
          'content@app.auth': {
            templateUrl: 'app/main/auth/login/login.html',
            controller: 'LoginController as vm'
          }
        }
      });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/auth');

    // Navigation
    msNavigationServiceProvider.saveItem('auth', {
      title : '认证',
      group : true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('auth.login', {
      title    : '登录',
      icon     : 'icon-tile-four',
      state    : 'app.auth.login',
      weight   : 1
    });
  }
})();
