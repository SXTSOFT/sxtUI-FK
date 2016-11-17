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


    // vm.type = [
    //   {type1:'type1',children:[{type2:'type1_1',children:[{type3:'type1_1_1'},{type3:'type1_1_2'}]},{type2:'type1_2'},{type2:'type1_3'}]},
    //   {type1:'type2',children:[{type2:'type2_1'},{type2:'type2_2',children:[{type3:'type2_2_1'},{type3:'type2_2_2'}]},{type2:'type2_3'}]},
    //   {type1:'type3',children:[{type2:'type3_1'},{type2:'type3_2'},{type2:'type3_3',children:[{type3:'type3_3_1'},{type3:'type3_3_2'}]}]}
    // ];

    // vm.materialType = [
    //   {val:1,name:'土建'},
    //   {val:2,name:'基建'}
    // ];

    api.material.type.getList({Skip: 0, Limit: 999}).then(function (g) {
      vm.materialType = g.data.Items || [];
    });

    if (vm.data.Id) {
      api.material.materialScience.getMaterial(vm.data.Id).then(function (r) {
        vm.data = r.data;
      })
    }

    vm.save = function () {
      if ($scope.myForm.$valid) {
        if (vm.data.Id) {
          api.material.materialScience.putMaterial(vm.data).then(function () {
            utils.alert("提交成功", null, function () {
              $state.go("app.material.list");
            });
          })
        } else {
          api.material.materialScience.Create(vm.data).then(function () {
            utils.alert("提交成功", null, function () {
              $state.go("app.material.list");
            });
          })
        }
      }
    }
  }
})(angular, undefined);
