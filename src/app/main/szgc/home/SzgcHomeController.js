(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope,auth,$state,$rootScope)
  {

    var vm = this;
    vm.data = {};
    vm.is = function (state) {
      return vm.includes(state);
    }
    vm.markerClick = markerClick;

    function markerClick($current){
      $state.go('app.szgc.project',{pid:$current.projectId, pname: $current.title});
     // $scope.$parent.vm.params =1;
    }
  }
})();
