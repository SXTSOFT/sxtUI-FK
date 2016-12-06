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
  function materialPlanInspection($rootScope,$scope,api,utils,$stateParams,$state,sxt,xhUtils,auth,$filter){
    var vm = this;
    var user = auth.current();
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.outPutDate = new Date();
    vm.data.InspectionTime = $filter('date')(new Date(),'yyyy-MM-dd hh:mm:ss');
    vm.samplingProcessImgs = [];
    vm.checkListImgs = [];
    vm.data.MaterialPlanFiles = [];
    vm.data.Inspectioner = user.Name;

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      if(vm.data.InspectionTime == null){
        utils.alert('送检时间不能为空');
        return;
      }
      if(vm.data.Inspectioner == null){
        utils.alert('送检人不能为空');
        return;
      }
      if(vm.data.CheckList == null){
        utils.alert('送检单号不能为空');
        return;
      }
      if(vm.samplingProcessImgs.length == 0){
        utils.alert('请至少上传一张抽样过程照片');
        return;
      }
      if(vm.checkListImgs.length == 0 ){
        utils.alert('请至少上传一张检查单照片');
        return;
      }

      vm.data.MaterialPlanFiles = vm.samplingProcessImgs.concat(vm.checkListImgs);
      api.xhsc.materialPlan.MaterialInspection(vm.data).then(function (q) {
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
          switch (type) {
            case 16:{
              photo(type,vm.samplingProcessImgs,image);
              break;
            }
            case 32:{
              photo(type,vm.checkListImgs,image);
              break;
            }
          }
          vm.data.InspectionTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        }
      });
    }

    function photo(type,arr,image){
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:4,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        ImageByte: image
      });
    }
  }
})(angular,undefined);
