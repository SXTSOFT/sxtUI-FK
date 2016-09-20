(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,api,$rootScope,remote) {
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
    }


})();
