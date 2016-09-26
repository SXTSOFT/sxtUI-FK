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
  function planTemplates($scope,api,$state){
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
      //todo:模板点击查询
      $state.go("app.plan.template.detail",{id:item.Id});

    }

    vm.Delete = function(item){
      //todo:模板点击删除
    }

    function Load() {
      var page=api.plan.GetPage($scope.pageing);

      api.plan.TaskTemplates.GetList({Skip:page.Skip,Limit:page.Limit}).then(function (r) {
        vm.items=r.data.Items||[];
        $scope.pageing.total = r.data.TotalCount;
      });
    }
  }
})(angular,undefined);
