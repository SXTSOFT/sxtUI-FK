(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,api,$rootScope,remote,$state ) {
      var vm=this;
      vm.is = isRoute;
      function isRoute(route){
        return $state.includes(route);
      }
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

      $scope.ok=function () {
        $rootScope.$emit("ok")
      }

      $scope.goBack = function(){
        if ($rootScope.$$listeners&&$rootScope.$$listeners.goBack&&$rootScope.$$listeners.goBack.length>0){
          $rootScope.$emit("goBack");
          return;
        }

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

      $scope.$on("$destroy",function(){
        //change();
        //sendGxResult();
        //operateMsg();
      });
      $scope.msgFlag=true;
      $scope.setMsg=function(flag){
        $rootScope.$emit('sendMsg',flag);
        $scope.msgFlag=!$scope.msgFlag;
      }
    }

})();
