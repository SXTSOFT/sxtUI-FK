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
      id = $state.params["id"],
      templateId=$state.params['templateId'];

    vm.isNew = $stateParams.id=='add';
    api.plan.TaskTemplates.GetList({Skip:0,Limit:0}).then(function (r) {
      vm.tempDatas=r.data.Items||[];
    });
    if(!vm.isNew){
      vm.loading= true;
      //loadData();
      api.plan.TaskLibrary.getTaskFlow($stateParams.id).then(function (r) {
        task = vm.data = r.data;
        vm.data._CloseRelatedObjectType = vm.data.CloseRelatedObjectType;
        vm.data.CloseRelatedObjectType&&vm.data.CloseRelatedObjectType==0?vm.data.CloseRelatedObjectType ='PQMeasure':vm.data.CloseRelatedObjectType='Inspection';
        task.oType = task.Type;
        vm.data._DurationType = vm.data.DurationType;
        vm.data.DurationType == 0?vm.data.DurationType ='FixedDuration':vm.data.DurationType= 'VariableDuration';
        vm.loading= false;
        task.Master = [{
          root:true,
          TaskFlowId:id,
          Name:task.Name
        }].concat(task.Master);

        task.Master.forEach(function (flow) {
          if(flow.ParentId===0)
            flow.ParentId=id;
          if(flow.Description)
            angular.extend(flow,angular.fromJson(flow.Description));
          //单项任务名改变时取值
          if(flow.OptionalTask){
            if(!(/^\d+$/.test(flow.OptionalTask.substr(0,1)))){
              flow.OptionalTask =  flow.OptionalTasks.length&&flow.OptionalTasks[0].Name;
            }else{
              if(flow.OptionalTasks.length !=flow.OptionalTask.substr(0,1)){
                flow.OptionalTask = flow.OptionalTasks.length==1?flow.OptionalTasks[0].Name:flow.OptionalTasks.length+'任务';
              }
            }
          }
          flow.oMilestone=flow.Milestone;
          flow.oName=flow.Name;
          flow.oReservedEndDays = flow.ReservedEndDays;
          flow.oDuration = flow.Duration;
          flow.oNotice7 = flow.Notice7;
          flow.oNotice8 = flow.Notice8;
          flow.oMeasureInfo = flow.MeasureInfo;
          flow.oExpression = flow.Expression;
          flow.oisChuancha = flow.isChuancha;
          flow.oMeasureId = flow.MeasureId;
          flow.oManuallyClose=flow.ManuallyClose;
        });
        task.Branch.forEach(function (b) {
          b.forEach(function (flow) {
            if(flow.ParentId===0)
              flow.ParentId=id;
            if(flow.Description)
              angular.extend(flow,angular.fromJson(flow.Description));
            if(flow.OptionalTask){
              if(!(/^\d+$/.test(flow.OptionalTask.substr(0,1)))){
                flow.OptionalTask = flow.OptionalTasks.length&&flow.OptionalTasks[0].Name;
              }else{
               if(flow.OptionalTasks.length !=flow.OptionalTask.substr(0,1)){
                 flow.OptionalTask = flow.OptionalTasks.length==1?flow.OptionalTasks[0].Name:flow.OptionalTasks.length+'任务';
               }
              }
            }
            flow.oMilestone=flow.Milestone;
            flow.oName=flow.Name;
            flow.oReservedEndDays = flow.ReservedEndDays;
            flow.oDuration = flow.Duration;
            flow.oNotice7 = flow.Notice7;
            flow.oNotice8 = flow.Notice8;
            flow.oMeasureInfo = flow.MeasureInfo;
            flow.oExpression = flow.Expression;
            flow.oisChuancha = flow.isChuancha;
            flow.oMeasureId = flow.MeasureId;
            flow.oManuallyClose=flow.ManuallyClose;
          })
        });
        vm.onLoadTemplate();
      })
    }
    else{
      task = vm.data = {
        Level:1,
        DurationType: 'FixedDuration'
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
      if(temp.task.Master.length===1)
        isBranch =false;

      return $mdDialog.show(confirm).then(function(result) {
        var next = {
          TaskLibraryId: id,
          IsFloor: false,
          Type: isBranch ? temp.task.Branch.length+1 : flow ? flow.line : 0,
          ParentId: flow && flow.TaskFlowId!=id ? flow.TaskFlowId : 0,
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
    api.plan.TaskLibrary.GetList({Skip:0,Limit:10000,Level:1,TemplateId:templateId}).then(function (r) {
      vm.subTasks = r.data.Items||[];
    });
    vm.addBranch = function(ev,flow,isBranch){
      $mdDialog.show({
        templateUrl:'app/main/plan/component/plan-branch.html',
        controller:['$scope','items',function($scope,items){
          var vm = this;
          if(items){
            vm.subTasks = items;
          }else{
              console.log('t',templateId)
            api.plan.TaskLibrary.GetList({Skip:0,Limit:10000,Level:1,TemplateId:templateId}).then(function (r) {
              vm.subTasks = r.data.Items||[];
            });
          }
          vm.stop = function(ev){
            ev.stopPropagation();
          }
          vm.select = function(){
            $mdDialog.hide(vm.relatedTask)
          }
        }],
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        controllerAs:'vm',
        locals:{
          items:vm.subTasks && vm.subTasks
        }
      }).then(function(res){
        var next = {
          TaskLibraryId: id,
          IsFloor: false,
          Type: isBranch ? temp.task.Branch.length+1 : flow ? flow.line : 0,
          ParentId: flow ? flow.TaskFlowId : 0,
          Name: res.Name,
          Description:angular.toJson({
            isChuancha:true
          })
        };
        return api.plan.TaskFlow.post(
          next
        ).then(function (r) {
          next.TaskFlowId = r.data.TaskFlowId;
          if(vm.data.Level==1) {
            return api.plan.TaskFlow.resetTaskFlow(next.TaskFlowId, [{
              TaskFlowId: next.TaskFlowId,
              TaskLibraryId: res.TaskLibraryId
            }]);
          }
        }).then(function () {
          vm.flows = temp.add(next,flow,isBranch);
          vm.flows.forEach(function(flow){
            if(flow.Description)
              angular.extend(flow,angular.fromJson(flow.Description));
          })
          //console.log(next,vm.flows)
        });
      })
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
        IsMustComplete:flow.IsMustComplete,
        Description:angular.toJson({
          ReservedEndDays:flow.ReservedEndDays,
          Duration: flow.Duration,
          Milestone:flow.Milestone,
          OptionalTask:flow.OptionalTask,
          Notices:flow.Notices,
          CarryOut:flow.CarryOut,
          Notice7: flow.Notice7,
          Notice8: flow.Notice8,
          MeasureInfo:flow.MeasureInfo,
          isChuancha:flow.isChuancha,
          MeasureId : flow.MeasureId,
          ManuallyClose:flow.ManuallyClose,
        })
      }).then(function () {

      })
    }
    vm.updateMust = function(flow){
      return vm.updateFlow(flow);
    }
    vm.updateManuallyClose = function(flow){
      //if(flow.oManuallyClose != flow.ManuallyClose){
        flow.oManuallyClose = flow.ManuallyClose;
        return api.plan.TaskFlow.getSubTasks(flow.TaskFlowId).then(function (r) {
          var taskLib = r.data.Items[0];
          taskLib.Id = taskLib.TaskLibraryId;
          taskLib.ManuallyClose = flow.ManuallyClose;
          taskLib._taskFlowId = taskLib.TaskLibraryId;
          return api.plan.TaskLibrary.update(taskLib).then(function () {
            return vm.updateFlow(flow);
          },function(err){
            utils.alert(err.data||'更新手工关闭数据失败!')
          })
        },function(err){
          utils.alert(err.data||'更新手工关闭数据失败!')
        });
      //}

    }
    vm.updateDuration = function (flow) {
      if(flow.oDuration != flow.Duration){
        flow.oDuration = flow.Duration;
        return api.plan.TaskFlow.getSubTasks(flow.TaskFlowId).then(function (r) {
          var taskLib = r.data.Items[0];
          taskLib.Id = taskLib.TaskLibraryId;
          taskLib._taskFlowId = taskLib.TaskLibraryId;
          taskLib.Duration = flow.Duration;
          return api.plan.TaskLibrary.update(taskLib).then(function () {
            return vm.updateFlow(flow);
          },function(err){
            utils.alert(err.data||'更新工期数据失败!')
          })
        },function(err){
          utils.alert(err.data||'更新工期数据失败!')
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
        }
      });
      vm.flows = temp.load(task);
      //setVerify(vm.flows)
    }
    function setVerify(items){
      items.forEach(function(r){
        if(r.Name.indexOf('验') !=-1){
          r.choose = true;
        }
      })
    }
    vm.setBack = function(flow){
      var f = vm.flows.indexOf(flow);
      if(f!=-1){
        vm.flows.forEach(function(r,index){
          if(index>f){
            r.showBack = true;
          }else{
            r.showBack = false;
          }
        })
      }
    }
    vm.selectOptionalTask =function (flow) {
      return $mdDialog.show({
        controller: ['$mdDialog','$scope', function ($mdDialog) {
          var vm = this;
          vm.flow = flow;
          vm.data = {};
          vm.selectedCategory = flow.Name;
          vm.categories = [{
            name:flow.Name
          }];
          var promises = [
            api.plan.TaskLibrary.GetList({Skip: 0, Limit: 10000, Level: task.Level+1}),
            api.plan.TaskFlow.getSubTasks(flow.TaskFlowId)
          ];
          $q.all(promises).then(function(res){
            vm.items = res[0].data.Items;
            vm.items.forEach(function(r){
              var f = res[1].data.Items&&res[1].data.Items.find(function(_r){
                  return _r.TaskLibraryId == r.TaskLibraryId;
                });
              if(r.Type)
                r.Type = '其它';
              var tags = r.Type&&r.Type.split('>');
              tags&&tags.reduce(function (prev,current) {
                var fd = prev.find(function (t) {
                  return t.name == current;
                });
                if(!fd){
                  fd = {
                    name:current,
                    children:[]
                  }
                  prev.push(fd);
                }
                return fd.children;
              },vm.categories);
              if(f){
                r.Type = flow.Name;
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
          vm.add = function(){
            api.plan.UserGroup.create({
              "GroupName": vm.dataName,
              "SystemID": "plan",
              "Description": vm.dataName
            }).then(function(res){
              vm.current = 'default';
              api.plan.UserGroup.query().then(function(r){
                if(vm.nextUserGroups){
                  r.data.Items.forEach(function (item) {
                    item.selected = !!vm.nextUserGroups.find(function (it) {
                      return it.GroupID == item.GroupID && it.selected;
                    })
                  });
                }
                r.data.Items.forEach(function(r){
                  var newItem = !vm.nextUserGroups.find(function(_r){
                    return _r.GroupID == r.GroupID;
                  })
                  if(newItem){
                    r.selected = true;
                  }
                })
                vm.nextUserGroups = r.data.Items;
              });
            })
          }
          vm.select = function () {
            $mdDialog.hide(vm.nextUserGroups.filter(function (t) {
              return t.selected;
            }));
          }
          $q.all([
            api.plan.UserGroup.ForPlans(),
            api.plan.TaskFlow.getRoleByFlowId(item.TaskFlowId)
          ]).then(function(res){
            vm.nextUserGroups = res[0].data;
            var users = res[1].data.Items;
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
    //  vm.nextUserGroup = r.data.Items;
    //})
    vm.stop = function(ev){
      ev.stopPropagation();
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

    //vm.selectSpecialtyLow=function(item,parent){
    //  parent.WPAcceptanceList=item.WPAcceptanceList;
    //}
    vm.setMeasureInfo = function(flow){
      vm.loadMeasure = false;
       $mdDialog.show({
        controller:['$scope','data','items',function($scope,data,items){
          var vm = this;
          vm.data = data;
          vm.current = null;
          vm.gxName = '';
          api.plan.TaskFlow.getSubTasks(flow.TaskFlowId).then(function(r){
            vm.sendData = r.data.Items[0];
            vm.sendData._taskFlowId =r.data.Items[0].TaskLibraryId;
          })
          if(items){
            vm.loadMeasure = true;
            vm.proceduresData = items;
            var g = vm.proceduresData.find(function(_p){
              return _p.AcceptanceItemID ==  flow.MeasureId;
            })
              if(g){
                vm.current = g;
                vm.gxName = flow.MeasureInfo;
              }
            if(!vm.current){
                //vm.sendData.CloseRelatedObjectId = null;
                flow.MeasureInfo = null;
                flow.MeasureId = null;
            }
          }
          vm.clrChoose = function(){
            vm.current = null;
            vm.gxName = '';
            vm.sendData.CloseRelatedObjectId = null;
          }
          vm.stop = function(ev){
            ev.stopPropagation();
          }
          vm.choose = function(item){
            vm.current = item;
            vm.sendData.CloseRelatedObjectId = item.AcceptanceItemID;
            vm.gxName = item.AcceptanceItemName;
          }
          vm.select = function(){
            vm.sendData.CloseRelatedObjectType = 'Inspection';
            if(vm.current){
              flow.MeasureInfo = vm.current.AcceptanceItemName;
              flow.MeasureId = vm.current.AcceptanceItemID;
            }else{
              flow.MeasureInfo = null;
              flow.MeasureId = null;
            }
            $mdDialog.hide(vm.sendData);
          }
        }],
        controllerAs:'vm',
        template:'<md-dialog>\
  <md-toolbar class="md-hue-2">\
    <div class="md-toolbar-tools tasks-list">\
      <h2><span>关联项选择</span></h2>\
      <span flex></span></div></md-toolbar>\
  <md-dialog-content  style="padding: 0;width:400px;">\
    <div ng-if="!vm.loadMeasure">loading...</div>\
    <div>\
      <md-tabs md-dynamic-height ng-if="vm.loadMeasure">\
        <md-tab label="关联工序">\
          <md-content layout="column" style="background-color: rgb(245,245,245)" flex class="p-15">\
            <md-input-container md-no-float>\
              <input type="text" ng-model="vm.searchT" placeholder="搜索工序">\
            </md-input-container>\
            <div layout="row" class="mb-10">\
              <span>已选工序</span><span flex></span><md-icon md-font-icon="icon-close" ng-click="vm.clrChoose()" ng-if="vm.gxName"></md-icon>\
            </div>\
            <div layout="row" style="color:#999;">{{vm.gxName}}</div>\
            <div>\
              <md-list flex ng-if="vm.proceduresData.length" class="ph-16"><md-list-item ng-class="{\'gxselected\':vm.current ==ac}" layout="row" flex ng-repeat="ac in vm.proceduresData|filter:vm.searchT" ng-click="vm.choose(ac)">\
                  <div flex style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ac.AcceptanceItemName}}</div>\
                </md-list-item>\
              </md-list>\
            </div>\
          </md-content>\
        </md-tab>\
      </md-tabs>\
    </div>\
  </md-dialog-content>\
  <md-dialog-actions layout="row">\
    <md-button ng-click="vm.select(selectedIndex)" class="md-raised"> 确定\
    </md-button>\
  </md-dialog-actions>\
</md-dialog>'
        ,
        // templateUrl:'app/main/plan/component/plan-task-measureinfo.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        locals:{
          data:vm.data && vm.data,
          items:vm.procedures
        }
      }).then(function(data){
        api.plan.TaskLibrary.update(data).then(function (r) {
          return vm.updateFlow(flow);
        });
      })
    }
    vm.ClickSaveleft = function(data){
      data._taskFlowId=data._taskFlowId||data.TaskLibraryId;
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
