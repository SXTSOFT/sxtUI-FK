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
      vm.MeasureIndexes.forEach(function(t){
        t.checked = false;
      })
      vm.scChoose();
    });

    vm.scChoose = function(){
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/scChoose.html',
          parent: angular.element(document.body),
          clickOutsideToClose:true
        })
        .then(function(answer) {
          var scStr=[];
          answer.forEach(function(t){
            if(t.checked ==  true){
              scStr.push(t);
            }
          })
          vm.info.MeasureIndexes = scStr;
         });
    }

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

    vm.nextRegion = function(prev){
      xhUtils.getRegion(vm.info.areaId,function(r){
        var find = r.find(vm.info.regionId);
        if(find){
          var next = prev?find.prev():find.next();
          if(next) {
            vm.info.name = next.FullName;
            //vm.info.regionId = next.RegionID;
            vm.setRegionId(next.RegionID,vm.info.regionType);
          }
          else{
            utils.alert('未找到'+(prev?'上':'下')+'一位置');
          }
        }
      });
    };
    vm.setRegionId($stateParams.regionId,$stateParams.regionType);

    function DialogController($scope, $mdDialog) {
      //console.log('sc',vm.MeasureIndexes);
      $scope.checkSc = function(sc){
        vm.MeasureIndexes.forEach(function (it) {
          it.checked =false;
        })
        sc.checked = true;
        $scope.answer([sc]);
      };
      $scope.scList = vm.MeasureIndexes;
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }
  }
})();
