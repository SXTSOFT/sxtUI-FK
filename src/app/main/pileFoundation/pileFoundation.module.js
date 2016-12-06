/**
 * Created by HuangQingFeng on 2016/11/28.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.pileFoundation', ['app.core','app.xhsc'])
    .config(config);
  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider
      .state('app.pileFoundation', {
        url: '/pileFoundation',
        views: {
          'content@app': {
            template: '<ui-view class="animate-slide-left" flex layout="column"></ui-view>'
          }
        },
        abstract: true
      })
      .state('app.pileFoundation.list', {
        url:'/list',
        template:'<pile-foundation-list flex layout="column"></pile-foundation-list>'
      });
    // msNavigationServiceProvider.saveItem('pileFoundation', {
    //   title: '桩基管理',
    //   group: true,
    //   weight: 2
    // });
    //
    // msNavigationServiceProvider.saveItem('pileFoundation.pileFoundation', {
    //   title: '桩基管理',
    //   icon: 'icon-sort-variant',
    //   state: 'app.pileFoundation.list',
    //   weight: 1
    // });

  }
})(angular, undefined);
