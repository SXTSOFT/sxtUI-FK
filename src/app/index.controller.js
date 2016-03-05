(function ()
{
    'use strict';

    angular
        .module('sxt')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,$state,$scope,$rootScope)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
      $rootScope.showgz = false;
      $scope.$watch(function(){
        return $state.is('app.szgc.zg');
      },function(){
        if($state.is('app.szgc.zg')){
          $rootScope.showgz = true;
        }else{
          $rootScope.showgz = false;
        }
       // console.log('show',$rootScope.showgz)
      });
        //////////
    }
})();
