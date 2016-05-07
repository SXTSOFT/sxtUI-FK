/**
 * Created by jiuyuong on 2016-5-3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sc2Controller',sc2Controller)
  /** @ngInject */
  function sc2Controller($scope,$rootScope,xhUtils,$stateParams,utils,$mdDialog,db) {
    var vm = this;
    vm.info = {
      db:$stateParams.db,
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
    $rootScope.title = vm.info.aItem.MeasureItemName;
    var pack = db('pack'+vm.info.db);
    pack.get('GetMeasureItemInfoByAreaID').then (function (r) {
      //console.log('r',r)
      var find = r.data.find(function (it) {
        return it.AcceptanceItemID == vm.info.acceptanceItemID;
      })
      var m=[];
      find.MeasureIndexList.forEach(function(item) {
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

    vm.scChoose = function($event){
      $mdDialog.show({
          controller: DialogController,
        targetEvent:$event,
          templateUrl: 'app/main/xhsc/ys/scChoose.html',
          parent: angular.element(document.body),
          clickOutsideToClose:vm.info.MeasureIndexes
        })
        .then(function(answer) {
          var scStr=[];
          answer.forEach(function(t){
            if(t.checked ==  true){
              scStr.push(t);
            }
          });
          vm.info.MeasureIndexes = scStr;
         });
    }

    vm.setRegionId = function(regionId,regionType){
      pack.get('GetRegionTreeInfo').then(function (result) {
        var region = xhUtils.findRegion([result.data],regionId);
        vm.info.imageUrl = region.DrawingID;
        vm.info.regionId = region.RegionID;
        vm.info.regionType = region.RegionType;
        vm.info.name = region.fullName;
      });
    }

    vm.nextRegion = function(prev){
      //vm.info.regionId 当前
      pack.get('GetRegionTreeInfo').then(function (result) {
        var region = xhUtils.findRegion([result.data],regionId);
        vm.info.imageUrl = region.DrawingID;
        //vm.info.regionId = regionId;
        //vm.info.regionType;
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
      $scope.getIsChecked = function () {
        return !$scope.scList.find(function (r) {
          return r.checked;
        })
      }
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
