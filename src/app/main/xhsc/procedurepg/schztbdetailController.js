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
    remote.Assessment.GetMeasureIndexMeasureInfo($stateParams.recordId,$stateParams.itemId).then(function (result) {
      vm.data = result.data;
      $rootScope.title = vm.data.Region.FullRegionName + (vm.data.Region.HouseTypeName?'('+vm.data.Region.HouseTypeName+')':'');
    });
  }
})();
