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
  function planTask($scope,api,$state,utils,$interval,$mdDialog){
    var vm = this;
    vm.selectedFilter = 0;
    $scope.$watch("vm.selectedFilter",function(){
      Load();
    });
    $scope.$watch("vm.selectedMoban",function(){
      Load();
    });
    vm.Query = function (item) {
      if(vm.selectedFilter == 0 ){
        $state.go("app.plan.task.detailLevel",{id:item.TaskLibraryId});
      }else{
        $state.go("app.plan.task.detail",{id:item.TaskLibraryId});
      }
    }

    vm.Delete = function(item){
      //$mdDialog.show(
      //  $mdDialog.prompt()
      //    .title('输入')
      //    .textContent('shu')
      //    .placeholder('a')
      //    .ok('ok')
      //    //.parent(angular.element('#content'))
      //).then(function(r){
      //  alert(r)
      //})
      utils.confirm('是否确认删除任务？').then(function (r) {
        api.plan.TaskLibrary.delete(item.TaskLibraryId).then(function (r) {
          Load();
        });
      });
    }
    api.plan.TaskTemplates.GetList({Skip:0,Limit:0}).then(function (r) {
      vm.tempDatas=r.data.Items||[];
    });
    function Load() {
       api.plan.TaskLibrary.GetList({Skip:0,Limit:10000,Level:vm.selectedFilter,TemplateId:vm.selectedMoban}).then(function (r) {
         vm.items = r.data.Items||[];
       });

    }

  }
})(angular,undefined);
