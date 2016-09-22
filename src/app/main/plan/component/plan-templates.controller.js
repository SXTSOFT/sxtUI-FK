/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTemplates',{
      templateUrl:'app/main/plan/component/plan-templates.html',
      controller:planTemplates,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planTemplates(){

  }
})(angular,undefined);
