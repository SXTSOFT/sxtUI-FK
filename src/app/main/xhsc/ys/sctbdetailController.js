/**
 * Created by jiuyuong on 2016/6/17.
 */
(function() {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sctbdetailController', sctbdetailController);

  /** @ngInject */
  function sctbdetailController($stateParams,remote,$rootScope) {
    var vm = this;
    remote.Assessment.GetMeasureIndexMeasureInfo($stateParams.recordId,$stateParams.itemId).then(function (result) {
      vm.data = result.data;
      $rootScope.title = vm.data.Region.FullRegionName + (vm.data.Region.HouseTypeName?'('+vm.data.Region.HouseTypeName+')':'');
    });
    vm.back = function () {
      history.back();
    }
  }

})();
