/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planBcedit',{
      templateUrl:'app/main/plan/component/plan-bcEdit.html',
      controller:planBcEdit,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planBcEdit($scope,$stateParams,remote,utils,$state){
    var vm=this;
    vm.data =  remote.Plan.GetBc($stateParams.id);
    vm.data.Time = new Date(vm.data.Time);

    vm.submit = function () {
      var r = remote.Plan.editBc(vm.data);
      if(r){
        utils.alert("提交成功",null,function(){
          $state.go("app.plan.bc.list");
        });
      }
    }
  }
})(angular,undefined);
