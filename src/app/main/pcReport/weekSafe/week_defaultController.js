/**
 * Created by shaoshunliu on 2016/12/19.
 */
/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_week')
    .controller('week_defaultController',week_defaultController);

  /**@ngInject*/
  function week_defaultController($state){
    var vm=this;
    vm.source=[{},{},{},{},{},{},{}]

    vm.go=function (item) {
      $state.go("app.pcReport_week_detail");
    }
  }
})();
/**
 * Created by shaoshunliu on 2016/12/19.
 */
