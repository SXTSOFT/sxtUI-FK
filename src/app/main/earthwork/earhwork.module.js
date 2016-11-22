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
  }
})(angular, undefined);
