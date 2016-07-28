/**
 * Created by emma on 2016/7/27.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('schztbdetailController',schztbdetailController);

  /**@ngInject*/
  function schztbdetailController(remote,$rootScope,$stateParams){
    var vm = this;
    vm.acceptanceItemID = $stateParams.acceptanceItemID;
    vm.regionId = $stateParams.regionId;
    console.log($stateParams)
    remote.Assessment.GetMeasureIndexMeasureInfo($stateParams.regionId,$stateParams.itemId).then(function (result) {
      vm.data = result.data;
      console.log('data',vm.data)
      $rootScope.title = vm.data.Region.FullRegionName + (vm.data.Region.HouseTypeName?'('+vm.data.Region.HouseTypeName+')':'');
    });
  }
})();
