(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,$rootScope) {
      $scope.goBack = function() {
        var data = {cancel: false};
        $rootScope.$broadcast ('goBack', data);
        if (!data.cancel)
          history.go (-1);
      }
    }

})();
