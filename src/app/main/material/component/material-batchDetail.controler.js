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
      // vm.intoFactoryImgs = $filter('filter')(vm.data.Images,{OptionType:1});
      // vm.checkedImgs = $filter('filter')(vm.data.Images,{OptionType:2});
      // vm.data.PlanTime = new Date(vm.data.PlanTime).Format('yyyy年MM月dd日');
      // vm.data.ApproachTime = new Date(vm.data.ApproachTime).Format('yyyy年MM月dd日');
      // vm.data.AcceptanceTime = new Date(vm.data.AcceptanceTime).Format('yyyy年MM月dd日');
    });


  }
})(angular,undefined);
