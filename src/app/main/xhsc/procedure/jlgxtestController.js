/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('jlgxtestController',jlgxtestController);

  /**@ngInject*/
  function jlgxtestController($scope){
    var vm = this;
    vm.showTop = function(){
      vm.show = true;
    }
  }
})();
