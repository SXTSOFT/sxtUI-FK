(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,$rootScope,api,$window) {
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
      vm.cmd = function(cmd,arg) {
        var e = {cmd: cmd, rev: true,arg:arg, cancel:false};
        $rootScope.$emit('toolbar:cmd:before', e);
        if(!e.cancel)
          $rootScope.$emit('toolbar:cmd', e);
        if(!e.cancel)
          $rootScope.$emit('toolbar:cmd:after', e);

        if(e.rev.then){
          e.rev.then(doCmd);
        }
        else{
          doCmd(e);
        }
      }
      function doCmd(e){
        if (e.rev === true) {
          switch (e.cmd) {
            case 'prev':
              $rootScope.isGoback = true;
              $window.history.go(-1);
              break;
            case 'swap':

              break;
          }

        }
      }
      $scope.goBack = function() {
        var data = {cancel: false};
        $rootScope.$broadcast ('goBack', data);
        $rootScope.$broadcast ('goBack:end', data);
        if (!data.cancel)
          history.go (-1);
      }
    }

})();
