/**
 * Created by Administrator on 2016/10/24.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialPlanDetail',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-detail.html',
      controller:materialysDetail,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialysDetail($scope,api,utils){

  }

})(angular,undefined);
