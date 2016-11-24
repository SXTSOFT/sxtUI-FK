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
  function approval($rootScope,$scope,api,$mdBottomSheet,$stateParams,utils,$filter,$state,$mdDialog){
    $rootScope.sendBtName = '批示';
    var vm = this;
    vm.data = {};
    vm.intoFactoryImgs = [];
    vm.checkedImgs = [];
    api.xhsc.materialPlan.getMaterialPlanBatchById($stateParams.id).then(function (r) {
      vm.data = r.data;
      vm.intoFactoryImgs = $filter('filter')(vm.data.Images,{ApproachStage:1});
      vm.checkedImgs = $filter('filter')(vm.data.Images,{ApproachStage:2});
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
              subApproval(0);
            }
          },{
            title:'让步接收',
            action:function(){
              $mdBottomSheet.hide();
              subApproval(1);
            }
          },{
            title:'抽样检查',
            action:function(){
              $mdBottomSheet.hide();
              subApproval(2);
            }
          },
            {
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
      // batch.Opinion = vm.data.Handle?'让步接收':'退场';
      batch.Opinion = function(){
        var val = '退场';
        switch(handle){
          case 0:{
            val = '退场';
            break;
          }
          case 1:{
            val = '让步接收';
            break;
          }
          case 2:{
            val = '抽样检查';
            break;
          }
        }
        return val;
      }();
      batch.Id = $stateParams.id;
      vm.flag = handle;

      if(handle == 1){
        vm.batch = batch;
        cfmInputReason();
        return;
      }

      api.xhsc.materialPlan.PostApprovalInfo(vm.flag,batch).then(function (r) {
        utils.alert('提交成功!',null,function () {
          api.xhsc.materialPlan.deleteMaterialPlanBatch(batch.Id);
          $rootScope.sendBtName = '';
          $state.go("app.xhsc.gx.gxmain");
        });
      });
    }

    var cfmInputReason = function(batch){
      var confirm = $mdDialog.prompt()
        .title('请输入让步接收原因…')
        .placeholder('原因')
        .targetEvent(vm)
        .ok('提交')
        .cancel('取消');

      $mdDialog.show(confirm).then(function(result) {
        if(result && result != null){
          vm.batch.Reason = result;
          api.xhsc.materialPlan.PostApprovalInfo(vm.flag,vm.batch).then(function (r) {
            utils.alert('提交成功!',null,function () {
              api.xhsc.materialPlan.deleteMaterialPlanBatch(vm.batch.Id);
              $rootScope.sendBtName = '';
              $state.go("app.xhsc.gx.gxmain");
            });
          });
        }else{
          utils.alert('尚未输入让步接收原因，，取消当前操作。');
        }
      }, function() {
        //console.log('Cancel');
      });
    };

  }

})(angular,undefined);
