/**
 * Created by jiuyuong on 2016/9/26.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.plan', ['app.core'])
    .config(config);

  /** @ngInject */
  function config(apiProvider) {
    apiProvider.register('plan',{

    });
  }
})(angular,undefined);
