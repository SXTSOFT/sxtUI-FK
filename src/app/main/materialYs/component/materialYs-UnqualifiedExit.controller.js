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
  function materialUnqualifiedExit($rootScope,$scope,api,utils,$stateParams,$state,sxt){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.ExitReason = '材料不合格';
    vm.data.MaterialFiles = [];

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
      if(vm.data.MaterialPlanFiles.length == 0){
        utils.alert('请至少上传一张材料退场照片');
        return;
      }

      api.xhsc.materialPlan.materialUnqualifiedExit(vm.data).then(function (q) {
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
      photo(type,vm.data.MaterialFiles,null);
    }

    function photo(type,arr,image){
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:64,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        //ImageByte: $scope.photos[0].ImageByte
      });
    }



  }
})(angular,undefined);
