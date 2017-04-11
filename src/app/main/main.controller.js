(function () {
  'use strict';

  angular
    .module('sxt')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $rootScope,$cookies) {
    $scope.$on('$viewContentAnimationEnded', function (event) {
      if (event.targetScope.$id === $scope.$id) {
        $rootScope.$broadcast('msSplashScreen::remove');
      }
    });
    $scope.$on('hidebar', function () {
      $scope.isHideBar = true;
    });

    $rootScope.$on('hidebar', function () {
      console.log($scope.isHideBar);
      $scope.isHideBar = true;
    });

    $rootScope.$on('openbar', function () {
      console.log($scope.isHideBar);
      $scope.isHideBar = false;
    });

    $scope.theme= $cookies.get("selectedTheme");

  }
})();
