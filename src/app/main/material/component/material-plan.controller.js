/**
 * Created by 陆科桦 on 2016/10/17.
 */

(function (angular,undefined) {
  'use strict';
  angular
    .module('app.material')
    .component('materialPlan',{
      templateUrl:'app/main/material/component/material-plan.html',
      controller:materialPlan,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialPlan($scope,api,utils,$stateParams,$state){
    var vm = this;

    vm.SupplyType = [
      {type:1,name:'甲供'},
      {type:2,name:'认质认价'},
      {type:4,name:'甲指乙供'}
    ];
    api.material.materialScience.getList({Skip:0,Limit:100}).then(function (r) {
      vm.materials = r.data.Items||[];
    });
    vm.getMaps = function () {
      return api.xhsc.Project.getMap().then(function (r) {
        vm.projects = r.data;
      })
    };

    vm.getSections = function () {
      return api.xhsc.Project.GetAreaChildenbyID(vm.data.ProjectId).then(function (r) {
        vm.regions = r.data;
      })
    };

    vm.init = function (m) {
      vm.Specifications = m.Specifications;
      vm.Model = m.Model;
    };

    vm.save = function () {
      vm.data.MaterialId = vm.data.Material.Id;
      vm.data.PlanName = vm.data.Material.MaterialName + '_' + vm.Specifications + '_' + vm.Model + '_' + vm.data.PlanCount + vm.data.Unit + '_' + new Date(vm.data.PlanTime).Format('yyMMdd');
      vm.data.PlanTime = new Date(vm.data.PlanTime);
      api.material.materialPlan.Create(vm.data).then(function () {
        utils.alert("提交成功",null,function(){
          $state.go("app.material.plans");
        });
      })
    }
  }
})(angular,undefined);
