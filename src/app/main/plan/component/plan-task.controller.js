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
  function planTask(template,$mdSidenav,$stateParams,api,$state){
    var vm = this,
      temp,task,
      id = $state.params["id"];

    if(id!='add'){
      api.plan.TaskLibrary.getItem(id).then(function (r) {
        vm.data = r.data;
      })
    }
    //保存任务左边的基础信息
    vm.ClickSaveleft = function(data){

      if(id=='add'){
        api.plan.TaskLibrary.Create(data).then(function (r) {
          $state.go('app.plan.task.list');
        });

      }else{
        api.plan.TaskLibrary.update(data).then(function (r) {
          $state.go('app.plan.task.list');
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
     /* var task = {
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
      if(!task) {
        task = {
          taskId: 0,
          name: vm.data&&vm.data.name||'楼栋模板',
          master: [],
          branch: []
        }
      }

      temp = new template({
        onClick:function (e) {
          vm.current = e.data;
          vm.toggleRight();
        }
      });
      temp.load(task);
      vm.toggleRight();
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
      temp && temp.remove(vm.current);
      vm.closeRight();
    }

  }
})(angular,undefined);
