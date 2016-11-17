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

    $scope.clearSearchTerm = function() {
      $scope.searchTerm = '';
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

    vm.getAreas = function (pId,selectId) {
      return api.xhsc.Project.GetAreaChildenbyID(pId).then(function (r) {
        if(selectId){
          r.data.forEach(function (a) {
            if(a.RegionID == selectId)
              a.selected = true;
          });
        }
        vm.regions = r.data;
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
    vm.upNext = function () {
      vm.regions = null;
      vm.sections = null;
      vm.data.RegionId = null;
      vm.data.SectionId = null;
    };

    vm.upSection = function () {
      vm.sections = null;
      vm.data.SectionId = null;
    };

    // api.xhsc.Project.getMap().then(function (r) {
    //   if(user.Role.MemberType !== ''){
    //     role.forEach(function (o) {
    //       var pj = r.data.find(function (p) {
    //         return p.ProjectID == o.ProjectId;
    //       });
    //       if(pj){
    //         vm.projects.push(pj);
    //       }
    //     })
    //   }else {
    //     vm.projects = r.data;
    //   }
    // });
    //
    api.material.materialScience.getMaterialList().then(function (r) {
      vm.materials = r.data||[];
    });

    // $scope.$watch('vm.data.ProjectId',function () {
    //   vm.regions = [];
    //   vm.sections = [];
    //   api.xhsc.Project.GetAreaChildenbyID(vm.data.ProjectId).then(function (r) {
    //     if(user.Role.MemberType !== ''){
    //       role.forEach(function (o) {
    //         var pj = r.data.find(function (p) {
    //           return p.RegionID == o.AreaId;
    //         });
    //         if(pj){
    //           vm.regions.push(pj);
    //         }
    //       });
    //     }else{
    //       vm.regions = r.data;
    //     }
    //
    //     vm.regions.forEach(function (r) {
    //       r.tempId = r.RegionID.substr(5,10);
    //       if(r.tempId == vm.data.RegionId){
    //         r.selected = true;
    //       }
    //     });
    //   });
    // },true);
    //
    // $scope.$watch('vm.data.RegionId',function () {
    //   api.material.materialPlan.GetProjectSection(vm.data.RegionId).then(function (e) {
    //     vm.sections = e.data || [];
    //     vm.sections.forEach(function (p) {
    //       if(p.AreaID == vm.data.RegionId){
    //         p.selected = true;
    //       }
    //     });
    //   });
    // },true);

    vm.init = function (m) {
      vm.Specifications = m.Specifications.split('，') || [];
      vm.Models = m.Model.split('，') || [];
    };

    if(vm.data.Id){
      vm.getMaps();
      api.material.materialPlan.getMaterial(vm.data.Id).then(function (r) {
        vm.data = r.data;
        vm.data.ProjectId = r.data.RegionId.substr(0,5);
        //vm.data.RegionId = r.data.RegionId.substr(5,10);
        vm.data.SectionId = r.data.SectionId;
        vm.data.PlanTime = r.data.PlanTime == null ? new Date() : new moment(r.data.PlanTime).toDate();

        vm.getAreas(vm.data.ProjectId,vm.data.RegionId);
        vm.getSections(vm.data.RegionId,vm.data.SectionId);
        api.material.materialScience.getMaterialList().then(function (r) {
          vm.materials = r.data||[];
          vm.materials.forEach(function (q) {
            q.childrens.forEach(function (c) {
              if(c.Id == vm.data.MaterialId){
                c.selected = true;
                vm.init(c);
              }
            })
          });
        });

      });
    }

    vm.save = function () {
      if ($scope.myForm.$valid) {
        vm.data.PlanName = vm.data.Material.MaterialName + '_' + vm.data.Specifications + '_' + vm.data.Model + '_' + vm.data.PlanCount + vm.data.Unit + '_' + new Date(vm.data.PlanTime).Format('yyMMdd');

        if(vm.data.Id){
          vm.data.MaterialId = vm.data.Material.Id;
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
  }

})(angular,undefined);
