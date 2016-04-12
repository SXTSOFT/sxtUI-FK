(function ()
{
    'use strict';

    angular
        .module('sxt')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope)
    {
        // Data

        //////////

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event)
        {
            if ( event.targetScope.$id === $scope.$id )
            {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });
    }
      angular.element(document).ready(function () {

      angular.bootstrap(document, ['sxt']);
    });


})();
