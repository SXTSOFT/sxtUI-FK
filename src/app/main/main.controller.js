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
    $scope.theme= $cookies.get("selectedTheme");
  }
})();
