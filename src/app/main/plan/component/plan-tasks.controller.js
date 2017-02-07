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
    vm.selectedFilter = 1;
//      vm.currentSelect={
//          selectedFilter:1,
//          selectedMoban:''
//      }
//    $scope.$watch("vm.selectedFilter",function(){
//      Load();
//    });
    $scope.$watch("vm.selectedMoban",function(){
        if(vm.selectedMoban){
            vm.loading = false;
            Load();
        }

    },true);
    vm.Query = function (item) {
      if(vm.selectedFilter == 0 ){
        $state.go("app.plan.task.detailLevel",{id:item.TaskLibraryId});
      }else{
        $state.go("app.plan.task.detail",{id:item.TaskLibraryId,templateId:vm.selectedMoban});
      }
    }
    vm.copyTaskLib = function(item){
      //console.log(item)
      utils.confirm('复制模板？').then(function(){
        api.plan.TaskLibrary.copyTaskLibrary(item.TaskLibraryId).then(function(r){
          utils.alert('复制成功').then(function(){
            Load();
          })
        },function(err){
          utils.alert(err.data||'复制失败');
        })
      })
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
      vm.selectedMoban = vm.tempDatas[0].Id;
    });
      vm.loading = false;
     // Load()
    function Load() {
       api.plan.TaskLibrary.GetList({Skip:0,Limit:10000,Level:1,TemplateId:vm.selectedMoban}).then(function (r) {
         vm.items = r.data.Items||[];
           vm.loading =true;
           console.log('vm.loading',vm.loading)
       });

    }

  }
})(angular,undefined);
