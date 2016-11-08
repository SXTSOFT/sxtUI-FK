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
  function planBuild($scope,api,template,$q,$mdSidenav,utils,$timeout,$mdDialog,$mdPanel,$state){
    var vm = this;
    vm.data = {

    }
    vm.formWizard={

    }
    vm.formWizard.StartTime ?vm.formWizard.StartTime:vm.formWizard.StartTime = new Date();
    //$scope.$watch('vm.formWizard',function(){
    //  console.log(vm.formWizard)
    //},true)
    var gs = (function () {
      var vars = [],r = /[a-z]/gi,
        compare = function (s1,s2) {
          return s1.key.localeCompare(s2.key);
        };
      return {
        getVars:function (g) {
          var vs = g.toUpperCase().match(r),
            rs = [];
          if(!vs || vs.length===0) return rs;
          vs.forEach(function (v) {
            var r = vars.find(function (n) {
              return n.key == v;
            });
            if(!r){
              r = {
                key:v
              };
              vars.push(r);

            }
            rs.push(r);
          });
          vars.sort(compare);
          rs.sort(compare);
          return rs;
        },
        setVars:function (g) {
          var vs = g.toUpperCase().match(r),f = true;
          if(!vs ||vs.length===0){
            try {
              return eval(g);
            }catch (e){
              return g;
            }
          }
          vs.forEach(function (v) {
            var r = vars.find(function (n) {
              return n.key == v;
            });
            if(r && (r.value || r.value===0)){
              g = g.replace(new RegExp(v,'gi'),r.value);
            }
            else{
              f = false;
            }
          });

          if(f) {
            try {
              return eval(g);
            }catch (e){
              return g;
            }
          }
          else
            return g;
        }
      }
    })();

    vm.getVars = function (task) {
      if(!task) return;
      if(task.eDuration !='' && !task.eDuration)
        task.eDuration = task.Duration||'';

      task.vars = vm.vars = gs.getVars(task.eDuration);
      var r = gs.setVars(task.eDuration);
      if(!task.vars.length){
        task.minValue = task.Duration*0.8;
      }
      task.xDuration = r;
      return r;
    };
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
    vm.getYT = function(Id){
      if(!Id) return;
      var find = vm.data.projects.find(function(r){
          return r.ProjectID == Id;
        })
      if(find){
        vm.YT={
          ProjectFormatName:find.ProjectFormatName?find.ProjectFormatName:'',
          RegionName:find.RegionName?find.RegionName:''
        }
      }
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
        (item.selectedTask?item.selectedTask.Name:'')
      + ' - 可选('+item.OptionalTasks.length+')';

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
        next.selectedTask.eDuration = item.selectedTask.eDuration;
        next.selectedTask.xDuration = item.selectedTask.xDuration;
        vm.resetName(next);
        setTask(next);
      }
    }

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
          next.selectedTask.eDuration = vm.current.selectedTask.eDuration;//Math.round(item.selectedTask.duration*10)*0.1;
          next.selectedTask.xDuration = vm.current.selectedTask.xDuration;
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
    vm.flows=null;
    vm.branches=null;
    vm.nextStep = function(i,f){
      if(i==0){
        var find=vm.data.templates.find(function(r){
          return r.RootTaskLibraryId==vm.formWizard.RootTaskLibraryId
        })
        if(find){
          vm.formWizard.TaskTemplateId = find.Id;
        }
        f();
      }
      else if(i===1){
        var tasks = [], milestones = [],flag;
        vm.flows.reduce(function (prev, current) {
          //if(current.show) flag=true;
          if (!current.selected) return prev;
          if (current.type) {
            milestones.push({
              Name: current.Name,
              RelatedFlowId: current.RelatedFlowId,
              MilestoneTime: current.end&&current.end.format('YYYY-MM-DD')
            });
            return prev;
          }
          if (!current._id)
            current._id = sxt.uuid();

          tasks.push({
            "Id": current._id,
            "DependentTaskFlowId": prev && prev._id,
            "TaskFlowId": current._TaskFlowId || current.TaskFlowId,
            "FloorId": current.FloorId,
            "FloorName": current.FloorName,
            "Type": current.Type,
            "OptionalTask": {
              "TaskLibraryId": current.currentTask.TaskLibraryId,
              "PlanBeginTime": current.start&&current.start.format('YYYY-MM-DD'),
              "PlanEndTime": current.end&&current.end.format('YYYY-MM-DD'),
              "Days": current.days
            }
          })
          return current;
        }, null);
        vm.branches.forEach(function (current) {
          tasks.push({
            "Id": sxt.uuid(),
            "DependentTaskFlowId": null,
            "TaskFlowId": current.TaskFlowId,
            "FloorId": current.FloorId,
            "FloorName": current.FloorName,
            "Type": current.Type,
            "OptionalTask": {
              "TaskLibraryId": current.currentTask.TaskLibraryId,
              "PlanBeginTime": current.start&&current.start.format('YYYY-MM-DD'),
              "PlanEndTime": current.end&&current.end.format('YYYY-MM-DD'),
              "Days": current.days
            }
          })
        });
        var b = {
          "BuildingPlanInput": {
            "BuildingId": vm.formWizard.BuildingId,
            "Name": vm.formWizard.Name,
            "TaskTemplateId": vm.formWizard.TaskTemplateId,
            "StartTime": vm.formWizard.StartTime,
            "PreSalesTime": "",
            "ExpectEndTime": ""
          },
          "TaskFlows": tasks,
          "Milestones": milestones
        };
        var fg = true;
        tasks.forEach(function (t) {
          if(!t.OptionalTask.PlanEndTime){
            fg = false;
          }
        });
        if(!fg){
          utils.alert('有工期设置不恰当项存在!').then(function(){
          });
        return fg;
        };
        //if(flag){
        //  utils.alert('工期应大于基本工期的80%!').then(function(){
        //  });
        //  return;
        //};
          var parent = vm;
          var position = $mdPanel.newPanelPosition()
            .relativeTo('md-tabs-wrapper')
            .addPanelPosition($mdPanel.xPosition.CENTER, $mdPanel.yPosition.BELOW)

          $mdPanel.open({
            controller: function (mdPanelRef,$scope,utils) {
              var vm = this;
              parent.loading1 = false;
              parent.closePanel1 = function() {
                return mdPanelRef.close().then(function () {
                  mdPanelRef.destroy();
                  parent.loading1 = true;
                  parent.closePanel1 = null;
                });
              }
            },
            controllerAs: 'vm',
            template: '<div layout="row" class="mt-20" layout-align="center center"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div>',
            hasBackdrop: false,
            position: position,
            trapFocus: true,
            zIndex: 5000,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true,
            attachTo:angular.element('#content')
          });
          api.plan.BuildPlan.post(b).then(function(r){
            if(!vm.formWizard.Id)
              vm.formWizard.Id = r.data.Id;
            api.plan.BuildPlan.getBuildingPlanRoles(r.data.Id).then(function (r) {
              vm.currentRoles = r.data.Items;
              parent.closePanel1();
              f();
            });
          },function(err){
            parent.closePanel1();
            utils.alert(err.data||'提交失败');
            return;
          });
      }
    }
    function getDataTemplate(){
      return api.plan.BuildPlan.getBuildPlanFlowTree(vm.formWizard.Id).then(function(r){
        r.data.RootTask.Master = r.data.RootTask.Master.map(function (item) {
          item._TaskFlowId = item.TaskFlowId;
          item.TaskFlowId = item.Id;
          item.selectedTask = item.OptionalTasks.length==0?null:item.OptionalTasks[0];
          vm.getVars(item.selectedTask);
          //item.selectedTask.Duration = item.selectedTask.Duration?item.selectedTask.Duration:null;
          vm.resetName(item);
          return item;
        });
        r.data.RootTask.Branch.forEach(function(_t){
          _t.forEach(function(_tt){
            _tt._TaskFlowId = _tt.TaskFlowId;
            _tt.TaskFlowId = _tt.Id;
            _tt.Name = _tt.FullName||_tt.TaskFlowName;
          })
        });
        //vm.temp = new template({
        //  onClick:function (e) {
        //    vm.current = e.data;
        //    vm.showBg = true;
        //    vm.toggleRight();
        //  }
        //});
        vm.rootTask = r.data.RootTask;
       // vm.reloadTask();
      });
    }
    vm.loadUser = function(){
      if(vm.roleUsers&&vm.roleUsers.length) return;
        return api.plan.users.query().then(function(r){
          vm.roleUsers = r.data.Items;
        })
    }
    vm.deleteTaskLib = function(){
      utils.confirm('确认删除',null,'确定','取消').then(function(){
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
      })
    }
    vm.stop = function(ev){
      ev.stopPropagation();
    }
    vm.sendForm = function(fn){
      var resets = [];
      var p = vm;
      $mdDialog.show({
        controller:['$scope',function($scope){
          p.hide = function(){
            $mdDialog.cancel();
          }
        }],
        template: '<md-dialog style="background-color: transparent;box-shadow: none;"><md-dialog-content ><div layout="row" layout-align="center center"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div><div layout="row" layout-align="center center">正在生成，请稍后...</div></md-dialog-content></md-dialog>',
        parent: angular.element('#content'),
        clickOutsideToClose:false,
        hasBackdrop:true,
        escapeToClose: true,
        focusOnOpen: true
      })
      vm.currentRoles&&vm.currentRoles.forEach(function (r) {
        resets.push(api.plan.BuildPlan.buildingRolesReset(vm.formWizard.Id,{
          RoleId:r.RoleId,
          UserIds:r.Users
        }));
      });

      $q.all(resets).then(function (rs) {
        //生成计划
          utils.alert('生成计划完成').then(function(){
            $state.go('app.plan.gantts');
            //fn();
            //p.hide();
          })

        //api.plan.BuildPlan.generate(vm.formWizard.Id).then(function (r) {
        //  //成生完成
        //  if(r.status==200|| r.data){
        //    utils.alert('创建计划成功').then(function(){
        //      fn();
        //      p.hide();
        //    })
        //  }
        //},function(err){
        //  utils.alert(err.data||'创建计划成功').then(function(){
        //    p.hide();
        //  })
        //})
      },function(err){
        console.log(err)
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
      if(vm.current.selectedTask.eDuration){
        vm.min = Math.round(vm.current.selectedTask.eDuration * 0.8*10)*0.1;
      }else{
        vm.min = 0;
      }
    }
    vm.changeDuration = function(){
      //vm.setMin();
      if(!vm.current.selectedTask.vars.length){
        if(vm.current.selectedTask.eDuration<vm.current.selectedTask.minValue){
          //console.log('min')
          vm.minError = true;
        }else{
          vm.minError = false;
        }
      }
      vm.setDuration(vm.current);
    }
  }
})(angular,undefined);
