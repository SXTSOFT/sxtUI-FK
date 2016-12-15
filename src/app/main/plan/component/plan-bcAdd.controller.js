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
    vm.data.IsAllStopWork = 'true';
    vm.data.CompensateId = $stateParams.id;

    api.plan.compensate.getBaseRegion().then(function (r) {
      vm.Areas = r.data.Items||[];
    });

    if(vm.data.CompensateId){
      api.plan.compensate.getCompensate(vm.data.CompensateId).then(function (r) {
        vm.data = r.data;
        vm.data.Time = new Date(vm.data.Time.substring(0,10));
        vm.data.IsAllStopWork = ''+vm.data.IsAllStopWork;
        var areaIds = [];
        //aaa
        r.data.CompensateAreas.forEach(function (a) {
          areaIds.push(a.AreaId);
        });
        vm.data.AreaIds = areaIds;
      });
    }

    vm.save = function(){
      if(!vm.data.CompensateId){
        api.plan.compensate.createBc(vm.data).then(function () {
          utils.alert("提交成功",null,function(){
            $state.go("app.plan.bc.list");
          });
        })
      }else{
        vm.data.Id = vm.data.CompensateId;
        api.plan.compensate.putCompensate(vm.data).then(function () {
          api.plan.compensate.postAreaReset({id:vm.data.CompensateId,areaIds:vm.data.AreaIds}).then(function () {
            utils.alert("提交成功",null,function(){
              $state.go("app.plan.bc.list");
            });
          })
        })
      }
    };
  }
})(angular,undefined);
