/**
 * Created by HuangQingFeng on 2016/11/22.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.earthwork', ['app.core','app.xhsc','angularFileUpload'])
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
      .state('app.earthwork.test',{
        url:'/test',
        template:'<earthwork-test flex layout="column"></earthwork-test>'
      })
    .state('app.earthwork.list', {
      url:'/list',
      template:'<earthwork-list flex layout="column"></earthwork-list>'
    });
    msNavigationServiceProvider.saveItem('earthwork', {
      title: '土方管理',
      group: true,
      weight: 2
    });

    msNavigationServiceProvider.saveItem('earthwork.test', {
      title: '画图测试',
      icon: 'icon-calendar-text',
      state: 'app.earthwork.test',
      weight: 1
    });


    msNavigationServiceProvider.saveItem('earthwork.earthwork', {
      title: '土方管理',
      icon: 'icon-sort-variant',
      state: 'app.earthwork.list',
      weight: 1
    });

  }
})(angular, undefined);
