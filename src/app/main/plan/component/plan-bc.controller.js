/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planBc',{
      templateUrl:'app/main/plan/component/plan-bc.html',
      controller:planBc,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planBc($scope,remote){
    var vm = this;
    $scope.pageing={
      page:1,
      pageSize:10,
      total:50
    }

    $scope.$watch("vm.pageing",function(){
      Load();
    },true);

    vm.Query = function (item) {
      //todo:模板点击查询
    }

    function Load() {
      vm.data =  remote.Plan.GetBcs({
        Curpage:$scope.pageing.page-1,
        PageSize:$scope.pageing.pageSize
      });
    }

    vm.delete = function(id){
      if (window.confirm('确认删除此工序类型信息？')) {
        remote.Plan.deleteBc(id);
      }
    }
  }
})(angular,undefined);
