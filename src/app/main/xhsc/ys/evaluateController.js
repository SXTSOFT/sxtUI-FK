/**
 * Created by emma on 2016/4/28.
 */
(function(){
  'use strcit';

  angular
    .module('app.xhsc')
    .controller('evaluateController',evaluateController);

  /** @ngInject*/
  function evaluateController($mdDialog,$timeout,$state,api,$state){
    var vm = this;

    vm.showECs = function(ev) {
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
     // console.log('ev',parent)
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/evaluateChoose.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
          //fullscreen: useFullScreen
        })
        .then(function(answer) {

        });
      function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }

      vm.goSC=function(item){
        api.setNetwork(1).then(function(){
          $state.go('app.xhsc.ch2',{areaID:item.AreaID,areaName:item.AreaName,assessmentID:item.AssessmentID});
        });
      }
      vm.goST=function(item){
        api.setNetwork(1).then(function(){
          $state.go('app.xhsc.ch1',{areaID:item.AreaID,areaName:item.AreaName,assessmentID:item.AssessmentID,AssessmentTypeID:'7d179e8804a54819aad34b7a9398880d',typename:'实体质量'});
        });
      }
      vm.goAQ=function(item){
        api.setNetwork(1).then(function(){
          $state.go('app.xhsc.ch1',{assessmentID:item.AssessmentID,AssessmentTypeID:'82666209a15647569f9bcaff50d324c2',typename:'安全文明'});
        });
      }

    };
  }
})();
