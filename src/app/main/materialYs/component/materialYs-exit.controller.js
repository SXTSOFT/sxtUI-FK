/**
 * Created by 陆科桦 on 2016/10/28.
 */
(function (angular,undefined) {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialYsExit',{
      templateUrl:'app/main/materialYs/component/materialYs-exit.html',
      controller:exit,
      controllerAs:'vm'
    });

  /** @ngInject */
  function exit($rootScope,$scope,$stateParams,api,utils,sxt,xhUtils,$state,auth,$filter){
    var vm = this;
    var user = auth.current();
    vm.data = {ExitId:sxt.uuid(),PlanId:$stateParams.id};
    vm.data.ExitReason = '材料多余';
    vm.data.ExitOperatorTime = $filter('date')(new Date(),'yyyy-MM-dd hh:mm:ss');
    vm.data.ExitWitness = user.Name;

    $scope.$on("$destroy",function(){
      sendCheckResult();
      sendCheckResult = null;
    });

    var sendCheckResult = $rootScope.$on('sendGxResult',function() {
      if(vm.data.ExitCount == null){
        utils.alert('材料退场数量不能为空');
        return;
      }
      if(vm.data.ExitWitness == null){
        utils.alert('退场见证人不能为空');
        return;
      }
      if(vm.exitImgs.length == 0){
        utils.alert('至少上传一张退场照片');
        return;
      }

      vm.data.MaterialFiles = vm.exitImgs;
      api.xhsc.materialPlan.PostExitInfo(vm.data).then(function (r) {
        utils.alert('提交成功!',null,function () {
          $state.go("app.xhsc.materialys.materialdownload");
        });
      })
    });

    vm.exitImgs = [];

    //删除图片操作
    $rootScope.$on('delete',function (data,index) {
      $scope.$apply();
    });

    vm.addPhoto = function (type) {
      //拍照事件
      xhUtils.photo().then(function (image) {
      if(image){
        // var image;
          photo(type,vm.exitImgs,image);
          vm.data.ExitOperatorTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
      }
      });
    };
  }
})(angular,undefined);
