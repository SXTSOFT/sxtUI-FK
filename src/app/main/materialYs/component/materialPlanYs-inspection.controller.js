/**
 * Created by Administrator on 2016/10/27.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialPlanInspection',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-inspection.html',
      controller:materialPlanInspection,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialPlanInspection($scope,api,utils,$stateParams){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;




  }
})(angular,undefined);
