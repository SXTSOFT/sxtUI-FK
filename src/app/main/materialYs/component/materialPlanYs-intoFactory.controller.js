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
  function materialIntoFactory($rootScope,$scope,api,utils,$state,$stateParams,sxt,xhUtils){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.BatchId;
    vm.data.PlanId = $stateParams.Id;
    vm.data.ApproachType = $stateParams.status == 1 ? 1 : 0;
    vm.data.ApproachTime=new Date();
    vm.data.MaterialPlanFiles = [];
    vm.vehicleImgs = [];
    vm.goodsImgs = [];
    vm.rummagerImgs = [];
    vm.CertificateImgs = [];

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      vm.data.MaterialPlanFiles = vm.vehicleImgs.concat(vm.goodsImgs,vm.rummagerImgs,vm.CertificateImgs);

      if(vm.data.ApproachCount == null){
        utils.alert('进场数量不能为空');
        return;
      }
      if(vm.data.Brand == null){
        utils.alert('厂家/品牌不能为空');
        return;
      }
      if(vm.data.Supplier == null){
        utils.alert('供货方不能为空');
        return;
      }
      if(vm.data.Inspector == null){
        utils.alert('检查人不能为空');
        return;
      }
      if(vm.vehicleImgs.length == 0){
       utils.alert('请上传至少一张车辆检查照片');
        return;
      }
      if(vm.goodsImgs.length == 0){
        utils.alert('请上传至少一张货物检查照片');
        return;
      }
      if(vm.rummagerImgs.length == 0){
        utils.alert('请上传至少一张检查人照片');
        return;
      }
      if(vm.CertificateImgs.length == 0){
        utils.alert('请上传至少一张合格证照片');
        return;
      }

      api.xhsc.materialPlan.IntoFactoryMaterialBatch(vm.data).then(function (q) {
        utils.alert("提交成功", null, function () {
          $state.go("app.xhsc.gx.gxmain");
        });
      });
    });

    $scope.$on("$destroy",function(){
      sendgxResult();
      sendgxResult=null;
    });

    //删除图片操作
    $rootScope.$on('delete',function (data,index) {
      $scope.$apply();
    });

    vm.addPhoto = function (type) {
      xhUtils.photo().then(function (image) {
        if (image) {
          switch (type) {
            case 256:{
              photo(type,vm.vehicleImgs,image);
              break;
            }
            case 512:{
              photo(type,vm.goodsImgs,image);
              break;
            }
            case 1024:{
              photo(type,vm.rummagerImgs,image);
              break;
            }
            case 2048:{
              photo(type,vm.CertificateImgs,image);
              break;
            }
          }
        }
      });
    }

    function photo(type,arr,image){
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:1,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        ImageByte: image
      });
    }

  }
})(angular,undefined);
