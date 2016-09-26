/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planBcadd',{
      templateUrl:'app/main/plan/component/plan-bcAdd.html',
      controller:planBcAdd,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planBcAdd($scope,remote,utils,$state){
    var vm = this;
    vm.save = function(){
      var r = remote.Plan.createBc(vm.data);
      if(r){
        utils.alert("提交成功",null,function(){
          $state.go("app.plan.bc.list");
        });
      }
    };
  }
})(angular,undefined);
