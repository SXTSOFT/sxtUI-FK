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
    vm.data.PlanId = $stateParams.planId?$stateParams.planId:$scope.$parent.planId;

    api.xhsc.materialPlan.GetMaterialPlanInfolById(vm.data.PlanId).then(function (r) {
      if(r.data){
        vm.data.PlanModel =  r.data;
        if(r.data.PlanBatchDetail){
          r.data.PlanBatchDetail.forEach(function (q) {
            q.Images.forEach(function (i) {
              i.ImageByte = sxt.app.api + i.ImageByte;
            });
          });
        }
      }
    });

    vm.goBack=function(){
      window.history.go(-1);
    }

    // api.xhsc.materialPlan.GetMaterialPlanBatchByPlanId(vm.data.PlanId).then(function (r) {
    //   vm.data.BatchList = r.data||[];
    //   vm.data.BatchList.forEach(function (b) {
    //     b.Images.forEach(function (i) {
    //       i.ImageByte = sxt.app.api + i.ImageByte;
    //     })
    //   })
    // });
    //
    // api.xhsc.materialPlan.GetExcessMaterialExitByPlanId(vm.data.PlanId).then(function (r) {
    //     vm.data.BatchExitList = r.data||[];
    // });

  }
})(angular,undefined);
