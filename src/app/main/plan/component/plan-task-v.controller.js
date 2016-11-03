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
        task.oType = task.Type;
        task.Master.forEach(function (flow) {
          if(flow.Description)
            angular.extend(flow,angular.fromJson(flow.Description));
          flow.oMilestone=flow.Milestone;
          flow.oName=flow.Name;
          flow.oReservedEndDays = flow.ReservedEndDays;
          flow.oDuration = flow.Duration;
          flow.oNotice7 = flow.Notice7;
          flow.oNotice8 = flow.Notice8;
          flow.oMeasureInfo = flow.MeasureInfo;
          flow.oExpression = flow.Expression;
        });
        task.Branch.forEach(function (b) {
          b.forEach(function (flow) {
            if(flow.Description)
              angular.extend(flow,angular.fromJson(flow.Description));
            flow.oMilestone=flow.Milestone;
            flow.oName=flow.Name;
            flow.oReservedEndDays = flow.ReservedEndDays;
            flow.oDuration = flow.Duration;
            flow.oNotice7 = flow.Notice7;
            flow.oNotice8 = flow.Notice8;
            flow.oMeasureInfo = flow.MeasureInfo;
            flow.oExpression = flow.Expression;
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
      flow.EndFlagTaskFlowId = endFlow? endFlow.TaskFlowId:0;
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
              Level:vm.data.Level+1,
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
        return $q(function (resolve) {
          if (vm.data.Level === 1) {
            return api.plan.TaskFlow.getSubTasks(flow.TaskFlowId).then(function (r) {
              if(r.data.Items.length){
                var q=[];
                r.data.Items.forEach(function (t) {
                  q.push(api.plan.TaskLibrary.delete(t.TaskLibraryId));
                });
                $q.all(q).then(function () {
                  resolve();
                })
              }
              else{
                resolve();
              }
            });
          }
          else {
            resolve();
          }
        }).then(function () {
          return api.plan.TaskFlow.resetTaskFlow(flow.TaskFlowId,[]).then(function (r) {
            return api.plan.TaskFlow.deleteFlow(flow.TaskFlowId).then(function () {
              vm.flows = temp.remove(flow);
            })
          });
        });
      });
    }
    vm.updateFlowName = function (flow) {
      if(flow.oName != flow.Name){
        flow.oName = flow.Name;
        return vm.updateFlow(flow);
      }
    }
    vm.updateExpression = function (flow) {
      if(flow.oExpression != flow.Expression){
        flow.oExpression = flow.Expression;
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
        Expression:flow.Expression,
        Description:angular.toJson({
          ReservedEndDays:flow.ReservedEndDays,
          Duration: flow.Duration,
          Milestone:flow.Milestone,
          OptionalTask:flow.OptionalTask,
          Notices:flow.Notices,
          CarryOut:flow.CarryOut,
          Notice7: flow.Notice7,
          Notice8: flow.Notice8,
          MeasureInfo:flow.MeasureInfo
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
          return api.plan.TaskLibrary.update(taskLib).then(function () {
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
          //vm.saveNotice7=[];
          //vm.MileStone = [];
          //vm.saveNotice8=[];
        }
      });
      vm.flows = temp.load(task);
    }

    vm.selectOptionalTask =function (flow) {
      return $mdDialog.show({
        controller: ['$mdDialog','$scope', function ($mdDialog) {
          var vm = this;
          vm.flow = flow;
          vm.data = {};
          var promises = [
            api.plan.TaskLibrary.GetList({Skip: 0, Limit: 10000, Level: task.Level+1}),
            api.plan.TaskFlow.getSubTasks(flow.TaskFlowId)
          ];
          $q.all(promises).then(function(res){
            vm.items = res[0].data.Items;
            vm.selectedTasks =  res[1].data.Items;
            vm.items.forEach(function(r){
              var f = res[1].data.Items&&res[1].data.Items.find(function(_r){
                  return _r.TaskLibraryId == r.TaskLibraryId;
                })
              if(f){
                r.selected = true;
              }
            })
          })
          vm.add = function(cmd){
            vm.current = cmd;
            vm.data = {};
          }
          vm.select = function () {
            $mdDialog.hide(vm.items.filter(function (t) {
              return t.selected;
            }));
          }
          vm.submit = function () {
            vm.data.Type = vm.data.Type || flow.Name;
            vm.data.Level = task.Level+1;
              api.plan.TaskLibrary.create(vm.data).then(function(r){
                if(r.status == 200 || r.data){
                  vm.current = 'default';
                  api.plan.TaskLibrary.GetList({Skip: 0, Limit: 10000, Level: task.Level+1}).then(function(r1){

                    if(vm.items){
                      r1.data.Items.forEach(function (item) {
                        item.selected = !!vm.items.find(function (it) {
                          return it.TaskLibraryId == item.TaskLibraryId && it.selected;
                        })
                      });
                    }
                    var newItem = r1.data.Items.find(function (it) {
                      return it.TaskLibraryId == r.data.TaskLibraryId;
                    });
                    if(newItem)
                      newItem.selected = true;

                    vm.items = r1.data.Items;
                  })
                }
              })
            }
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
    vm.selectUsers = function(item,type){
      return $mdDialog.show({
        templateUrl:'app/main/plan/component/plan-task-roles.html',
        controller:['$scope',function($scope){
          var vm = this;
          vm.type = type;
          vm.loadUser = loadUser;
          loadUser();
          vm.add = function(){
            api.plan.UserGroup.create({
              "GroupName": vm.dataName,
              "SystemID": "plan",
              "Description": vm.dataName
            }).then(function(res){
              vm.current = 'default';
              api.plan.UserGroup.query().then(function(r){
                //vm.nextUserGroups = r.data.Items;
                if(vm.nextUserGroups){
                  r.data.Items.forEach(function (item) {
                    item.selected = !!vm.nextUserGroups.find(function (it) {
                      return it.GroupID == item.GroupID && it.selected;
                    })
                  });
                }
                vm.nextUserGroups = r.data.Items;
              });
              //loadUser();
            })
          }
          vm.select = function () {
              $mdDialog.hide(vm.nextUserGroups.filter(function (t) {
                return t.selected;
              }));
          }
          function loadUser(){
            api.plan.UserGroup.query().then(function(r){
              vm.nextUserGroups = r.data.Items;
            });
          }
          api.plan.TaskFlow.getRoleByFlowId(item.TaskFlowId).then(function(res){
            var users = res.data.Items;
            if(!users.length) return;
            users&&users.forEach(function(r){
              var f = vm.nextUserGroups&&vm.nextUserGroups.find(function(_r){
                  return _r.GroupID == r.RoleId;
                })
              if(f&& r.NotificationType == vm.type){
                f.selected = true;
              }
            })
          })

        }],
        controllerAs: 'vm',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      }).then(function(back){
        var users ={
          roleIds:[]
        };
        var datas = back;
        datas&&datas.forEach(function(r){
          users.roleIds.push(r.GroupID)
        })
        api.plan.TaskFlow.resetTaskFlowRolesByType(item.TaskFlowId,type,users.roleIds).then(function(r){
          item['Notice'+type] = back.length ?
            (back.length > 1 ? back.length + '角色' : back[0].GroupName) : undefined;
          return vm.updateFlow(item);
        })
      })
    }
    //获取所有角色
    //api.plan.UserGroup.query().then(function(r){
    //  vm.nextUserGroups = r.data.Items;
    //})
    vm.stop = function(ev){
      ev.stopPropagation();
    }
    vm.setUsers = function(items){

    }

    vm.saveUserGroup = function (flow,type) {
      var users ={
        roleIds:[]
      };
      var datas = flow['saveNotice'+type];
      datas&&datas.forEach(function(r){
        users.roleIds.push(r)
      })
      api.plan.TaskFlow.resetTaskFlowRolesByType(flow.TaskFlowId,type,users.roleIds).then(function(r){
        flow['saveNotice'+type] = datas;
        return vm.updateFlow(flow);
      })
    }

    api.plan.procedure.query().then(function(r){
      vm.procedures = r.data;
    })
    api.plan.MeasureInfo.query().then(function(r){
      vm.measureInfo = r.data;
    })
    //vm.selectSpecialtyLow=function(item,parent){
    //  parent.WPAcceptanceList=item.WPAcceptanceList;
    //}
    vm.setMeasureInfo = function(flow){
      return $mdDialog.show({
        controller:['$scope','pdata','mdata','data',function($scope,pdata,mdata,data){
          var vm = this;
          vm.data = data;
          vm.current = null;
          vm.gxName = '';
          vm.proceduresData = pdata;
          vm.measureData = mdata;
          setVaule();
          function setVaule(){
            var f = vm.measureData.find(function(_r){
              return _r.AcceptanceItemID == vm.data.CloseRelatedObjectId;
            })
            vm.proceduresData.forEach(function(_r){
              _r.SpecialtyChildren.forEach(function(_rr){
                var g=_rr.WPAcceptanceList && _rr.WPAcceptanceList.find(function(t){
                  return t.AcceptanceItemID ==  vm.data.CloseRelatedObjectId;
                })
                if(g){
                  vm.current = g;
                  vm.gxName = flow.MeasureInfo;
                }
              })
            })
            if(f){
              vm.current = f;
            }
          }
          vm.stop = function(ev){
            ev.stopPropagation();
          }
          vm.choose = function(item){
            vm.current = item;
            vm.data.CloseRelatedObjectId = item.AcceptanceItemID;
            vm.gxName = item.AcceptanceItemName;
            flow.MeasureInfo = item.AcceptanceItemName;
          }
          vm.select = function(index){
              if(index==0){
                vm.data.CloseRelatedObjectType = 'PQMeasure';
                vm.data.CloseRelatedObjectId = vm.CloseRelatedObjectId.AcceptanceItemID;
                flow.MeasureInfo = vm.CloseRelatedObjectId.MeasureItemName;
              }else{
                vm.data.CloseRelatedObjectType = 'Inspection';
              }
            $mdDialog.hide(vm.data);
          }
        }],
        controllerAs:'vm',
        templateUrl:'app/main/plan/component/plan-task-measureinfo.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        locals:{
          pdata:vm.procedures && vm.procedures,
          mdata:vm.measureInfo && vm.measureInfo,
          data:vm.data && vm.data
        }
      }).then(function(data){
        api.plan.TaskLibrary.update(data).then(function (r) {
          return vm.updateFlow(flow);
        });
      })
    }
    vm.ClickSaveleft = function(data){
      data.Type = data.Type || data.oType;
      if(id=='add'){
        api.plan.TaskLibrary.create(data).then(function (r) {
          $state.go('app.plan.task.list');
        });

      }else{

        api.plan.TaskLibrary.update(data).then(function (r) {
          //$state.go('app.plan.task.list');
          if(r.status == 200){
            utils.alert('保存成功！');
          }
        });
      }

    }
  }
})(angular,undefined);
