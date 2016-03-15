(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope,auth,$state,$rootScope,appCookie)
  {

    var vm = this;
    vm.data = {};
    vm.is = function (state) {
      return vm.includes(state);
    }
    vm.markerClick = markerClick;

    function markerClick($current){
      appCookie.put('projects',JSON.stringify([{project_id:$current.projectId,name:$current.title}]))
      $state.go('app.szgc.project',{pid:$current.projectId, pname: $current.title});
    }
  }
})();
