/**
 * Created by jiuyuong on 2016/1/22.
 */
(function ()
{
  'use strict';

  angular
    .module('app.auth')
    .config(config);

  /** @ngInject */
  function config($httpProvider)
  {
    $httpProvider.interceptors.push('authToken');
  }

})();
