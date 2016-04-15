/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scController',scController)
  /** @ngInject */
  function scController($scope,remote,xhUtils,$stateParams,utils) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      regionId: $stateParams.regionId,
      regionType: $stateParams.regionType
    };
    vm.nextRegion = function(prev){
      xhUtils.getRegion(vm.info.areaId,function(r){
        var find = r.find(vm.info.regionId);
        if(find){
          var next = prev?find.prev():find.next();
          if(next) {
            vm.info.name = next.FullName;
            vm.info.regionId = next.RegionID;
          }
          else{
            utils.alert('未找到'+(prev?'上':'下')+'一位置')
          }
        }
      });
    };
    remote.Measure.MeasureIndex.query (vm.info.acceptanceItemID).then (function (r) {
      vm.MeasureIndexes = r.data.rows;
    });

  }
})();
