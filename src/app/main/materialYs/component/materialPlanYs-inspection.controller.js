/**
 * Created by HangQingFeng on 2016/10/27.
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
  function materialPlanInspection($rootScope,$scope,api,utils,$stateParams){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.InspectionTime = new Date();

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      api.xhsc.materialPlan.MaterialInspection(vm.data).then(function (q) {
        utils.alert("提交成功", null, function () {
          $state.go("app.xhsc.gx.gxmain");
        });
      });
    });

    $scope.$on("$destroy",function(){
      sendgxResult();
      sendgxResult=null;
    });

  }
})(angular,undefined);
