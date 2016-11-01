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
  function materialPlanYsCheckInfo($rootScope,$scope,api,utils,$stateParams,xhUtils){
    //拍照事件
    $scope.addPhoto = function () {
      xhUtils.photo().then(function (image) {
        if(image){
          var _id = sxt.uuid();
          upstzl_images.addOrUpdate({
            _id:_id,
            Id: sxt.uuid(),
            BatchId: $stateParams.id,
            ImageName:_id+".jpeg",
            ImageUrl:_id+".jpeg",
            ImageByte: image
          });
        }
      });
    };


    var vm = this;
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
      api.xhsc.materialPlan.PostCheckInfo(vm.data).then(function (r) {
        utils.alert('提交成功!');
      })
    });
  }
})(angular,undefined)
