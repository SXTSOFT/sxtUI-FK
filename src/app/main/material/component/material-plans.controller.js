/**
 * Created by 陆科桦 on 2016/10/17.
 */

(function (angular,undefined) {
  'use strict';
  angular
    .module('app.material')
    .component('materialPlans',{
      templateUrl:'app/main/material/component/material-plans.html',
      controller:materialPlans,
      controllerAs:'vm'
    })

  /** @ngInject */
  function materialPlans($scope,api,utils,remote,auth) {
    var vm = this;
    var user = auth.current();
    vm.data = {};
    vm.ProjectId = '';
    vm.RegionId = '';
    vm.SectionId = '';
    $scope.pageing={
      page:1,
      pageSize:10,
      total:0
    };
    var role = [];
    vm.projects = [];
    if(user.Role.MemberType !== ''){
      api.material.materialPlan.getUserProjectSectionForPc().then(function (result) {
        role = result.data;
      });
    }

    var projects = null;
    api.xhsc.Project.getMap("nodb").then(function (r) {
      vm.projects = r.data;
      projects = r.data.map(function (r) { return r.ProjectID }).join(',');
      Load();
    });

    vm.getSections = function () {
      return api.xhsc.Project.GetAreaChildenbyID(vm.data.ProjectId).then(function (r) {
        vm.sections = r.data;
      })
    };

    vm.pageAction = function (title, page, pageSize, total) {
      $scope.pageing.page = page;
    };

    $scope.$watch('pageing',function () {
      Load();
    },true);

    $scope.$watch('vm.ProjectId',function () {
      vm.regions = [];
      vm.RegionId = '';
      vm.SectionId = '';
      api.xhsc.Project.GetAreaChildenbyID(vm.ProjectId).then(function (r) {
        
        vm.regions = r.data;
        // if(vm.regions.length != 0)
        //   vm.regions[0].selected = true;
      });
    },true);

    $scope.$watch('vm.RegionId',function () {
      vm.sections = [];
      vm.SectionId = '';
      api.material.materialPlan.GetProjectSection(vm.RegionId).then(function (e) {
        vm.sections = e.data;
        // if(vm.sections.length != 0)
        //   vm.sections[0].selected = true;
      });
    },true);

    $scope.$watch('vm.SectionId',function () {
        Load();
    },true);

    function Load() {
      projects = vm.ProjectId?vm.ProjectId:projects;
      var SectionId = vm.SectionId || '';

      var page = utils.getPage($scope.pageing);
      api.material.materialPlan.getList({RegionId:projects,SectionId:SectionId,Skip:page.Skip,Limit:page.Limit}).then(function (q) {
        vm.data = q.data.Items||[];
        $scope.pageing.total = q.data.TotalCount;
      });
    }

    vm.delete = function(id){
      utils.confirm('确认删除此材料信息').then(function () {
        api.material.materialPlan.delete(id).then(function () {
          Load();
        })
      });
    }

  }
})(angular,undefined);
