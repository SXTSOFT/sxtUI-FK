/**
 * Created by 陆科桦 on 2016/10/27.
 */

(function (angular,undefined) {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialYsInspectionReport',{
      templateUrl:'app/main/materialYs/component/inspection-report.html',
      controller:inspectionReport,
      controllerAs:'vm'
    });

  /** @ngInject */
  function inspectionReport($rootScope,$scope,api,utils,$stateParams,sxt,$state){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.outPutDate = new Date().Format('yyyy年MM月dd日');
    vm.data.ReportTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
    vm.data.LabCheck = true;
    vm.reportImgs = [];

    $scope.$on("$destroy",function(){
      sendReportResult();
      sendReportResult = null;
    });

    var sendReportResult = $rootScope.$on('sendGxResult',function() {

      if(!vm.data.Report){
        utils.alert('请填写报告单编号');
        return;
      }

      if(vm.checkerImgs.length == 0){
        utils.alert('至少上传一张报告单照片');
        return;
      }

      vm.data.BatchFile = vm.reportImgs;
      api.xhsc.materialPlan.PostReportInfo(vm.data).then(function (r) {
        utils.alert('提交成功!',null,function () {
          api.xhsc.materialPlan.deleteMaterialPlanBatch(vm.data.Id);
          $state.go("app.xhsc.gx.gxmain");
        });
      })
    });

    //删除图片操作
    $rootScope.$on('delete',function (data,index) {
      $scope.$apply();
    });

    vm.addPhoto = function (type) {
      //拍照事件
      xhUtils.photo().then(function (image) {
        if(image){
          photo(type,vm.reportImgs,image);
          vm.data.ReportTime = new Date();
        }
      });
    };

    function photo(type,arr,image){
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:8,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        ImageByte: image
      });
    }

  }
})(angular,undefined);
