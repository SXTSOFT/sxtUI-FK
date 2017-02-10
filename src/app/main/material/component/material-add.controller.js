/**
 * Created by 陆科桦 on 2016/10/16.
 */

(function (angular, undefined) {
  'use strict';
  angular
    .module('app.material')
    .component('materialAdd', {
      templateUrl: 'app/main/material/component/material-add.html',
      controller: materialAdd,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function materialAdd($scope,api, utils, $stateParams, $state) {
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.cid = $stateParams.cid;
    vm.pageState = vm.cid!=0 ? true : false;
    vm.readonly = false;

    api.material.type.getList({Skip: 0, Limit: 999}).then(function (g) {
      vm.materialType = g.data.Items || [];
    });

    if (vm.data.Id) {
      api.material.materialScience.getMaterial(vm.data.Id).then(function (r) {
        vm.data = r.data;
        if (vm.cid != 0){
          api.material.contract.GetContractDetailById(vm.cid,vm.data.Id).then(function (r) {
            if(r.data){
              vm.Brands = r.data.Brands.split('、');
            }else {
              vm.Brands =vm.data.Brands.split('、');
            }
          });
        }
      })
    }

    vm.save = function () {

      if (vm.cid != 0){
        var _str = vm.Brands.join("、");
        var _data = {'ContractId':vm.cid,'MaterialId':vm.data.Id,'Brands':_str};
        api.material.contract.UpdateContract(_data).then(function () {
          utils.alert("提交成功", null, function () {
            $state.go("app.material.materialLibrary",{cid:vm.cid});
          });
        })
      } else {
        if (vm.data.Id) {
          api.material.materialScience.putMaterial(vm.data).then(function () {
            utils.alert("提交成功", null, function () {
              $state.go("app.material.materialLibrary");
            });
          })
        } else {
          api.material.materialScience.Create(vm.data).then(function () {
            utils.alert("提交成功", null, function () {
              $state.go("app.material.materialLibrary");
            });
          })
        }
      }
    }
  }
})(angular, undefined);
