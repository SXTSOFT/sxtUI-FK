/**
 * Created by 陆科桦 on 2016/10/23.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialysDownload',{
      templateUrl:'app/main/materialYs/component/materialys-download.html',
      controller:materialysDownload,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialysDownload($scope,api,utils){

  }

})(angular,undefined)
