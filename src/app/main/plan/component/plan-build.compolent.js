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
  function planBuild($scope,api,template,$q,$mdSidenav,utils,$timeout){
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
    //vm.save = function(){
    //  if(!vm.duration){
    //    utils.alert('请输入工期');
    //    return;
    //  };
    //  vm.closeRight();
    //}
    vm.nextStep = function(i,f){
      if(i==0){
        (vm.formWizard.Id?
          api.plan.BuildPlan.update(vm.formWizard.Id,vm.formWizard)
          :api.plan.BuildPlan.post(vm.formWizard)
        ).then(function(r) {
          if (r.data|| r.status==200) {
            if(!vm.formWizard.Id)
              vm.formWizard.Id = r.data.Id;

            getDataTemplate();

            f();
          }
        },function(err){
          if(err.status == -1){
            utils.alert('创建计划失败');
            return;
          }
        })
      }
      else if(i===1){
        var selected = [];
        f();
        vm.rootTask.Master.forEach(function (item) {
          if(item.selectedTask) {
            selected.push({
              BuildingPlanFlowId:item.Id,
              TaskLibraryId:item.selectedTask.TaskLibraryId,
              Duration:item.selectedTask.duration
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
    }

    function getDataTemplate(){
      api.plan.BuildPlan.getBuildPlanFlowTree(vm.formWizard.Id).then(function(r){
        r.data.RootTask.Master = r.data.RootTask.Master.map(function (item) {
          item._TaskFlowId = item.TaskFlowId;
          item.TaskFlowId = item.Id;
          item.selectedTask = item.OptionalTasks.length==0?null:item.OptionalTasks[0];
          vm.resetName(item);
          return item;
        });
        r.data.RootTask.Branch.forEach(function(_t){
          _t.forEach(function(_tt){
            _tt._TaskFlowId = _tt.TaskFlowId;
            _tt.TaskFlowId = _tt.Id;
            _tt.Name = _tt.FullName||_tt.TaskFlowName;
          })
        })
        vm.temp = new template({
          onClick:function (e) {
            vm.current = e.data;
            if(vm.current.selectedTask&&vm.current.selectedTask){
              if(vm.current.selectedTask.Duration&&!vm.current.selectedTask.duration){
                vm.current.selectedTask.duration = parseInt(vm.current.selectedTask.Duration);
              }else if(!vm.current.selectedTask.duration){
                vm.current.selectedTask.duration = -0;
              }
            }
            vm.showBg = true;
            vm.toggleRight();
          }
        });
        vm.rootTask = r.data.RootTask;
        vm.reloadTask();

        //$scope.$$childHead.msWizard.nextStep();
      });
    }
    vm.loadUser = function(){
      if(vm.roleUsers&&vm.roleUsers.length) return;
        return api.plan.users.query().then(function(r){
          vm.roleUsers = r.data.Items;
        })
    }
    //
    //vm.change = function(){
    //  console.log('a')
    //}
    vm.deleteTaskLib = function(){
      api.plan.BuildPlan.deleteTaskLibById(vm.formWizard.Id,vm.current.TaskFlowId).then(function(r){
        //console.log(r)
        if(r.status == 200){
          utils.alert('删除成功').then(function(){
            vm.showBg = false;
            vm.closeRight();
            $timeout(function(){
              getDataTemplate();
            },500)
          })
        }
      })
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
    vm.change = function(){
      vm.inputChange = true;
    }
    //$scope.$watch(function(){
    //  if(!vm.inputChange){
    //    return
    //  }
    //})
    $scope.$watch('vm.formWizard.projectId',function(){
      if(vm.formWizard&&vm.formWizard.projectId&&!vm.inputChange){
        var f=vm.data.projects.find(function(r){
          return r.ProjectID == vm.formWizard.projectId;
        })
        if(f){
          vm.formWizard.Name = f.ProjectName;
        }
      }
    });
    $scope.$watch('vm.formWizard.sectionId',function(){
      if(vm.formWizard&&vm.formWizard.sectionId&&!vm.inputChange){
        var f=vm.data.sections.find(function(r){
          return r.RegionID == vm.formWizard.sectionId;
        })
        if(f){
          vm.formWizard.Name = (vm.formWizard.Name||'') + f.RegionName;
        }
      }
    })
    $scope.$watch('vm.formWizard.BuildingId',function(){
      if(vm.formWizard&&vm.formWizard.BuildingId&&!vm.inputChange){
        var f=vm.data.buildings.find(function(r){
          return r.RegionID == vm.formWizard.BuildingId;
        })
        if(f){
          vm.formWizard.Name = (vm.formWizard.Name||'') + f.RegionName;
        }
      }
    })
    vm.changeDuration = function(){
      if(vm.current.selectedTask.Duration){
        vm.min = Math.round(vm.current.selectedTask.Duration * 0.8,1);
      }else{
        vm.min = 0;
      }
    }

    //vm.RoleAllots = [{value:'AAA',text:'AAA'},{value:'AAA2',text:'AAA2'}];
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
