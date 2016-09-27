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
  function planBcAdd($scope,api,utils,$state,$stateParams){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;

    api.plan.compensate.getBaseRegion().then(function (r) {
      console.log(r.data.Items);
      vm.Areas = r.data.Items||[];
    });

    if(vm.data.Id){
      api.plan.compensate.getCompensate(vm.data.Id).then(function (r) {
        console.log(r);
        vm.data = r.data;
        vm.data.Time = new Date(vm.data.Time);
        vm.data.IsAllStopWork = ''+vm.data.IsAllStopWork;
      });
    }

    vm.save = function(){
      //vm.data.TimeType = (vm.data.TimeType == 'GregorianCalendar'?0:1);
      if(!vm.data.Id){
        console.log(vm.data);
        var r = api.plan.compensate.createBc(vm.data);
        if(r){
          utils.alert("提交成功",null,function(){
            $state.go("app.plan.bc.list");
          });
        }
      }else{
        var r = api.plan.compensate.putCompensate(vm.data);
        if(r){
          utils.alert("提交成功",null,function(){
            $state.go("app.plan.bc.list");
          });
        }
      }
    };
  }
})(angular,undefined);
