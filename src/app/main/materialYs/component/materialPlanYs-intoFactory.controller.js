/**
 * Created by HangQingFeng on 2016/10/25.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialIntoFactory',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-intoFactory.html',
      controller:materialIntoFactory,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialIntoFactory($rootScope,$scope,api,utils,$state,$stateParams){
    var vm = this;
    vm.data = {};
    vm.data.PlanId = $stateParams.id;
    vm.data.Status = $stateParams.status;
    vm.data.ApproachType = vm.data.Status == 1 ? 1 : 0;
    vm.data.ApproachTime=new Date();

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      api.xhsc.materialPlan.CreateMaterialPlanBatch(vm.data).then(function (q) {
        utils.alert("提交成功", null, function () {
          $state.go("app.xhsc.materialys.planList");
        });
      });
    });

    $scope.$on("$destroy",function(){
      sendgxResult();
      sendgxResult=null;
    });

  }
})(angular,undefined);
