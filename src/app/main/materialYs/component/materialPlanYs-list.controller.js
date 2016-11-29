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
    var status;
    if(user.Role.MemberType==='' || user.Role.MemberType == 4){
      api.setNetwork(0);
      status = 16;
    }else{
      api.setNetwork(1);
      status = user.Role.MemberType == 0?1:110;
    }


    api.xhsc.materialPlan.getMaterialPlanBatch($stateParams.id,status).then(function (r) {
      vm.planList = r.data;
      console.log(vm.planList)
    });

  }
})(angular,undefined);
