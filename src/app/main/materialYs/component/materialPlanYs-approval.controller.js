/**
 * Created by 陆科桦 on 2016/10/27.
 */
(function (angular,undefined) {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialYsApproval',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-approval.html',
      controller:approval,
      controllerAs:'vm'
    });

  /** @ngInject */
  function approval($rootScope,$scope,api,utils,$stateParams){
    var vm = this;
  }

})(angular,undefined)
