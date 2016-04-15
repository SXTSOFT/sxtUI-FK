/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scController',scController)
  /** @ngInject */
  function scController($scope,remote,$timeout,$stateParams) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      acceptanceItemID: $stateParams.acceptanceItemID,
      regionId: $stateParams.regionId,
      regionType: $stateParams.regionType
    };
    remote.Measure.MeasureIndex.query (vm.info.acceptanceItemID).then (function (r) {
      vm.MeasureIndexes = r.data.rows;
    });
  }
})();
