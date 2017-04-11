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
  function materialUnqualifiedExit($rootScope,$scope,api,utils,$stateParams,$state,sxt,xhUtils,auth,$filter){
    var vm = this;
    var user = auth.current();
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.ExitReason = '材料不合格';
    vm.data.MaterialFiles = [];
    vm.data.ExitOperatorTime = $filter('date')(new Date(),'yyyy-MM-dd hh:mm:ss');
    vm.data.ExitWitness = user.Name;
    vm.data.Unit = $stateParams.unit;

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      if(vm.data.ExitReason == null){
        utils.alert('退场原因不能为空');
        return;
      }
      if(vm.data.ExitCount == null){
        utils.alert('退场数量不能为空');
        return;
      }
      if(vm.data.ExitWitness == null){
        utils.alert('退场见证人不能为空');
        return;
      }
      if(vm.data.MaterialFiles.length == 0){
        utils.alert('请至少上传一张材料退场照片');
        return;
      }

      api.xhsc.materialPlan.materialUnqualifiedExit(vm.data).then(function (q) {
        utils.alert("提交成功", null, function () {
          api.xhsc.materialPlan.deleteMaterialPlanBatch(vm.data.Id);
          $state.go("app.xhsc.materialys.materialdownload");
        });
      });
    });

    //删除图片操作
    $rootScope.$on('delete',function (data,index) {
      $scope.$apply();
    });

    $scope.$on("$destroy",function(){
      sendgxResult();
      sendgxResult=null;
    });

    vm.addPhoto = function (type) {
      //拍照事件
      xhUtils.photo().then(function (image) {
        if(image){
        // var image;
          photo(type,vm.data.MaterialFiles,image);
          vm.data.ExitOperatorTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        }
      });
    }

    function photo(type,arr,image){
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:32,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        ImageByte: image
      });
    }

  }
})(angular,undefined);
