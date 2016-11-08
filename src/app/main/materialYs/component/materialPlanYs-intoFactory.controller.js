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
  function materialIntoFactory($rootScope,$scope,api,utils,$state,$stateParams,sxt){
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
      vm.data.MaterialPlanFiles = vm.vehicleImgs.concat(vm.goodsImgs,vm.rummagerImgs,vm.CertificateImgs)
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

    vm.addPhoto = function (type) {
      switch (type) {
        case 256:{
          photo(type,vm.vehicleImgs,null);
          break;
        }
        case 512:{
          photo(type,vm.goodsImgs,null);
          break;
        }
        case 1024:{
          photo(type,vm.rummagerImgs,null);
          break;
        }
        case 2048:{
          photo(type,vm.CertificateImgs,null);
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
        ApproachStage:1,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        //ImageByte: $scope.photos[0].ImageByte
      });
    }



  }
})(angular,undefined);
