/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan', ['app.core'])
    .config(config);

  /** @ngInject */
  function config($stateProvider,msNavigationServiceProvider)
  {
    $stateProvider
      .state('app.plan', {
        url:'/plan',
        abstract:true
      })
  }
})(angular,undefined);
