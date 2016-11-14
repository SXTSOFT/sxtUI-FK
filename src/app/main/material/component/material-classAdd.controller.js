/**
 * Created by HangQingFeng on 2016/10/17.
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

    vm.provinces = [
      {
        label: '北京',
        cities: [
          {
            population: 1961.24,
            code: 'bj',
            label: '北京市'
          }
        ]
      },
      {
        label: '上海',
        cities: [
          {
            population: 2301.91,
            code: 'sh',
            label: '上海市'
          }
        ]
      },
      {
        label: '广东',
        cities: [
          {
            population: 1270.08,
            code: 'gz',
            label: '广州'
          },
          {
            population: 1035.79,
            code: 'sz',
            label: '深圳'
          }
        ]
      }
    ];

    api.material.type.getParent().then(function(r){
      vm.ParentClass = r.data;
    });

    // vm.selAClass = function (m) {
    //   vm.data.ParentId = m.Id;
    //   vm.data.ParentName = m.CategoryName
    //   api.material.type.getParent(m.Id).then(function(r){
    //     vm.BClass = r.data;
    //   });
    // };
    //
    // vm.selBClass = function(m){
    //   vm.data.ParentId = m.Id;
    //   vm.data.ParentName = vm.data.ParentName + ' > ' + m.CategoryName;
    // };

    vm.selParent = function (m) {
      vm.data.ParentName = m.CategoryName;
    };

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

