/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistController',evaluatelistController);

  /** @ngInject*/
  function evaluatelistController($mdDialog,$rootScope,$scope){
    var vm = this;
    vm.images = [
      {url:'assets/images/etc/plug.png'},
      {url:'assets/images/etc/fallout.jpg'},
      {url:'assets/images/etc/plug.png'}
    ];
    var deleteFn = function(d,data){
      //vm.images.splice(data,1);
      $scope.$apply();
     // console.log('a',vm.images)
    }
    $rootScope.$on('delete',deleteFn);
    vm.showDialog = function(ev){
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/evaluateinput.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
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
