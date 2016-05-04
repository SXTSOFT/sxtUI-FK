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
    vm.setRegionId = function(regionId,regionType){
      switch (regionType) {
        case '8':
          remote.Project.getFloorDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
        case '16':
          remote.Project.getHouseDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
      }
    }
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
    vm.setRegionId($stateParams.regionId,$stateParams.regionType);
  }
})();
