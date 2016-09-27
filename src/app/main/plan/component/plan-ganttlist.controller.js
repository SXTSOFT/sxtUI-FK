/**
 * Created by emma on 2016/9/27.
 */
(function(){
  'use strict';

  angular
    .module('app.plan')
    .component('planGanttlist',{
      templateUrl:'app/main/plan/component/plan-ganttlist.html',
      controller:planGanttlist,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function  planGanttlist(){
    var vm = this;
    vm.items = [];
  }
})();
