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
    })

  /** @ngInject */
  function materialContract($scope,api,utils,$q,$stateParams,$state,$element,sxt){
    var vm = this;
    vm.projects = [];
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.pageState = $stateParams.pageState;
    // vm.data.ContractRelations = [];
    vm.MaterialIds = [];

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
        vm.MaterialIds = vm.data.MaterialTypeId.split(',');
        // vm.data.ContractRelations.forEach(function (r) {
        //   vm.MaterialIds.push(r.MaterialId);
        // });
      });
    }

    vm.fruitNames =[ 'aaa','bb'];

    vm.searchTerm;
    vm.clearSearchTerm = function() {
      vm.searchTerm = '';
    };

    $element.find('input').on('keydown', function(ev) {
      ev.stopPropagation();
    });

    vm.save = function () {
      if ($scope.myForm.$valid) {
        vm.data.MaterialTypeId =JSON.stringify(vm.MaterialIds).replace('[','').replace(']','');
        // if(vm.MaterialIds && vm.MaterialIds.length>0){
        //   if (vm.data.ContractRelations.length > 0) {
        //     var arrs = [];
        //     vm.MaterialIds.forEach(function (r) {
        //       var flag = false;
        //       vm.data.ContractRelations.forEach(function (q){
        //         if (r == q.MaterialId) {
        //           arrs.push(q);
        //           flag=true;
        //           return;
        //         }
        //       });
        //       if (!flag){
        //         arrs.push({'Id':0,'MaterialId':r});
        //       }
        //     });
        //     vm.data.ContractRelations = arrs;
        //   } else {
        //     vm.data.ContractRelations = [];
        //     vm.MaterialIds.forEach(function (r) {
        //       vm.data.ContractRelations.push({'MaterialId':r});
        //     });
        //     console.log(vm.data.ContractRelations)
        //   }
        // }

        if (vm.data.Id) {
          api.material.contract.update(vm.data).then(function () {
            utils.alert("提交成功", null, function () {
              if (vm.pageState==1){
                $state.go("app.material.materialLibrary",{'cid':vm.data.Id});
              }else {
                $state.go("app.material.contracts");
              }
            });
          });
        } else {
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
