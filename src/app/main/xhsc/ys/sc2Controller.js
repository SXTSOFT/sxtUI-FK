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
    console.log('name',vm.info)
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
      //vm.MeasureIndexes.forEach(function(t){
      //  t.checked = false;
      //})
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
          vm.scStr = scStr;
         });
    }

    function DialogController($scope, $mdDialog) {
      console.log('sc',vm.MeasureIndexes)
      $scope.scList = vm.MeasureIndexes;
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.answer = function (answer) {
       // console.log('ans',answer)
        $mdDialog.hide(answer);
      };
    }
  }
})();
