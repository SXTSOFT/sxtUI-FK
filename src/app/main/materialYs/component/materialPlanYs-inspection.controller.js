/**
 * Created by HangQingFeng on 2016/10/27.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialPlanInspection', {
      templateUrl: 'app/main/materialYs/component/materialPlanYs-inspection.html',
      controller: materialPlanInspection,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function materialPlanInspection($rootScope, $scope, api, utils, $stateParams, $state, sxt, xhUtils, auth, $filter, remote,$q) {
    var vm = this;
    var user = auth.current();
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.outPutDate = new Date();
    vm.data.InspectionTime = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');
    vm.samplingProcessImgs = [];
    vm.checkListImgs = [];
    vm.data.MaterialPlanFiles = [];
    vm.data.Inspectioner = user.Name;

    var sendgxResult = $rootScope.$on('sendGxResult', function () {
      if (vm.data.InspectionTime == null) {
        utils.alert('送检时间不能为空');
        return;
      }
      if (vm.data.Inspectioner == null) {
        utils.alert('送检人不能为空');
        return;
      }
      if (vm.data.CheckList == null) {
        utils.alert('送检单号不能为空');
        return;
      }
      if (vm.samplingProcessImgs.length == 0) {
        utils.alert('请至少上传一张抽样过程照片');
        return;
      }
      if (vm.checkListImgs.length == 0) {
        utils.alert('请至少上传一张检查单照片');
        return;
      }

      vm.Files = vm.samplingProcessImgs.concat(vm.checkListImgs);
      var q = [api.xhsc.materialPlan.MaterialInspection(vm.data)];
      vm.Files.forEach(function (item) {
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
      });
    });

    //删除图片操作
    $rootScope.$on('delete', function (data, index, id) {
      remote.offline.delete({ Id: id });
      $scope.$apply();
    });

    $scope.$on("$destroy", function () {
      sendgxResult();
      sendgxResult = null;
    });

    vm.addPhoto = function (type) {
      //拍照事件
      xhUtils.photo().then(function (image) {
        if (image) {
          // var image;
          switch (type) {
            case 16: {
              photo(type, vm.samplingProcessImgs, image);
              break;
            }
            case 32: {
              photo(type, vm.checkListImgs, image);
              break;
            }
          }
          vm.data.InspectionTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        }
      });
    }

    remote.offline.query().then(function (r) {
      var list = r.data.filter(function (item) {
        return item.batchId == $stateParams.id;
      })
      list.forEach(function (item) {
        switch (item.type) {
          case "16": {
            photo2(item.Id, item.type, vm.samplingProcessImgs, item.img);
            break;
          }
          case "32": {
            photo2(item.Id, item.type, vm.checkListImgs, item.img);
            break;
          }
        }
      })
    })

    function photo(type, arr, image) {
      var _id = sxt.uuid();
      var img = {
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType: type,
        ApproachStage: 4,
        ImageName: _id + ".jpeg",
        ImageUrl: _id + ".jpeg",
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
        ApproachStage: 4,
        ImageName: _id + ".jpeg",
        ImageUrl: _id + ".jpeg",
        ImageByte: image
      }
      arr.push(img);
    }
  }
})(angular, undefined);
