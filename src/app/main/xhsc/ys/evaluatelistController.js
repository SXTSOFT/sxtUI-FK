/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistController',evaluatelistController);

  /** @ngInject*/
  function evaluatelistController($mdDialog){
    var vm = this;
    vm.getRecord = function(ev){
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/main/xhsc/ys/evaluateRecord.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
        //fullscreen: useFullScreen
      })
      .then(function(answer) {

      });
    }
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
  }
})();
