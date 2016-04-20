/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scdController',scdController)
  /** @ngInject */
  function scdController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      regionId: $stateParams.regionId,
      regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.acceptanceItemID
      }
    };
    $rootScope.title = vm.info.aItem.MeasureItemName;
    remote.ProjectQuality.getNumber(vm.info.acceptanceItemID,vm.info.regionId).then(function(result){
      vm.info.Numbers = result.data;
      vm.info.t = result.data[0].MeasureRecordID;
    });

    $scope.$watch('vm.info.t',function(){
      if(vm.info.t){
        remote.ProjectQuality.getMeasureCheckResult(vm.info.t).then(function(rs){
          console.log('rs',rs);
        })
      }
    })
  }
})();
