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
  function planTask($scope,api,$state,utils){
    var vm = this;
    $scope.pageing={
      page:1,
      pageSize:10,
      total:0
    }

    vm.pageAction = function(title, page, pageSize, total){
      $scope.pageing.page = page;
    }

    $scope.$watch("vm.pageing",function(){
      Load();
    },true);

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
     var page= utils.getPage($scope.pageing);
       api.plan.TaskLibrary.GetList({Skip:page.Skip,Limit:page.Limit}).then(function (r) {
         vm.items = r.data.Items||[];
         $scope.pageing.total = r.data.TotalCount;
       });
    }

  }
})(angular,undefined);
