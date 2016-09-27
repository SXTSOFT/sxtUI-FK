/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTask',{
      templateUrl:'app/main/plan/component/plan-task.html',
      controller:planTask,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planTask(template,$mdSidenav,$stateParams,api,$state,$mdDialog){
    var vm = this,
      temp,task,
      id = $state.params["id"];

/*    if(id!='add'){
      api.plan.TaskLibrary.getItem(id).then(function (r) {
        vm.data = r.data;
      })
    }*/
    //保存任务左边的基础信息
    vm.ClickSaveleft = function(data){
      if(id=='add'){
        api.plan.TaskLibrary.create(data).then(function (r) {
          $state.go('app.plan.task.list');
        });

      }else{
        api.plan.TaskLibrary.update(data).then(function (r) {
          //$state.go('app.plan.task.list');
        });
      }

    }

    vm.isNew = $stateParams.id=='add';

    vm.createTask = function(){
      if(vm.isNew) {
        api.plan.TaskLibrary.create(vm.data).then(function (r) {
          $state.go('app.plan.task.detail',{id: r.data.TaskLibraryId});
        });
      }
      else{
        api.plan.TaskLibrary.update(vm.data.TaskLibraryId,vm.data).then(function () {

        })
      }
    }

    if(!vm.isNew){
      api.plan.TaskLibrary.getTaskFlow($stateParams.id).then(function (r) {
        task = vm.data = r.data;
      })
    }
    else{
      task = vm.data = {
        Level:0
      }
    }

    vm.toggleRight = function () {
      return $mdSidenav('right')
        .open();
    }
    vm.closeRight = function () {
      return $mdSidenav('right')
        .close();
    }
    vm.onLoadTemplate = function () {
      if(temp)return;
      if(!task) {
        task = {
          taskId: 0,
          Name: vm.data&&vm.data.name||'楼栋模板',
          Master: [],
          Branch: []
        }
      }

      temp = new template({
        onClick:function (e) {
          vm.current = e.data;
          vm.toggleRight();
        }
      });
      temp.load(task);
      if(task.Master.length===0) {
        vm.toggleRight();
      }
    }

    vm.save = function () {
      api.plan.TaskLibrary.update(vm.current).then(function () {
        temp && temp.edit(vm.current);
        vm.closeRight();
      })
    }
    vm.nextSave = function () {
      var next = angular.extend({
        TaskLibraryId:task.TaskLibraryId,
        IsFloor:false,
        Type:vm.current?vm.current.line:0,
        ParentId:vm.current?vm.current.TaskFlowId:0
      },vm.next);
      vm.next = {};
      api.plan.TaskFlow.post(
        next
      ).then(function (r) {
        next.TaskFlowId = r.data.TaskFlowId;
        next.TaskLibraryId = task.TaskLibraryId;
        //next.categoryId = new Date().getTime();
        temp && temp.add(next,vm.current);
        vm.closeRight();
      });

    }
    vm.nextBranch = function () {
      var next = angular.extend({
        TaskLibraryId:task.TaskLibraryId,
        IsFloor:false,
        Type:vm.current?vm.current.line+1:0,
        ParentId:vm.current?vm.current.TaskFlowId:0
      },vm.branch);
      vm.branch = {};
      api.plan.TaskFlow.post(
        next
      ).then(function (r) {
        next.TaskFlowId = r.data.TaskFlowId;
        next.TaskLibraryId = task.TaskLibraryId;
        //next.categoryId = new Date().getTime();
        temp && temp.add(next,vm.current,true);
        vm.closeRight();
      });

    }
    vm.remove = function () {
      api.plan.TaskFlow.deleteFlow(vm.current.TaskFlowId).then(function () {
        temp && temp.remove(vm.current);
        vm.closeRight();
        //$state.go('app.plan.task.list');
      })
    }

    vm.getNextTasks = function () {
      api.plan.TaskLibrary.GetList({
        Level:task.Level+1
      }).then(function (r) {
        vm.nextTasks = r.data.Items;
      })
    }
    vm.addSubTask = function (ev) {
      $mdDialog.show({
        controller: ['api','$scope',function (api,$scope) {

        }],
        templateUrl: 'app/main/plan/component/plan-task-mini.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false,
        locals:{
          parentTask:task
        }
      })
        .then(function (newTask) {

        }, function () {

        });
    }
    vm.saveSubTask = function () {
      var data = {
        TaskFlowId:vm.current.TaskFlowId,
        TaskLibraryId:[

        ]
      }
      vm.saveTasks && vm.saveTasks.forEach(function (tid) {
        data.TaskLibraryId.push(tid);
      })


      console.log('vm.saveTasks',vm.saveTasks)
    }
    vm.getUseGroups = function () {
      api.plan.UserGroup.query().then(function (r) {
        vm.nextUserGroups = r.data.Items;
      })
    }
    vm.addRole = function (ev) {
        var confirm = $mdDialog.prompt()
          .title('添加新的角色')
          .textContent('请输入角色名字')
          .placeholder('角色名字')
          .ariaLabel('角色名字')
          .initialValue('')
          .ok('添加')
          .cancel('取消');
        $mdDialog.show(confirm).then(function(result) {
          api.plan.UserGroup.create({
            "GroupName": result,
            "SystemID": "plan",
            "Description": result
          })
        }, function() {

        });
    }
    vm.saveUserGroup = function (type) {
      var datas = vm['saveNotice'+type];
      if(datas && datas.length){

      }
    }
  }
})(angular,undefined);
