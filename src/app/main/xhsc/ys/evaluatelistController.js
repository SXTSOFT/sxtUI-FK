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
    vm.images = [
      {url:'assets/images/etc/plug.png'},
      {url:'assets/images/etc/fallout.jpg'},
      {url:'assets/images/etc/plug.png'}
    ]
    vm.getRecord = function(ev){
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/main/xhsc/ys/evaluateRecord.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(answer) {
        if(answer){
          vm.input = answer;
        }
        console.log('answer',answer)
      });
    }
    vm.showDialog = function(ev){
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/evaluateinput.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
          //fullscreen: useFullScreen
        })
        .then(function(answer) {
          vm.evaluateNote = answer;
        });
    }
    function DialogController($scope, $mdDialog) {
      $scope.evaluateNote = vm.evaluateNote;
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
