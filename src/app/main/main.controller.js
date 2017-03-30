(function () {
  'use strict';

  angular
    .module('sxt')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $rootScope) {
    // Data

    //////////

    // Remove the splash screen
    $scope.$on('$viewContentAnimationEnded', function (event) {
      if (event.targetScope.$id === $scope.$id) {
        $rootScope.$broadcast('msSplashScreen::remove');
      }
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
