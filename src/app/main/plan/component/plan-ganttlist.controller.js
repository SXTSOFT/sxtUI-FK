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
  function  planGanttlist($state,api){
    var vm = this;
    api.plan.BuildPlan.getList().then(function(r){
      vm.items = r.data.Items;
    });

  }
})();
