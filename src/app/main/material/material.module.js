/**
 * Created by 陆科桦 on 2016/10/14.
 */

(function (angular, undefined) {
  'use strict';

  angular
    .module('app.material', ['app.core','app.xhsc'])
    .config(config);
  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider
      .state('app.material', {
        url: '/material',
        views: {
          'content@app': {
            template: '<ui-view class="animate-slide-left" flex layout="column"></ui-view>'
          }
        },
        abstract: true
      })
      .state('app.material.list', {
        url:'/list',
        template:'<material-list flex layout="column"></material-list>'
      })
      .state('app.material.type', {
        url:'/type',
        template:'<material-type flex layout="column"></material-type>'
      });

    msNavigationServiceProvider.saveItem('material', {
      title: '材料管理',
      group: true,
      weight: 2
    });

    msNavigationServiceProvider.saveItem('material.type', {
      title: '材料分类',
      icon: 'icon-account',
      state: 'app.material.type',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('material.list', {
      title: '材料',
      icon: 'icon-account',
      state: 'app.material.list',
      weight: 1
    });
  }
})(angular, undefined);
