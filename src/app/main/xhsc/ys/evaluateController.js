/**
 * Created by emma on 2016/4/28.
 */
(function(){
  'use strcit';

  angular
    .module('app.xhsc')
    .controller('evaluateController',evaluateController);

  /** @ngInject*/
  function evaluateController($mdDialog,$timeout){
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
     // $timeout(function(){$('.md-scroll-mask').addClass('addlayer');},100);
      //$scope.$watch(function() {
      //  return $mdMedia('xs') || $mdMedia('sm');
      //}, function(wantsFullScreen) {
      //  $scope.customFullscreen = (wantsFullScreen === true);
      //});
    };
  }
})();
