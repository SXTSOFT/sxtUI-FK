(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope) {
      $scope.goBack = function(){
        history.go(-1);//返回
      }
    }

})();
