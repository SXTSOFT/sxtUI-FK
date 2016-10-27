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
  function approval($rootScope,$scope,api,$mdBottomSheet,$stateParams,utils){
    var vm = this;
    vm.data = {};
    api.xhsc.materialPlan.getMaterialPlanDetail($stateParams.planId).then(function (r) {
      vm.data = r.data;
      vm.data.PlanTime = new Date(vm.data.PlanTime).Format('yyyy年MM月dd日');
      vm.data.ApproachTime = new Date(vm.data.ApproachTime).Format('yyyy年MM月dd日');
      vm.data.AcceptanceTime = new Date(vm.data.AcceptanceTime).Format('yyyy年MM月dd日');
    });

    $scope.$on("$destroy",function(){
      sendApprovalResult();
      sendApprovalResult = null;
    });

    var sendApprovalResult = $rootScope.$on('sendGxResult',function() {
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller:function($scope){
          $scope.btns=[{
            title:'退场',
            action:function(){
              $mdBottomSheet.hide();
              subApproval(false);
            }
          },{
            title:'让步接收',
            action:function(){
              $mdBottomSheet.hide();
              subApproval(true);
            }
          },{
            title:'取消',
            action:function(){
              $mdBottomSheet.hide();
            }
          }]
        }
      });
    });

    function subApproval(handle){
      var batch = {};
      batch.Handle = handle;
      batch.Opinion = vm.data.Handle?'让步接收':'退场';
      batch.Id = $stateParams.id;
      api.xhsc.materialPlan.PostApprovalInfo(batch).then(function (r) {
        utils.alert('提交成功!');
      })
    }
  }

})(angular,undefined);
