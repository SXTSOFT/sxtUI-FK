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
          vm.alItem = rs.data;
          vm.person = rs.data[0].MeasureUserName;
          vm.time = rs.data[0].MeasureTime;
          vm.rowslength = rs.data.length;
          var cols=[];
          var l=0;
          rs.data.forEach(function(item){
            //console.log('rs',item);
            if(item.ResultStatus == 1){
              item.passText = "验收合格"
            }else if(item.ResultStatus == 2){
              item.passText = "验收不合格"
            }
            item.cols = item.Points.length;
            if(item.cols>l)l=item.cols;
          })

          rs.data.forEach(function(item){
              while(item.Points.length<l){
                item.Points.push({});
              }
          })
          vm.cols =l;
          if((vm.cols +5)%4 != 0){
            vm.twoCols = Math.floor((vm.cols +5)/4) +1;
            vm.oneCols =(vm.cols +5) -2*vm.twoCols;
          }else{
            vm.twoCols = (vm.cols +5)/4;
            vm.oneCols = 2*vm.twoCols;
          }
        })
      }
    })
  }
})();
