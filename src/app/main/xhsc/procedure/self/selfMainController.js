/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('selfMainController',selfMainController);

  /** @ngInject */
  function selfMainController($state,$rootScope,$scope,$mdDialog,$stateParams,remote,$q,utils,xhUtils){
    var vm = this;
    vm.isOver=true;
  }
})();
