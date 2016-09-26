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
  function planBc($scope,api){
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
      var page=api.plan.GetPage($scope.pageing);

      api.plan.compensate.getList({Skip:page.Skip,Limit:page.Limit}).then(function (r) {
        vm.data=r.data.Items||[];
        $scope.pageing.total = r.data.TotalCount;
      });
    }

    vm.delete = function(id){
      if (window.confirm('确认删除此工序类型信息？')) {
        api.plan.compensate.delete(id);
        Load();
      }
    }
  }
})(angular,undefined);
