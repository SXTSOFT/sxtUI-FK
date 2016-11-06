/**
 * Created by 陆科桦 on 2016/10/16.
 */

(function (angular,undefined) {
  'use strict';
  angular
    .module('app.material')
    .component('materialAdd',{
      templateUrl:'app/main/material/component/material-add.html',
      controller:materialAdd,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialAdd(api,utils,$stateParams,$state){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;

    // vm.materialType = [
    //   {val:1,name:'土建'},
    //   {val:2,name:'基建'}
    // ];

    api.material.type.getList({Skip: 0, Limit: 999}).then(function (g) {
      vm.materialType = g.data.Items || [];
    });

    if(vm.data.Id){
      api.material.materialScience.getMaterial(vm.data.Id).then(function (r) {
        vm.data = r.data;
      })
    }

    vm.save = function () {
      if(vm.data.Id){
        api.material.materialScience.putMaterial(vm.data).then(function () {
          utils.alert("提交成功",null,function(){
            $state.go("app.material.list");
          });
        })
      }else{
        api.material.materialScience.Create(vm.data).then(function () {
          utils.alert("提交成功",null,function(){
            $state.go("app.material.list");
          });
        })
      }
    }
  }
})(angular,undefined);
