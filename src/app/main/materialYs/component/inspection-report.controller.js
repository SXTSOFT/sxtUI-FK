/**
 * Created by 陆科桦 on 2016/10/27.
 */

(function (angular, undefined) {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialYsInspectionReport', {
      templateUrl: 'app/main/materialYs/component/inspection-report.html',
      controller: inspectionReport,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function inspectionReport($rootScope, $scope, api, utils, $stateParams, sxt, $state, xhUtils, $filter, remote) {
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.outPutDate = new Date();
    vm.data.ReportTime = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');
    vm.data.LabCheck = true;
    vm.reportImgs = [];

    $scope.$on("$destroy", function () {
      sendReportResult();
      sendReportResult = null;
    });

    var sendReportResult = $rootScope.$on('sendGxResult', function () {
      if (!vm.data.Report) {
        utils.alert('请填写报告单编号');
        return;
      }
      if (vm.reportImgs.length == 0) {
        utils.alert('至少上传一张报告单照片');
        return;
      }

      vm.data.BatchFile = vm.reportImgs;
      api.xhsc.materialPlan.PostReportInfo(vm.data).then(function (r) {
        utils.alert('提交成功!', null, function () {
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
    $rootScope.$on('delete', function (data, index,id) {
      remote.offline.delete({ Id: id });
      $scope.$apply();
    });

    vm.addPhoto = function (type) {
      if(vm.reportImgs.length == 2){
        utils.alert('报告单最多拍照两张照片!');
        return;
      }

      //拍照事件
      xhUtils.photo().then(function (image) {
        if (image) {
          // var image;
          photo(type, vm.reportImgs, image);
          vm.data.ReportTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        }
      });
    };

    remote.offline.query().then(function (r) {
      var list = r.data.filter(function (item) {
        return item.batchId == $stateParams.id;
      })
      list.forEach(function (item) {
        photo2(item.Id, item.type, vm.reportImgs, item.img);
      })
    })

    function photo(type, arr, image) {
      var _id = sxt.uuid();
      var img = {
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType: type,
        ApproachStage: 8,
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
        ApproachStage: 8,
        ImageName: _id + ".jpeg",
        ImageUrl: _id + ".jpeg",
        ImageByte: image
      }
      arr.push(img);
    }
  }
})(angular, undefined);
