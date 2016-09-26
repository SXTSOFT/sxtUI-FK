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
  function planTemplate(api,$state){
    var vm = this;
    vm.ClickSave = function(data){
      api.plan.TaskTemplates.Create({Name:data.Name,AreaId:data.AreaId}).then(function (r) {
        $state,go('app.plan.template.list');
      });

      console.log( data,"保存")
    };
  }
})(angular,undefined);
