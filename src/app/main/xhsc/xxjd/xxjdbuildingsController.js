/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('xxjdbuildingsController',xxjdbuildingsController);

  /**@ngInject*/
  function xxjdbuildingsController(builds){
    var vm = this;
    vm.builds = builds;
    console.log('builds',vm.builds)
  }
})();
