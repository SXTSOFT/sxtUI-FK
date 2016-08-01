(function () {
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
    });
  }
  angular.element(document).ready(function () {
    var bootstrap = function () {
      angular.bootstrap(document, ['sxt']);
    }
    if (window.cordova) {
      document.addEventListener('deviceready', bootstrap, false);
    }
    else {
      bootstrap();
    }
  });

})();
