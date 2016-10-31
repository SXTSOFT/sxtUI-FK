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
  function materialPlan($scope,api,utils,$stateParams,$state,moment){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.SupplyType = [
      {type:1,name:'甲供'},
      {type:2,name:'认质认价'},
      {type:4,name:'甲指乙供'}
    ];
    vm.data.PlanTime=new Date();

    api.xhsc.Project.getMap().then(function (r) {
      vm.projects = r.data;
    });

    $scope.$watch('vm.data.ProjectId',function () {
      vm.regions = [];
      vm.sections = [];
      api.xhsc.Project.GetAreaChildenbyID(vm.data.ProjectId).then(function (r) {
        vm.regions = r.data || [];
        vm.regions.forEach(function (r) {
          r.tempId = r.RegionID.substr(5,10);
          if(r.tempId == vm.data.RegionId){
            r.selected = true;
          }
        });
      });
    },true);

    $scope.$watch('vm.data.RegionId',function () {
      api.material.materialPlan.GetProjectSection(vm.data.RegionId).then(function (e) {
        vm.sections = e.data || [];
        vm.sections.forEach(function (p) {
          if(p.AreaID == vm.data.RegionId){
            p.selected = true;
          }
        });
      });
    },true);

    $scope.$watch('vm.data.Material',function () {
      api.material.materialScience.getList({Skip:0,Limit:100}).then(function (r) {
        vm.materials = r.data.Items || [];
        vm.materials.forEach(function (q) {
          if(q.Id == vm.data.MaterialId){
            q.selected = true;
            vm.Specifications = q.Specifications;
            vm.Model = q.Model;
          }
        });
      });
    },true);

    vm.init = function (m) {
      vm.Specifications = m.Specifications;
      vm.Model = m.Model;
    };

    if(vm.data.Id){
      api.material.materialPlan.getMaterial(vm.data.Id).then(function (r) {
        vm.data = r.data;
        vm.data.ProjectId = r.data.RegionId.substr(0,5);
        vm.data.RegionId = r.data.RegionId.substr(5,10);
        vm.data.SectionId = r.data.SectionId;
        vm.data.PlanTime = r.data.PlanTime == null ? new Date() : new moment(r.data.PlanTime).toDate();
      });
    }

    vm.save = function () {
      vm.data.PlanName = vm.data.Material.MaterialName + '_' + vm.Specifications + '_' + vm.Model + '_' + vm.data.PlanCount + vm.data.Unit + '_' + new Date(vm.data.PlanTime).Format('yyMMdd');
      if(vm.data.Id){
        api.material.materialPlan.putMaterial(vm.data).then(function () {
          utils.alert("提交成功", null, function () {
            $state.go("app.material.plans");
          });
        });
      }else{
        vm.data.MaterialId = vm.data.Material.Id;
        vm.data.PlanTime = new Date(vm.data.PlanTime);
        api.material.materialPlan.Create(vm.data).then(function () {
          utils.alert("提交成功",null,function(){
            $state.go("app.material.plans");
          });
        });
      }
    }
  }
})(angular,undefined);
