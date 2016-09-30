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

    vm.resetName = function (item) {
      item.Name = (item.FullName || item.TaskFlowName)+' - ' +
        (item.selectedTask?item.selectedTask.Name:'') + ' - 可选('+item.OptionalTasks.length+')'
    }
    function setTask(item) {
      var next = vm.rootTask.Master.find(function (it) {
        return it.ParentId===item.Id && it.OptionalTasks.find(function (task) {
          return task.TaskLibraryId===item.selectedTask.TaskLibraryId;
        })!=null;
      });
      if(next){
        next.selectedTask = next.OptionalTasks.find(function (task) {
          return task.TaskLibraryId===item.selectedTask.TaskLibraryId;
        });
        vm.resetName(next);
        setTask(next);
      }
    }
    vm.reloadTask = function () {
      if(vm.current) {
        vm.resetName(vm.current);
        setTask(vm.current);
      }
      vm.temp.load(vm.rootTask);
    }
    vm.nextStep = function(i){
      if(i==0){
        (vm.formWizard.Id?
          api.plan.BuildPlan.update(vm.formWizard.Id,vm.formWizard)
          :api.plan.BuildPlan.post(vm.formWizard)
        ).then(function(r) {
          if (r.data) {
            if(!vm.formWizard.Id)
              vm.formWizard.Id = r.data.Id;

            api.plan.BuildPlan.getBuildPlanFlowTree(vm.formWizard.Id).then(function(r){
              r.data.RootTask.Master = r.data.RootTask.Master.map(function (item) {
                item._TaskFlowId = item.TaskFlowId;
                item.TaskFlowId = item.Id;
                item.selectedTask = item.OptionalTasks.length==0?null:item.OptionalTasks[0];
                vm.resetName(item);
                return item;
              })
              vm.temp = new template({
                onClick:function (e) {
                  vm.current = e.data;
                  vm.toggleRight();
                }
              });
              vm.rootTask = r.data.RootTask;
              vm.reloadTask();
            });
          }
        })
      }
      else if(i===1){
        var selected = [];
        vm.rootTask.Master.forEach(function (item) {
          if(item.selectedTask) {
            selected.push({
              BuildingPlanFlowId:item.Id,
              TaskLibraryId:item.selectedTask.TaskLibraryId
            });
          }
        })

        api.plan.BuildPlan.flowTasksReset(vm.formWizard.Id,selected).then(function (r) {
          api.plan.BuildPlan.getBuildingPlanRoles(vm.formWizard.Id).then(function (r) {
            vm.currentRoles = r.data.Items;
          });
        });
        //api.plan.BuildPlan.getBuildingPlanRoleUsers(vm.formWizard.Id).then(function(r){
        //  vm.roleUsers = r.data.Items;
        //})
      }
      api.plan.users.query().then(function(r){
        vm.roleUsers = r.data.Items;
      })
    }
    vm.change = function(){
      console.log('a')
    }
    vm.stop = function(ev){
      ev.stopPropagation();
    }
    vm.sendForm = function(){
      var resets = [];
      vm.currentRoles.forEach(function (r) {
        resets.push(api.plan.BuildPlan.buildingRolesReset(vm.formWizard.Id,{
          RoleId:r.RoleId,
          UserIds:r.Users
        }));
      });

      $q.all(resets).then(function (rs) {
        //生成计划
        api.plan.BuildPlan.generate(vm.formWizard.Id).then(function (r) {
          //成生完成
        })
      });
    }
    $scope.$watch('msWizard.selectedIndex',function () {
      /*      switch ($scope.msWizard.selectedIndex){
       case 1:

       break;
       }*/
    })

    vm.RoleAllots = [{value:'AAA',text:'AAA'},{value:'AAA2',text:'AAA2'}];
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
