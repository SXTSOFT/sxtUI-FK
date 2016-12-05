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
  function materialPlan($scope,api,utils,$stateParams,$state,moment,auth,$element){
    var vm = this;
    var user = auth.current();
    vm.data = {};
    var role = [];
    vm.data.Id = $stateParams.id;
    vm.SupplyType = [
      {type:1,name:'甲供'},
      {type:2,name:'认质认价'},
      {type:4,name:'甲指乙供'}
    ];
    vm.data.PlanTime=new Date();

    if(user.Role.MemberType !== ''){
      api.material.materialPlan.getUserProjectSectionForPc().then(function (result) {
        role = result.data;
      });
    }

    $scope.searchTerm;
    $scope.searchC;
    $scope.clearSearchTerm = function() {
      $scope.searchTerm = '';
    };
    $scope.clearSearchC = function() {
      $scope.searchC = '';
    };

    $element.find('input').on('keydown', function(ev) {
      ev.stopPropagation();
    });

    vm.projects = [];
    vm.getMaps = function () {
      return api.xhsc.Project.getMap().then(function (r) {
        vm.projects = r.data;
      })
    };

    api.material.contract.getList({Skip:0,Limit:999}).then(function (q) {
      vm.contracts = q.data.Items||[];
    });

    vm.getAreas = function (pId) {
      return api.xhsc.Project.GetAreaChildenbyID(pId).then(function (r) {
        vm.regions = r.data;

      });
    };

    vm.getSections = function (aId) {
      api.material.materialPlan.GetProjectSection(aId).then(function (e) {
        vm.sections = e.data;
      });
    };

    vm.typeId;
    vm.getMaterial = function () {
      api.material.materialScience.GetMaterialByTypeId(vm.typeId).then(function (r) {
        vm.materials = r.data;
      })
    };

    vm.upNext = function () {
      vm.regions = null;
      vm.sections = null;
      vm.RegionId = null;
      vm.SectionId = null;
    };

    vm.upSection = function () {
      vm.sections = null;
      vm.SectionId = null;
    };

    // api.material.materialScience.getMaterialList().then(function (r) {
    //   vm.materials = r.data||[];
    // });

    vm.init = function (m) {
      vm.Specifications = m.Specifications?m.Specifications.split('，'):[];
      vm.Models = m.Model?m.Model.split('，'):[];
    };

    if(vm.data.Id){
      vm.inputChange = true;
      vm.getMaps();
      api.material.materialPlan.getMaterial(vm.data.Id).then(function (r) {
        vm.data = r.data;
        vm.data.ProjectId = r.data.RegionId.substr(0,5);
        //vm.data.RegionId = r.data.RegionId.substr(5,10);
        vm.data.SectionId = r.data.SectionId;
        vm.data.PlanTime = r.data.PlanTime == null ? new Date() : new moment(r.data.PlanTime).toDate();

        vm.getAreas(vm.data.ProjectId);
        vm.RegionId = r.data.RegionId;
        vm.getSections(vm.data.RegionId);
        vm.SectionId = r.data.SectionId;
        api.material.materialScience.GetMaterialByTypeId(vm.data.TypeId).then(function (r) {
          vm.materials = r.data||[];
          vm.materials.forEach(function (q) {
            if(q.Id == vm.data.MaterialId){
              q.selected = true;
              vm.init(q);
            }
          });
        });

      });
    }

    vm.save = function () {
      if ($scope.myForm.$valid) {
        vm.data.RegionId = vm.RegionId;
        vm.data.SectionId = vm.SectionId;
        vm.data.MaterialId = vm.data.Material.Id;
        vm.data.PlanTime = new Date(vm.data.PlanTime);
        if(vm.data.Id){
          api.material.materialPlan.putMaterial(vm.data).then(function () {
            utils.alert("提交成功", null, function () {
              $state.go("app.material.plans");
            });
          });
        }else{
          api.material.materialPlan.Create(vm.data).then(function () {
            utils.alert("提交成功",null,function(){
              $state.go("app.material.plans");
            });
          });
        }
      }
    };

    vm.change = function(){
      vm.inputChange = true;
    };

    var materialName='',specification='',model='',planCount = '',unit='';
    $scope.$watch('vm.data.Material',function(){
      if(vm.data&&vm.data.Material&&!vm.inputChange){
        materialName = '';
        materialName = vm.data.Material.MaterialName;
        vm.data.PlanName = materialName + specification + model + planCount + unit;
      }
    });

    $scope.$watch('vm.data.Specifications',function(){
      if(vm.data&&vm.data.Specifications&&!vm.inputChange){
        specification = '';
        specification = '_' + vm.data.Specifications;
        vm.data.PlanName = materialName + specification + model + planCount + unit;
      }
    });

    $scope.$watch('vm.data.Model',function(){
      if(vm.data&&vm.data.Model&&!vm.inputChange){
        model = '';
        model = '_' + vm.data.Model;
        vm.data.PlanName = materialName + specification + model + planCount + unit;
      }
    });

    $scope.$watch('vm.data.PlanCount',function(){
      if(vm.data&&vm.data.PlanCount&&!vm.inputChange){
        planCount = '';
        planCount = '_' + vm.data.PlanCount;
        vm.data.PlanName = materialName + specification + model + planCount + unit;
      }
    });

    $scope.$watch('vm.data.Unit',function(){
      if(vm.data&&vm.data.Unit&&!vm.inputChange){
        unit = '';
        unit = vm.data.Unit + '_' + new Date(vm.data.PlanTime).Format('yyMMdd');
        vm.data.PlanName = materialName + specification + model + planCount + unit;
      }
    });
  }

})(angular,undefined);
