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
  function materialUnqualifiedExit($rootScope,$scope,api,utils,$stateParams,$state){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.ExitReason = '材料不合格';
    vm.max = $stateParams.max;

    $scope.$watch('vm.data.ExitCount',function () {
      if( vm.data.ExitCount > vm.max){
        vm.data.ExitCount = parseFloat(vm.max);
      }
    });

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      api.setNetwork(1).then(function(){//材料退场为离线操作
        api.xhsc.materialPlan.materialUnqualifiedExit(vm.data).then(function (q) {
          utils.alert("提交成功", null, function () {
            $state.go("app.xhsc.gx.gxmain");
          });
        });
      });
    });

    $scope.$on("$destroy",function(){
      sendgxResult();
      sendgxResult=null;
    });
  }
})(angular,undefined)
