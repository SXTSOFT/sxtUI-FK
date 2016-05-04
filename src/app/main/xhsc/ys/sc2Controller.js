/**
 * Created by jiuyuong on 2016-5-3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sc2Controller',sc2Controller)
  /** @ngInject */
  function sc2Controller($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      //regionId: $stateParams.regionId,
      //regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.acceptanceItemID
      }
    };
    remote.Measure.MeasureIndex.query (vm.info.acceptanceItemID).then (function (r) {
      var m=[];
      r.data.forEach(function(item) {
        if(item.Children && item.Children.length){
          item.Children.forEach(function (item2) {
            m.push(item2);
          })
        }
        else {
          m.push(item);
        }
      });
      vm.MeasureIndexes = m;
    });

  }
})();
