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
  function materialPlanInspection($rootScope,$scope,api,utils,$stateParams,$state,sxt){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.InspectionTime = new Date();
    vm.samplingProcessImgs = [];
    vm.checkListImgs = [];
    vm.data.MaterialPlanFiles = [];

    var sendgxResult =$rootScope.$on('sendGxResult',function(){
      vm.data.MaterialPlanFiles = vm.samplingProcessImgs.concat(vm.checkListImgs);
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

    vm.addPhoto = function (type) {
      switch (type) {
        default:
        case 16:{
          photo(type,vm.samplingProcessImgs,null);
          break;
        }
        case 32:{
          photo(type,vm.checkListImgs,null);
          break;
        }
      }
    }

    function photo(type,arr,image){
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:8,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        //ImageByte: $scope.photos[0].ImageByte
      });
    }





  }
})(angular,undefined);
