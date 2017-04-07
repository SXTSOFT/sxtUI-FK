/**
 * Created by 陆科桦 on 2016/10/14.
 */

(function (angular, undefined) {
  'use strict';

  angular
    .module('app.insideYs', [])
    .config(config);
  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider
      .state('app.insideYs', {
        url: '/insideYs',
        views: {
          'content@app': {
            template: '<ui-view class="animate-slide-left" flex layout="column"></ui-view>'
          }
        },
        abstract: true
      })
      .state('app.insideYs.list', {
        url:'/list',
        template:'<inside-ys-list flex layout="column"></inside-ys-list>'
      })

    msNavigationServiceProvider.saveItem('insideYs', {
      title: '内部验收',
      group: true,
      weight: 2
    });

    msNavigationServiceProvider.saveItem('insideYs.list', {
      title: '问题明细报表',
      icon: 'icon-view-list',
      state: 'app.insideYs.list',
      weight: 1
    });

  }
})(angular, undefined);
