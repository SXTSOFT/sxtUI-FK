/**
 * Created by HuangQingFeng on 2016/11/22.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.earthwork', ['app.core','app.xhsc'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider
      .state('app.earthwork', {
        url: '/earthwork',
        views: {
          'content@app': {
            template: '<ui-view class="animate-slide-left" flex layout="column"></ui-view>'
          }
        },
        abstract: true
      })
      .state('app.earthwork.list', {
        url:'/list',
        template:'<earthwork-list flex layout="column"></earthwork-list>'
      });

    msNavigationServiceProvider.saveItem('earthwork', {
      title: '土方',
      group: true,
      weight: 2
    });

    msNavigationServiceProvider.saveItem('earthwork.earthwork', {
      title: '土方列表',
      icon: 'icon-sort-variant',
      state: 'app.earthwork.list',
      weight: 1
    });

  }
})(angular, undefined);
