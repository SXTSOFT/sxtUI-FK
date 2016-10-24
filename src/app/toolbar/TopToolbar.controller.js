(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,api,$rootScope,remote,$state) {
      var vm=this;

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

      $scope.goBack = function(){
        history.go(-1);//返回
      }
/*      remote.Project.Area.query().then(function(result){
        vm.Areas = result.data;
        vm.selectedArea = vm.Areas[0];
      })*/

      vm.change = function(){
        $rootScope.$emit('areaSelect',vm.selectedArea)
      }
      vm.sendGxResult = function(){
        $rootScope.$emit('sendGxResult')
      }
      vm.operateMsg = function(){
        $rootScope.$emit('operateMsg');
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
              $rootScope.swap.forEach(function(item){
                item.active = false;
              });
              e.arg.active = true;
              break;
          }
        }
      }
    }
})();
