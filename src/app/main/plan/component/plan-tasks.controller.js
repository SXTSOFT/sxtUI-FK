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
    vm.total = 0;

    $scope.pageing={
      page:1,
      pageSize:10,
      filterParam:{
        level:0
      }
    }

    vm.pageAction = function(title, page, pageSize, total){
      $scope.pageing.page = page;
    }

    $scope.$watch("pageing",function(){
      Load();
    },true);
    $scope.$watch("vm.selectedFilter",function(){
      if(vm.selectedFilter){
        $scope.pageing.filterParam.level = vm.selectedFilter;
        //Load();
      }
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
     var page= utils.getPage($scope.pageing);
      var postParams=angular.extend({Skip:page.Skip,Limit:page.Limit},$scope.pageing.filterParam);
       api.plan.TaskLibrary.GetList(postParams).then(function (r) {
         vm.items = r.data.Items||[];
         vm.total = r.data.TotalCount;
       });
    }

  }
})(angular,undefined);
