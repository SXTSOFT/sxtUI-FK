/**
 * Created by HuangQingFeng on 2016/11/16.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialPlanProgress',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-progress.html',
      controller:materialPlanProgress,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialPlanProgress($rootScope,$stateParams,api,utils,$state){
    var vm = this;
    var batchId = $stateParams.id;

    api.xhsc.materialPlan.getBatchProgressById(batchId).then(function (r) {
      vm.data = r.data;
    });

  }
})(angular,undefined);
