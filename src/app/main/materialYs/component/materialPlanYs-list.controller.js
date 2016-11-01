/**
 * Created by HangQingFeng on 2016/10/24.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialPlanList',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-list.html',
      controller:materialPlanList,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialPlanList($rootScope,$stateParams,api,utils,$state,auth){
    var vm = this;
    $rootScope.title = 'aaa';
    var user = auth.current();
    var status = user.Role.MemberType==0?17:110;

    api.setNetwork(1).then(function(){
      api.xhsc.materialPlan.getMaterialPlanBatch($stateParams.id,status).then(function (r) {
        vm.planList = r.data;
      });
    });

  }
})(angular,undefined)
