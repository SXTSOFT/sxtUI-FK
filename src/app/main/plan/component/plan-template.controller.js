/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTemplate',{
      templateUrl:'app/main/plan/component/plan-template.html',
      controller:planTemplate,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planTemplate(){

  }
})(angular,undefined);
