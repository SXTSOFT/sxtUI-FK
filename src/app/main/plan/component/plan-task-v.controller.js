/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTaskV',{
      templateUrl:'app/main/plan/component/plan-task-v.html',
      controller:planTaskV,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planTaskV($scope,template,$mdSidenav,$stateParams,api,$state,$mdDialog,$mdSelect,$q,utils,$timeout){
    var vm = this,
      temp,task,
      id = $state.params["id"];

    //工序
    api.plan.procedure.query().then(function(r){
      vm.procedures = r.data;
    })
    api.plan.MeasureInfo.query().then(function(r){
      vm.measureInfo = r.data
    })

    vm.isNew = $stateParams.id=='add';
    if(!vm.isNew){
      api.plan.TaskLibrary.getTaskFlow($stateParams.id).then(function (r) {
        task = vm.data = r.data;
        task.Master.forEach(function (flow) {
          if(flow.Description)
            angular.extend(flow,angular.fromJson(flow.Description));
          flow.oMilestone=flow.Milestone;
          flow.oName=flow.Name;
          flow.oReservedEndDays = flow.ReservedEndDays;
          flow.oDuration = flow.Duration;
        });
        task.Branch.forEach(function (b) {
          b.forEach(function (flow) {
            if(flow.Description)
              angular.extend(flow,angular.fromJson(flow.Description));
            flow.oMilestone=flow.Milestone;
            flow.oName=flow.Name;
            flow.oReservedEndDays = flow.ReservedEndDays;
            flow.oDuration = flow.Duration;
          })
        });
        vm.onLoadTemplate();
      })
    }
    else{
      task = vm.data = {
        Level:0
      }
    }
    vm.setEndFlow = function (flow,endFlow) {
      flow.EndFlagTaskFlowId = endFlow.TaskFlowId;
      vm.updateFlow(flow).then(function () {
        vm.flows = temp.load(temp.task);
      });
    }
    vm.relationTypes = [{
      name:'关联实测项',
      type:'PQMeasure'
    },{
      name:'关联工序',
      type:'Inspection'
    }]
    vm.addNext = function (ev,flow,isBranch) {
      var confirm = $mdDialog.prompt()
        .title('添加'+(isBranch?'下一分支':'下一流程'))
        .placeholder((isBranch?'分支名称':'流程名称'))
        .ariaLabel((isBranch?'分支名称':'流程名称'))
        .targetEvent(ev)
        .ok('确定')
        .cancel('取消');

      return $mdDialog.show(confirm).then(function(result) {
        var next = {
          TaskLibraryId: id,
          IsFloor: false,
          Type: isBranch ? temp.task.Branch.length+1 : flow ? flow.line : 0,
          ParentId: flow ? flow.TaskFlowId : 0,
          Name: result
        };
        return api.plan.TaskFlow.post(
          next
        ).then(function (r) {
          next.TaskFlowId = r.data.TaskFlowId;
          if(vm.data.Level==1){
            return api.plan.TaskLibrary.create({
              Name:result
            }).then(function (r1) {
              return api.plan.TaskFlow.resetTaskFlow(next.TaskFlowId,[{
                TaskFlowId:next.TaskFlowId,
                TaskLibraryId:r1.data.TaskLibraryId
              }]);
            });
          }
        }).then(function () {
          vm.flows = temp.add(next,flow,isBranch);
        });
      });
    }
    vm.removeFlow = function (ev,flow) {
      return utils.confirm('确认删除'+flow.Name+'？',null).then(function(){
        return api.plan.TaskFlow.resetTaskFlow(flow.TaskFlowId,[]).then(function (r) {
          return api.plan.TaskFlow.deleteFlow(flow.TaskFlowId).then(function () {
            if (vm.data.Level === 1) {
              return api.plan.TaskFlow.getSubTasks(flow.TaskFlowId).then(function (r) {
                return api.plan.TaskLibrary.delete(r.data.Items[0].TaskLibraryId);
              });
            }
          }).then(function () {
            vm.flows = temp.remove(flow);
          })
        });
      });
    }
    vm.updateFlowName = function (flow) {
      if(flow.oName != flow.Name){
        flow.oName = flow.Name;
        return vm.updateFlow(flow);
      }
    }
    vm.updateMilestone = function (flow) {
      if(flow.oMilestone != flow.Milestone){
        flow.oMilestone = flow.Milestone;
        return api.plan.MileStone.query({RelatedFlowId:flow.TaskFlowId}).then(function(r){
          var m = r.data && r.data.Items[0];
          if(!flow.Milestone){
            if(m) {
              return api.plan.MileStone.delete(m.Id);
            }
          }
          else{
            if(m) {
              m.Name = flow.Milestone;
              return api.plan.MileStone.update(m.Id, m)
            }
            else{
              return api.plan.MileStone.create({
                Name:flow.Milestone,
                RelatedFlowId:flow.TaskFlowId,
                Percentage:100
              });
            }
          }
        }).then(function () {
          return vm.updateFlow(flow);
        })
      }
    }
    vm.updateFlow = function (flow) {
      return api.plan.TaskFlow.updateTaskById({
        Id:flow.TaskFlowId,
        Name:flow.Name,
        IsFloor:flow.IsFloor,
        IsRequired:flow.IsRequired,
        EndFlagTaskFlowId:flow.EndFlagTaskFlowId,
        Description:angular.toJson({
          ReservedEndDays:flow.ReservedEndDays,
          Duration: flow.Duration,
          Milestone:flow.Milestone,
          OptionalTask:flow.OptionalTask,
          Notices:flow.Notices,
          CarryOut:flow.CarryOut
        })
      }).then(function () {

      })
    }
    vm.updateDuration = function (flow) {
      if(flow.oDuration != flow.Duration){
        flow.oDuration = flow.Duration;
        return api.plan.TaskFlow.getSubTasks(flow.TaskFlowId).then(function (r) {
          var taskLib = r.data.Items[0];
          taskLib.Id = taskLib.TaskLibraryId;
          taskLib.Duration = flow.Duration;
          return api.plan.TaskFlow.updateTaskById(taskLib).then(function () {
            return vm.updateFlow(flow);
          })
        });
      }
    }
    vm.updateReservedEndDays = function (flow) {
      if(flow.oReservedEndDays != flow.ReservedEndDays){
        flow.oReservedEndDays = flow.ReservedEndDays;
        return api.plan.TaskFlow.getSubTasks(flow.TaskFlowId).then(function (r) {
          var taskLib = r.data.Items[0];
          taskLib.Id = taskLib.TaskLibraryId;
          taskLib.ReservedEndDays = flow.ReservedEndDays;
          return api.plan.TaskFlow.updateTaskById(taskLib).then(function () {
            return vm.updateFlow(flow);
          })
        });
      }
    }
    vm.loadTemlpate = function () {
      return api.plan.TaskLibrary.getTaskFlow($stateParams.id).then(function (r) {
        task = vm.data = r.data;
        vm.onLoadTemplate();
      });
    }
    vm.onLoadTemplate = function () {
      if(!task) {
        task = {
          taskId: 0,
          Name: vm.data&&vm.data.name||'楼栋模板',
          Master: [],
          Branch: []
        }
      }
      if(temp)return;
      temp = new template({
        onClick:function (e) {
          vm.current = e.data;
          vm.saveNotice7=[];
          vm.MileStone = [];
          //vm.saveNoticeStarted = [];
          //vm.saveNoticeEarlyWarning=[];
          vm.saveNotice8=[];

        }
      });
      vm.flows = temp.load(task);

    }

    vm.selectOptionalTask =function (flow) {
      return $mdDialog.show({
        controller: ['$mdDialog', function ($mdDialog) {
          var vm = this;
          vm.flow = flow;

          vm.select = function () {
            $mdDialog.hide(vm.items.filter(function (t) {
              return t.selected;
            }));
          }
          api.plan.TaskLibrary.GetList({Skip: 0, Limit: 10000, Level: 1}).then(function (r) {
            vm.items = r.data.Items || [];
          });
        }],
        controllerAs: 'vm',
        templateUrl: 'app/main/plan/component/plan-task-subs.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      }).then(function (tasks) {
          var ts = [];
          tasks.forEach(function (t) {
            ts.push({
              TaskFlowId: flow.TaskFlowId,
              TaskLibraryId: t.TaskLibraryId
            });
          })
          return api.plan.TaskFlow.resetTaskFlow(flow.TaskFlowId, ts).then(function (r) {
            flow.OptionalTask = tasks.length ?
              (tasks.length > 1 ? tasks.length + '任务' : tasks[0].Name) : undefined;
            return vm.updateFlow(flow);
          })
        });
    }
  }
})(angular,undefined);
