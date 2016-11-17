/**
 * Created by lukehua on 2016/11/15.
 */

(function(angular,undefined){
  'use strict';
  angular
    .module('app.material')
    .component('materialContract',{
      templateUrl:'app/main/material/component/material-contract.html',
      controller:materialContract,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialContract($scope,api,utils,$q,$stateParams,$state){
    var vm = this;
    vm.projects = [];
    vm.data = {};
    vm.data.Id = $stateParams.id;

    vm.getMaps = function () {
      return api.xhsc.Project.getMap().then(function (r) {
        vm.projects = r.data;
      })
    };

    vm.getAreas = function (pId,selectId) {
      return api.xhsc.Project.GetAreaChildenbyID(pId).then(function (r) {
        if(selectId){
          r.data.forEach(function (a) {
            if(a.RegionID == selectId)
              a.selected = true;
          });
        }
        vm.areas = r.data;
      });
    };

    vm.getSections = function (aId,selectId) {
      api.material.materialPlan.GetProjectSection(aId).then(function (e) {
        if(selectId){
          e.data.forEach(function (a) {
            if(a.RegionID == selectId)
              a.selected = true;
          });
        }

        vm.sections = e.data;
      });
    };

    $q.all([
      api.material.contract.getSysOrgOU(),
      api.material.type.getList({Skip: 0, Limit: 100}),
      api.material.materialScience.getList({Skip: 0, Limit: 100})
    ]).then(function (r) {
      vm.Partners = r[0].data;
      vm.materialClass = r[1].data;
      console.log();
    });

    vm.upNext = function () {
        vm.data.AreaId = null;
        vm.data.SectionId = null;
    };

    vm.upSection = function () {
      vm.data.SectionId = null;
    };

    // $scope.$watch('vm.data.ProjectId',function () {
    //   vm.data.AreaId = null;
    //   vm.data.SectionId = null;
    // });
    //
    // $scope.$watch('vm.data.AreaId',function () {
    //   vm.data.SectionId = null;
    // });

    if(vm.data.Id){
      vm.getMaps();
      api.material.contract.getById(vm.data.Id).then(function (r) {
        vm.data = r.data;
        vm.getAreas(vm.data.ProjectId,vm.data.AreaId);
        vm.getSections(vm.data.AreaId,vm.data.SectionId);
      })
    }

    vm.save = function () {
      if(vm.data.Id){
        api.material.contract.update(vm.data).then(function () {
          utils.alert("提交成功", null, function () {
            $state.go("app.material.contracts");
          });
        });
      }else{
        api.material.contract.create(vm.data).then(function () {
          utils.alert("提交成功",null,function(){
            $state.go("app.material.contracts");
          });
        });
      }
    }
  }

})(angular,undefined);
