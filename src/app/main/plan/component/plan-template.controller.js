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

    var id = $state.params["id"];

    if(id!='add'){
      api.plan.TaskTemplates.getItem(id).then(function (r) {
        vm.data = r.data;
      })
    }

    api.plan.TaskLibrary.GetList({Level:0}).then(function (r) {
      vm.tasks = r.data.Items||[];
    });

    vm.ClickSave = function(data){
      if(id=='add'){
        api.plan.TaskTemplates.Create(data).then(function (r) {
          $state.go('app.plan.template.list');
        });
        console.log( data,"保存")
      }else{
        api.plan.TaskTemplates.update(data).then(function (r) {
          $state.go('app.plan.template.list');
        });
      }
    };
  }
})(angular,undefined);
