/**
 * Created by HangQingFeng on 2016/10/14.
 */

(function(angular,undefined){
  'use strict';
  angular
    .module('app.material')
    .component('materialType',{
      templateUrl:'app/main/material/component/materialClass-list.html',
      controller:materialClass,
      controllerAs:'vm'
    });
  /** @ngInject */
  function materialClass($scope,api,utils){
    var vm = this;
    $scope.pageing={
      page:1,
      pageSize:10,
      total:0
    };

    vm.pageAction = function(title, page, pageSize, total){
      $scope.pageing.page = page;
    }

    $scope.$watch("pageing",function(){
      load();
    },true);

    // $scope.treeSetting = [{
    //   'id': 1,
    //   'title': 'AAAAA',
    //   'level': 0,
    //   'nodes': [],
    //   'isEnable': tmp,
    //   'regionType':2
    // }]

    function load(){
      var page= utils.getPage($scope.pageing);
      api.material.type.getList({Skip:page.Skip,Limit:page.Limit}).then(function(r){
        vm.data = r.data.Items;
        $scope.pageing.total = r.data.TotalCount;
      });
    }

   vm.delete =  function(id){
      utils.confirm('确认删除此材料分类').then(function () {
        api.material.type.delete(id).then(function () {
          load();
        })
      });
    }
  }
})(angular,undefined);

