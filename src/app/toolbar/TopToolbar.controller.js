(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,$rootScope,api) {
      var vm=this;
      vm.networking = false;
      $rootScope.$on('sxt:onNetworking', function (e, config) {
        vm.networking = true;
      })
      $rootScope.$on('sxt:cancelNetworking', function () {
        vm.networking = false;
      });

      $rootScope.$on('sxt:online', function(event, state){
        vm.networkState = api.getNetwork();
      });
      $rootScope.$on('sxt:offline', function(event, state){
        vm.networkState = api.getNetwork();
      });
      vm.networkState = api.getNetwork();
      vm.setNetwork = function () {
        vm.networkState = vm.networkState==0?1:0;
        api.setNetwork(vm.networkState);
      }

      $scope.goBack = function() {
        var data = {cancel: false};
        $rootScope.$broadcast ('goBack', data);
        if (!data.cancel)
          history.go (-1);
      }
    }

})();
