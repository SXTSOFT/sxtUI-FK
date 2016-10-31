/**
 * Created by HuangQingFeng on 2016/10/28.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialUnqualifiedExit',{
      templateUrl:'app/main/materialYs/component/materialYs-UnqualifiedExit.html',
      controller:materialUnqualifiedExit,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialUnqualifiedExit($rootScope,$scope,api,utils){
    var vm = this;
    vm.data = {};
    vm.data.ExitReason = '材料不合格';


    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      api.xhsc.materialPlan.materialUnqualifiedExit(vm.data).then(function (q) {
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
})(angular,undefined)
