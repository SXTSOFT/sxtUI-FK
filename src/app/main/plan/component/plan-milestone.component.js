/**
 * Created by emma on 2016/11/8.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planMilestone',{
      templateUrl:'app/main/plan/component/plan-milestone.html',
      controller:planMilestoneController,
      controllerAs:'vm'
    })

  /**@ngInject*/
  function planMilestoneController($stateParams,api){
    var vm = this;
    vm.id= $stateParams.id;
    api.plan.BuildPlan.getMileStone(vm.id).then(function(r){
      vm.data = r.data;
    });
    api.plan.BuildPlan.mainProcess(vm.id).then(function(r){
      vm.mainProcess = r.data;
    });
  }
})(angular,undefined)
