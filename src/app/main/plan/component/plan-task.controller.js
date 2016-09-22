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
  function planTask(template,$mdSidenav){
    var vm = this,
      temp;
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
      var task = {
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
          [{
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
            }],
          [{
            categoryId: 42,
            parentCategoryId: 31,
            endFlagCategoryId: 8,
            name: '前期准备验收2',
            tasks: []
          }]
        ]
      };
      temp = new template({
        onClick:function (e) {
          vm.current = e.data;
          vm.toggleRight();
        }
      });
      temp.load({
        taskId:1,
        name:'测试',
        master:[],
        branch:[]
      });
      vm.toggleRight();
    }

    vm.save = function () {
      temp && temp.edit(vm.current);
      vm.closeRight();
    }
    vm.nextSave = function () {
      var next = angular.extend({},vm.next);
      vm.next = {};
      next.categoryId = new Date().getTime();
      temp && temp.add(next,vm.current);
      vm.closeRight();
    }
    vm.nextBranch = function () {
      var next = angular.extend({},vm.branch);
      vm.branch = {};
      next.categoryId = new Date().getTime();
      temp && temp.add(next,vm.current,true);
      vm.closeRight();
    }
    vm.remove = function () {
      temp && temp.remove(vm.current);
      vm.closeRight();
    }

  }
})(angular,undefined);
