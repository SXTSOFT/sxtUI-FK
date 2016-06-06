(function ()
{
    'use strict';

    angular
        .module('sxt')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope) {
      $scope.$on('$viewContentAnimationEnded', function (event) {
        if (event.targetScope.$id === $scope.$id) {
          $rootScope.$broadcast('msSplashScreen::remove');
        }
      });
      $scope.$on('hidebar', function () {
        $scope.isHideBar = true;
        console.log('b')
      });
      //$scope.$on('hidefootbar', function () {
      //  $scope.hideFBar = false;
      //  //console.log('b')
      //});
    }

  angular.element(document).ready(function () {

      angular.bootstrap(document, ['sxt']);
  });


})();
