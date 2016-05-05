/**
 * Created by emma on 2016/5/5.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('downloadController',downloadController);

  /** @ngInject*/
  function downloadController($mdDialog){
    var vm = this;
    vm.upload = function(){
      console.log('upload')
    }
    vm.download = function(){
      console.log('download')
    }
    vm.cancel = function(){
      console.log('cancel')
    }
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
