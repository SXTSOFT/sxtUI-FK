/**
 * Created by HangQingFeng on 2016/10/24.
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
  function materialysDetail($scope,api,utils,$stateParams){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.planId;
    vm.data.BatchId = $stateParams.batchId;

    api.xhsc.materialPlan.getMaterialPlanDetail(vm.data.Id,vm.data.BatchId).then(function (q) {
      vm.data = q.data;
    });

  }
})(angular,undefined);
