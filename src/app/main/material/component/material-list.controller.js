/**
 * Created by 陆科桦 on 2016/10/14.
 */

(function(angular,undefined){
  'use strict';
  angular
    .module('app.material')
    .component('materialList',{
      templateUrl:'app/main/material/component/material-list.html',
      controller:material,
      controllerAs:'vm'
  });
  /** @ngInject */
  function material($scope,api,utils){
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

      api.material.materialScience.getList({Skip:page.Skip,Limit:page.Limit}).then(function (r) {
        vm.data = r.data.Items||[];
        vm.total = r.data.TotalCount;
      });
    }

    vm.delete = function(id){
      utils.confirm('确认删除此材料信息').then(function () {
        api.material.materialScience.delete(id).then(function () {
          Load();
        })
      });
    }
  }
})(angular,undefined);
