/**
 * Created by Administrator on 2016/10/17.
 */
(function(angular,undefined) {
  'use strict';

  angular
    .module('app.material')
    .component('materialClassAdd', {
      templateUrl: 'app/main/material/component/material-classAdd.html',
      controller: materialClassAdd,
      controllerAs: 'vm'
    });

  function materialClassAdd($scope,api,utils,$state,$stateParams) {
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;

    if(vm.data.Id){
      api.material.type.getItem(vm.data.Id).then(function (r) {
        vm.data = r.data;
      })
    }

    vm.save = function () {
      if (vm.data.Id) {
        api.material.type.update(vm.data).then(function () {
          utils.alert("提交成功", null, function () {
            $state.go("app.material.type");
          });
        })
      } else {
        api.material.type.create(vm.data).then(function () {
          utils.alert("提交成功", null, function () {
            $state.go("app.material.type");
          });
        })
      }
    }

  }
})(angular,undefined);

