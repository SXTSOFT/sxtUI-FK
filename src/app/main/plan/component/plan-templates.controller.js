/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTemplates',{
      templateUrl:'app/main/plan/component/plan-templates.html',
      controller:planTemplates,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planTemplates($scope,api,$state,utils){
    var vm = this;
    vm.total=0;
    $scope.pageing={
      page:1,
      pageSize:10
    }

    vm.pageAction = function(title, page, pageSize, total){
      $scope.pageing.page = page;
    }

    $scope.$watch("pageing",function(){
      Load();
    },true);

    vm.Query = function (item) {
      console.log(item)
      $state.go("app.plan.template.detail",{id:item.Id,taskLibraryId:item.RootTaskLibraryId});

    }

    vm.Delete = function(item){
      utils.confirm('是否确认删除模板？').then(function (r) {
        api.plan.TaskTemplates.delete(item.Id).then(function (r) {
          Load();
        });
      });

    }
    vm.copyTemp = function(item){
      console.log(item)
      utils.confirm('赋值模板？').then(function(){
        api.plan.TaskTemplates.copyTemplate(item.Id).then(function(r){
          utils.alert('复制成功').then(function(){
            Load();
          })
        },function(err){
          utils.alert(err.data||'复制失败');
        })
      })
    }
    function Load() {
      var page=utils.getPage($scope.pageing);

      api.plan.TaskTemplates.GetList({Skip:page.Skip,Limit:page.Limit}).then(function (r) {
        vm.items=r.data.Items||[];
        vm.total = r.data.TotalCount;
      });

    }
  }
})(angular,undefined);
