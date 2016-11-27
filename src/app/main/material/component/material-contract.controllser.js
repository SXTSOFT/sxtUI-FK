/**
 * Created by lukehua on 2016/11/15.
 */

(function(angular,undefined){
  'use strict';
  angular
    .module('app.material')
    .component('materialContract',{
      templateUrl:'app/main/material/component/material-contract.html',
      controller:materialContract,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialContract($scope,api,utils,$q,$stateParams,$state,$element){
    var vm = this;
    vm.projects = [];
    vm.data = {};
    vm.data.Id = $stateParams.id;

    $q.all([
      api.material.contract.getSysOrgOU(),
      api.material.type.getList({Skip: 0, Limit: 100}),
      //api.material.materialScience.getList({Skip: 0, Limit: 100})
    ]).then(function (r) {
      vm.Partners = r[0].data;
      vm.materialClass = r[1].data.Items;
    });

    if(vm.data.Id){
      api.material.contract.getById(vm.data.Id).then(function (r) {
        vm.data = r.data;
      })
    }

    vm.searchTerm;
    vm.clearSearchTerm = function() {
      vm.searchTerm = '';
    };

    $element.find('input').on('keydown', function(ev) {
      ev.stopPropagation();
    });

    vm.save = function () {
      if ($scope.myForm.$valid) {
        if(vm.data.Id){
          api.material.contract.update(vm.data).then(function () {
            utils.alert("提交成功", null, function () {
              $state.go("app.material.contracts");
            });
          });
        }else{
          api.material.contract.create(vm.data).then(function () {
            utils.alert("提交成功",null,function(){
              $state.go("app.material.contracts");
            });
          });
        }
      }
    }
  }

})(angular,undefined);
