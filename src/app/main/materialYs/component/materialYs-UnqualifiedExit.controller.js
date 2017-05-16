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
  function materialUnqualifiedExit($rootScope,$scope,api,utils,$stateParams,$state,sxt,xhUtils,auth,$filter, remote,$q){
    var vm = this;
    var user = auth.current();
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.ExitReason = '材料不合格';
    vm.MaterialFiles = [];
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
      if(vm.MaterialFiles.length == 0){
        utils.alert('请至少上传一张材料退场照片');
        return;
      }

      var q = [api.xhsc.materialPlan.materialUnqualifiedExit(vm.data)];
      vm.MaterialFiles.forEach(function (item) {
        q.push(api.xhsc.materialPlan.MaterialFile(item));
      })

      $q.all(q).then(function (r) {
        utils.alert("提交成功", null, function () {
          remote.offline.query().then(function (r) {
            var list = r.data.filter(function (item) {
              return item.batchId == vm.data.Id;
            })
            list.forEach(function (item) {
              remote.offline.delete({ Id: item.Id });
            })
          })
          api.xhsc.materialPlan.deleteMaterialPlanBatch(vm.data.Id);
          $state.go("app.xhsc.materialys.materialdownload");
        });
      })
    });

    //删除图片操作
    $rootScope.$on('delete',function (data,index,id) {
      remote.offline.delete({ Id: id });
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
          photo(type,vm.MaterialFiles,image);
          vm.data.ExitOperatorTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        }
      });
    }

    remote.offline.query().then(function (r) {
      var list = r.data.filter(function (item) {
        return item.batchId == $stateParams.id;
      })
      list.forEach(function (item) {
        photo2(item.Id, item.type, vm.MaterialFiles, item.img);
      })
    })

    function photo(type,arr,image){
      var _id = sxt.uuid();
      var img = {
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType:type,
        ApproachStage:32,
        ImageName:_id+".jpeg",
        ImageUrl:_id+".jpeg",
        ImageByte: image
      }
      arr.push(img);
      remote.offline.create({ Id: img.Id, batchId: $stateParams.id, type: type, img: image });
    }

    function photo2(id, type, arr, image) {
      var _id = sxt.uuid();
      var img = {
        Id: id,
        BatchId: $stateParams.id,
        OptionType: type,
        ApproachStage: 32,
        ImageName: _id + ".jpeg",
        ImageUrl: _id + ".jpeg",
        ImageByte: image
      }
      arr.push(img);
    }
  }
})(angular,undefined);
