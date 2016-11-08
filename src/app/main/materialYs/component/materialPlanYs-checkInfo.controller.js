/**
 * Created by 陆科桦 on 2016/10/26.
 */

(function (angular,undefined) {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialYsCheckInfo',{
      templateUrl:'app/main/materialYs/component/materialPlanYs-checkInfo.html',
      controller:materialPlanYsCheckInfo,
      controllerAs:'vm'
    });

  /** @ngInject */
  function materialPlanYsCheckInfo($rootScope,$scope,api,utils,$stateParams,xhUtils,sxt){

    var vm = this;
    vm.images = [];
    vm.vehicleImgs = [];
    vm.goodsImgs = [];
    vm.checkerImgs = [];
    vm.certificateImgs = [];

    //删除图片操作
    $rootScope.$on('delete',function (data,index) {
      $scope.$apply();
    });

    vm.addPhoto = function (type) {
      switch (type){
        case 1:
          photo(type,vm.vehicleImgs,null);
          break;
        case 2:
          photo(type,vm.goodsImgs,null);
          break;
        case 4:
          photo(type,vm.checkerImgs,null);
          break;
        default:
          photo(type,vm.certificateImgs,null);
      }
      //拍照事件
        //xhUtils.photo().then(function (image) {
        // if(image){
        //   switch (type){
        //     case 1:
        //       photo(type,vm.vehicleImgs,image);
        //       break;
        //     case 2:
        //       photo(type,vm.goodsImgs,image);
        //       break;
        //     case 4:
        //       photo(type,vm.checkerImgs,image);
        //       break;
        //     default:
        //       photo(type,vm.certificateImgs,image);
        //   }
        // }
        //});
    };

    function photo(type,arr,image){
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:2,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        //ImageByte: $scope.photos[0].ImageByte
      });
    }

    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.AcceptanceTime = new Date().Format('yyyy年MM月dd日');
    vm.data.WgCheck = true;
    vm.data.IsInspection = true;

    $scope.$on("$destroy",function(){
      sendCheckResult();
      sendCheckResult = null;
    });
    var sendCheckResult = $rootScope.$on('sendGxResult',function() {
      if(vm.data.AcceptanceTime == null){
        utils.alert('验收时间不能为空');
        return;
      }
      if(vm.data.Accepter == null){
        utils.alert('验收人不能为空');
        return;
      }
      if(vm.vehicleImgs.length == 0){
        utils.alert('至少上传一张验收车辆照片');
        return;
      }
      if(vm.goodsImgs.length == 0){
        utils.alert('至少上传一张验收货物照片');
        return;
      }
      if(vm.checkerImgs.length == 0){
        utils.alert('至少上传一张验收检查人照片');
        return;
      }
      if(vm.certificateImgs.length == 0){
        utils.alert('至少上传一张验收合格证照片');
        return;
      }

      vm.images = vm.vehicleImgs.concat(vm.goodsImgs).concat(vm.checkerImgs).concat(vm.certificateImgs);
      vm.data.BatchFile = vm.images;
      api.xhsc.materialPlan.PostCheckInfo(vm.data).then(function (r) {
        utils.alert('提交成功!');
      })
    });
  }
})(angular,undefined);
