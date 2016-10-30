/**
 * Created by lss on 2016/10/30.
 */
/**
 * Created by lss on 2016/7/25.
 */
/**
 * Created by jiuyuong on 2016-5-3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sc_standarController',sc_standarController)
  /** @ngInject */
  function sc_standarController($rootScope,xhUtils,$stateParams,$mdDialog,sxt,$timeout,$state,remote,$q) {
    var vm = this;
    vm.info = {
      acceptanceItemID:$stateParams.AcceptanceItemID,
      acceptanceIndexID:$stateParams.acceptanceIndexID,
      drawingID:$stateParams.DrawingID
    };
      $rootScope.title =vm.info.name;
      var arr=[
        remote.Project.GetMeasureItemInfoByAreaID(),
        remote.Project.getDrawing(vm.info.drawingID)
      ]

      $q.all(arr).then(function(res){
        var  r=res[0];
        vm.drawing=res[1];

        var find = r.data.find(function (it) {
          return it.AcceptanceItemID == vm.info.acceptanceItemID;
        });
        if (find){
          $rootScope.title =find.MeasureItemName;
          var m=[];
          find.MeasureIndexList.forEach(function(item) {
            if(item.AcceptanceIndexID==vm.info.acceptanceIndexID){
              item.checked=true;
            }
            m.push(item);
          });
          vm.MeasureIndexes = m;
          $timeout(function () {
            if (!vm.info.acceptanceIndexID){
              vm.scChoose();
            }
          },500);
        }

      }).catch(function(err){
        console.log(err);
      });

      vm.scChoose = function($event){
        $mdDialog.show({
            controller: ['$scope','$mdDialog',function($scope, $mdDialog) {
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
            }],
            targetEvent:$event,
            templateUrl: 'app/main/xhsc/ys/scChoose.html',
            parent:angular.element('#content'),
            clickOutsideToClose:vm.info.MeasureIndexes
          })
      }
  }
})();
