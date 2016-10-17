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
        (item.selectedTask?item.selectedTask.Name:'') + ' - 可选('+item.OptionalTasks.length+')';

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
    $scope.$watch('vm.current.selectedTask',function(){
      if(vm.current&&vm.current.selectedTask){
        if(vm.current.selectedTask.Duration&&!vm.current.selectedTask.duration){
          vm.current.selectedTask.duration = Math.round(vm.current.selectedTask.Duration*10)*0.1;
        }else if(!vm.current.selectedTask.duration){
          vm.current.selectedTask.duration = -0;
        }
        vm.setMin();
      }
    })
    vm.setDuration = function(item){
      var next = vm.rootTask.Master.find(function (it) {
        return it.ParentId===item.Id && it.OptionalTasks.find(function (task) {
            return task.TaskLibraryId===item.selectedTask.TaskLibraryId;
          })!=null;
      });
      if(next) {
        next.selectedTask = next.OptionalTasks.find(function (task) {
          return task.TaskLibraryId === item.selectedTask.TaskLibraryId;
        });
        if (next.selectedTask) {
          next.selectedTask.duration = Math.round(item.selectedTask.duration*10)*0.1;
        }
        vm.setDuration(next)
      }
    }
    vm.reloadTask = function () {
      if(vm.current) {
        vm.resetName(vm.current);
        setTask(vm.current);
      }
      vm.temp.load(vm.rootTask);
    }
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
                vm.current.selectedTask.duration = Math.round(vm.current.selectedTask.Duration*10)*0.1;
              }else if(!vm.current.selectedTask.duration){
                vm.current.selectedTask.duration = -0;
              }
            }
            vm.setMin();
            vm.showBg = true;
            vm.toggleRight();
          }
        });
        vm.rootTask = r.data.RootTask;
        vm.reloadTask();
      });
    }
    vm.loadUser = function(){
      if(vm.roleUsers&&vm.roleUsers.length) return;
        return api.plan.users.query().then(function(r){
          vm.roleUsers = r.data.Items;
        })
    }
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
    vm.sendForm = function(fn){
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
          if(r.status==200|| r.data){
            utils.alert('创建计划成功').then(function(){
              fn();
            })
          }
        })
      });
    }
    vm.change = function(){
      vm.inputChange = true;
    }
    var regionName1='',regionName2='',regionName3='';
    $scope.$watch('vm.formWizard.projectId',function(){
      vm.data.sections = null;
      vm.data.buildings=null;
      if(vm.formWizard&&vm.formWizard.projectId&&!vm.inputChange){
        regionName1='';
        var f=vm.data.projects.find(function(r){
          return r.ProjectID == vm.formWizard.projectId;
        })
        if(f){
          regionName1 = f.ProjectName;
          vm.formWizard.Name = regionName1;
        }
      }
    });
    $scope.$watch('vm.formWizard.sectionId',function(){
      vm.data.buildings=null;
      if(vm.formWizard&&vm.formWizard.sectionId&&!vm.inputChange){
        regionName2 = '';
        var f=vm.data.sections.find(function(r){
          return r.RegionID == vm.formWizard.sectionId;
        })
        if(f){
          regionName2 = f.RegionName;
          vm.formWizard.Name = regionName1+regionName2;
        }
      }
    })
    $scope.$watch('vm.formWizard.BuildingId',function(){
      if(vm.formWizard&&vm.formWizard.BuildingId&&!vm.inputChange){
        regionName3 = '';
        var f=vm.data.buildings.find(function(r){
          return r.RegionID == vm.formWizard.BuildingId;
        })
        if(f){
          regionName3 = f.RegionName;
          vm.formWizard.Name = regionName1+regionName2+regionName3;
        }
      }
    })
    vm.setMin = function(){
      if(vm.current.selectedTask.Duration){
        vm.min = Math.round(vm.current.selectedTask.Duration * 0.8*10)*0.1;
      }else{
        vm.min = 0;
      }
    }
    vm.changeDuration = function(){
      vm.setMin();
      vm.setDuration(vm.current);
    }
  }
})(angular,undefined);
