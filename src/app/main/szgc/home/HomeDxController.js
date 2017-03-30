(function(angular){
  'use strict';

  angular
    .module('app.szgc')
    .controller('HomeDxController', HomeDxController);

  /** @ngInject */
  function HomeDxController($stateParams, api)
  {
    var vm = this;
    api.szgc.vanke.yj($stateParams.itemId).then(function (r) {
      vm.areas = r.data.Rows.filter(function (item) {
        return item.RegionType==512;
      }).map(function (item) {
        return {
          zy:1,
          itemId:$stateParams.itemId+'>'+item.Id,
          itemName:$stateParams.itemName+'>'+item.RegionName
        }
      });
      vm.yj1 = vm.areas[0];
      vm.setYj(vm.yj1);

    });
    vm.setYj = function (item) {
      if(!item.items) {
        api.szgc.vanke.yj(item.itemId).then(function (r) {
          item.items = r.data.Rows;
          vm.yj = item;
        });
      }
      else{
        vm.yj = item;
      }
    }
    //vm.yj = yj;
  }

})(angular);
