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
    $rootScope.title = $stateParams.title;
    var user = auth.current();
    vm.status;
    if(user.Role.MemberType==4){
      api.setNetwork(0);
      vm.status = 16;
    }else{
      api.setNetwork(1);
      vm.status = (user.Role.MemberType == 1 || user.Role.MemberType == 32)?1:46;
    }


    api.xhsc.materialPlan.getMaterialPlanBatch($stateParams.id,vm.status).then(function (r) {
      vm.planList = r.data;
    });

  }
})(angular,undefined);
