(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planBuild',{
      templateUrl:'app/main/plan/component/plan-build.html',
      controller:planBuild,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planBuild($scope,api,template,$q,$mdSidenav){
    var vm = this;
    vm.data = {

    }


    //获取模板
    api.plan.TaskTemplates.GetList({Skip:0,Limit:100}).then(function (r) {
      vm.data.templates = r.data.Items||[];
    })

    vm.getMaps = function () {
      return api.xhsc.Project.getMap().then(function (r) {
        vm.data.projects = r.data;
      })
    }

    vm.getSections = function () {
      return api.xhsc.Project.GetAreaChildenbyID(vm.formWizard.projectId).then(function (r) {
        vm.data.sections = r.data;
      })
    }

    vm.getBuildings = function () {
      return api.xhsc.Project.GetAreaChildenbyID(vm.formWizard.sectionId).then(function (r) {
        vm.data.buildings = r.data;
      })
    }
    vm.getFloors = function (bid) {
      return api.xhsc.Project.GetAreaChildenbyID(bid).then(function (r) {
        vm.data.floors = r.data;
        return r.data;
      })
    }
    vm.getTask = function (templateId) {
      return api.plan.TaskTemplates.getItem(templateId).then(function (r) {
        return api.plan.TaskLibrary.getTaskFlow(r.data.RootTaskLibraryId).then(function (r1) {
          return r1.data;
        })
      })
    }
    vm.toggleRight = function () {
      return $mdSidenav('right')
        .open();
    }
    vm.closeRight = function () {
      return $mdSidenav('right')
        .close();
    }

    //$q.all([
    //  vm.getFloors('000370000000000'),
    //  vm.getTask(4)
    //]).then(function (rs) {
    //  var fs = rs[0],
    //    task = rs[1];
    //  console.log('fs',fs,task);
    //  var temp = new template({
    //    onClick:function (e) {
    //      vm.current = e.data;
    //      vm.toggleRight();
    //    },
    //    onNodeColor:function (t) {
    //
    //    },
    //    onNodeDotColor:function (t) {
    //
    //    }
    //  });
    //  temp.load(task);
    //})
    vm.nextStep = function(i){
      api.plan.BuildPlan.getBuildPlanFlowTree(13).then(function(r){
        var temp = new template({
          onClick:function (e) {
            vm.current = e.data;
            vm.toggleRight();
          }
        });
        temp.load(r.data.RootTask);
      })
      if(i==0){
        var data = {
          "BuildingId": vm.formWizard.buildingId,
          "Name":vm.formWizard.planName,
          "TaskTemplateId": vm.formWizard.templateId,
          "StartTime": vm.formWizard.beginDate
        }
        //api.plan.BuildPlan.post(data).then(function(r){
        //
        //  if(r.data){
        //
        //  }
        //})
      }
      console.log('a',i)
    }
    vm.change = function(){
      console.log('a')
    }
    vm.stop = function(ev){
      ev.stopPropagation();
    }
    vm.sendForm = function(){
      //var data = {
      //  "BuildingId": vm.formWizard.buildingId,
      //  "Name":vm.formWizard.planName,
      //  "TaskTemplateId": vm.formWizard.templateId,
      //  "StartTime": vm.formWizard.beginDate
      //}
      //api.plan.BuildPlan.post(data).then(function(r){
      //
      //})
    }
    $scope.$watch('msWizard.selectedIndex',function () {
      /*      switch ($scope.msWizard.selectedIndex){
       case 1:

       break;
       }*/
    })
/*    var task = {
      taskId: 0,
      name: '楼栋模板',
      master: [{
        categoryId: 1,
        name: '前期准备',
        tasks: []
      }, {
        categoryId: 2,
        name: '开工',
        tasks: []
      }, {
        categoryId: 3,
        name: '基坑',
        tasks: []
      }, {
        categoryId: 4,
        name: '基坑土方',
        tasks: []
      }, {
        categoryId: 5,
        name: '桩基',
        tasks: []
      }, {
        categoryId: 6,
        name: '桩基土方',
        tasks: []
      }, {
        categoryId: 7,
        name: '结构基础',
        tasks: []
      }, {
        categoryId: 8,
        name: '楼层',
        tasks: []
      }, {
        categoryId: 9,
        name: '外墙面',
        tasks: []
      }, {
        categoryId: 10,
        name: '落架',
        tasks: []
      }, {
        categoryId: 11,
        name: '室外景观',
        tasks: []
      }, {
        categoryId: 12,
        name: '竣工验收',
        tasks: []
      }, {
        categoryId: 13,
        name: '加建',
        tasks: []
      }, {
        categoryId: 14,
        name: '土建移交',
        tasks: []
      }, {
        categoryId: 15,
        name: '批量精装',
        tasks: []
      }, {
        categoryId: 16,
        name: '管理权移交',
        tasks: []
      }],
      branch: [
        [
          {
            categoryId: 30,
            parentCategoryId: 2,
            name: '前期准备验收',
            tasks: []
          },
          {
            categoryId: 31,

            parentCategoryId: 30,
            name: '前期准备验收1',
            tasks: []
          },
          {
            categoryId: 32,
            endFlagCategoryId: 7,
            parentCategoryId: 31,
            name: '前期准备验收4',
            tasks: []
          }
        ],
        [{
          categoryId: 42,
          parentCategoryId: 31,
          endFlagCategoryId: 8,
          name: '前期准备验收2',
          tasks: []
        }]
      ]
    };*/
  }
})(angular,undefined);
