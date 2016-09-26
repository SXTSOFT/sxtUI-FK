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
  function planTemplates($scope,remote){
    var vm = this;
    $scope.pageing={
      page:1,
      pageSize:10,
      total:50
    }

    vm.pageAction = function(title, page, pageSize, total){
      $scope.pageing.page = page;
    }

    $scope.$watch("vm.pageing",function(){
      Load();
    },true);

    vm.Query = function (item) {
      //todo:模板点击查询
    }

    vm.Delete = function(item){
      //todo:模板点击删除
    }

    function Load() {
      vm.items =  remote.Plan.GetTaskTemplates({
        Curpage:$scope.pageing.page-1,
        PageSize:$scope.pageing.pageSize
      });
    }
  }
})(angular,undefined);
