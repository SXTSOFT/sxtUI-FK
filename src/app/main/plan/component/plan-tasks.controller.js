/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTasks',{
      templateUrl:'app/main/plan/component/plan-tasks.html',
      controller:planTask,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planTask($scope,api,$state,utils,$interval){
    var vm = this;
    vm.selectedFilter = 0;
    $scope.$watch("vm.selectedFilter",function(){
      Load();
    });
    vm.Query = function (item) {
      $state.go("app.plan.task.detail",{id:item.TaskLibraryId});
    }

    vm.Delete = function(item){
      utils.confirm('是否确认删除任务？').then(function (r) {
        api.plan.TaskLibrary.delete(item.TaskLibraryId).then(function (r) {
          Load();
        });
      });
    }

    function Load() {
       api.plan.TaskLibrary.GetList({Skip:0,Limit:10000,Level:vm.selectedFilter}).then(function (r) {
         vm.items = r.data.Items||[];
       });
    }

  }
})(angular,undefined);
