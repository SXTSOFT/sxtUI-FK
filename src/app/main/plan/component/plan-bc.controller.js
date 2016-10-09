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
  function planBc($scope,api,utils){
    var vm = this;
    vm.total=0;
    $scope.pageing={
      page:1,
      pageSize:10
    };

    vm.pageAction = function(title, page, pageSize, total){
      $scope.pageing.page = page;
    };

    $scope.$watch("pageing",function(){
      Load();
    },true);

    function Load() {
      var page = utils.getPage($scope.pageing);

      api.plan.compensate.getList({Skip:page.Skip,Limit:page.Limit}).then(function (r) {
        vm.data = r.data.Items||[];
        vm.total = r.data.TotalCount;
        console.log(r.data,'------------')
      });
    }

    vm.delete = function(id){
      utils.confirm('确认删除此补偿信息').then(function () {
        api.plan.compensate.delete(id).then(function () {
          Load();
        })
      });
    }
  }
})(angular,undefined);
