/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgController',gxzgController);

  /** @ngInject */
  function gxzgController($state){
    var vm = this;

    vm.showTop = function(){
      vm.slideShow = true;
    }
  }
})();
