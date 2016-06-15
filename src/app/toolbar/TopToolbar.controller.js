(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,remote,$rootScope) {
      var vm=this;
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
    }


})();
