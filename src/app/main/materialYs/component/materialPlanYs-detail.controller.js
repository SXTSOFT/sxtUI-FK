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
    vm.data.Id = $stateParams.batchId;
    vm.confirm = true;
    vm._confirm = false;

    $scope.$watch('vm.confirm',function () {
      if (vm._confirm){
        vm.btnEnable = true;
        return;
      }
      vm.btnEnable = !vm.confirm;
    });

    api.xhsc.materialPlan.getMaterialPlanDetail(vm.data.Id).then(function (q) {
      vm.data = q.data;
      if(q.data.FirstBatchTime){
        var _str = JSON.stringify(q.data.FirstBatchTime).replace(/-/g,'/').replace('T',' ');
        var dt = new Date(_str);
        var currDt = new Date();
        vm._confirm = parseInt(Math.abs(currDt- dt)/1000/60/60/24) > 7 ? true : false;
        vm.btnEnable = vm._confirm ? true : false;
      }
    });

  }
})(angular,undefined);
