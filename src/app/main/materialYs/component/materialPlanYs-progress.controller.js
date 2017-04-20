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
    var sectionId = $stateParams.sectionId;

    api.xhsc.materialPlan.getBatchProgressById(sectionId).then(function (r) {
      vm.data = r.data.Result.find(function(item){ return item.Id == batchId});
    });

  }
})(angular,undefined);
