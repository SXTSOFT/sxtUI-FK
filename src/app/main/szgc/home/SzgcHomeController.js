(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController(auth,$state)
  {

    var vm = this;
    //

    vm.markers = [
      {
        lat:22.631026,
        lng:114.111701,
        projectId:'1'
      },{
        lat:22.630026,
        lng:114.311701,
        projectId:'2'
      }
    ];
    vm.markerClick = markerClick;


    function markerClick($current){
      $state.go('app.szgc.jd',{id:$current.projectId});
    }
  }
})();
