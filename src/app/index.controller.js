(function ()
{
    'use strict';

    angular
        .module('sxt')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,$state,$scope,$rootScope,utils)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
      $rootScope.showgz = function(){
        return $state.is('app.szgc.tzg');
      };
      $rootScope.send = function($event){
        utils.alert('发送成功',$event,function(){
          history.back();
        })
      }
    }
})();
