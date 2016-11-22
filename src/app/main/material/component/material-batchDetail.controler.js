/**
 * Created by HuangQingFeng on 2016/11/14.
 */

(function(angular,undefined) {
  'use strict';

  angular
    .module('app.material')
    .component('materialBatchDetail', {
      templateUrl: 'app/main/material/component/material-batchDetail.html',
      controller: materialBatchDetail,
      controllerAs: 'vm'
    });

  function materialBatchDetail($scope,api,utils,$state,$stateParams) {
    var vm = this;
    vm.data = {};
    vm.data.PlanId = $stateParams.planId;

    api.xhsc.materialPlan.GetMaterialPlanBatchByPlanId(vm.data.PlanId).then(function (r) {
      vm.data.BatchList = r.data||[];
    });

    api.xhsc.materialPlan.GetExcessMaterialExitByPlanId(vm.data.PlanId).then(function (r) {
        vm.data.BatchExitList = r.data||[];
    });

  }
})(angular,undefined);
