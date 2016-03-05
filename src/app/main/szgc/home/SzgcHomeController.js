(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope,auth,$state,$rootScope,msUtils)
  {

    var vm = this;
    vm.data = {};
    vm.is = function (state) {
      return vm.includes(state);
    }
    vm.markerClick = markerClick;

    function markerClick($current){
      msUtils.isMobile()?
        $state.go('app.szgc.xc',{pid:$current.projectId, pname: $current.title}):
        $state.go('app.szgc.area',{pid:$current.projectId, pname: $current.title});
     // $scope.$parent.vm.params =1;
    }
  }
})();
