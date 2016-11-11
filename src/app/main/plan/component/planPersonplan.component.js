/**
 * Created by emma on 2016/11/11.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planPersonplan',{
      templateUrl:'app/main/plan/component/plan-personplan.html',
      controller:personPlanController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function personPlanController(){
    var vm = this;
  }
})(angular,undefined);
