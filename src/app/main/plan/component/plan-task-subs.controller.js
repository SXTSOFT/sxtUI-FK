/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTaskSubs',{
      templateUrl:'app/main/plan/component/plan-task-subs.html',
      controller:planTaskSubs,
      controllerAs:'vm',
      bindings:{
        flow:'<',
        onSelect:'&'
      }
    });

  /** @ngInject */
  function planTaskSubs($scope,api,$state,utils){
    var vm = this;
    vm.selectedFilter = 1;

    vm.Delete = function(item){
      utils.confirm('是否确认删除任务？').then(function (r) {
        api.plan.TaskLibrary.delete(item.TaskLibraryId).then(function (r) {
          Load();
        });
      });
    }

    $scope.$watch("vm.selectedFilter",function(){
      Load();
    });

    function Load() {
       api.plan.TaskLibrary.GetList({Skip:0,Limit:10000,Level:vm.selectedFilter}).then(function (r) {
         vm.items = r.data.Items||[];
       });
    }

  }
})(angular,undefined);
