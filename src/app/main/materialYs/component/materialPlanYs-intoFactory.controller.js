/**
 * Created by HangQingFeng on 2016/10/25.
 */

(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialIntoFactory', {
      templateUrl: 'app/main/materialYs/component/materialPlanYs-intoFactory.html',
      controller: materialIntoFactory,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function materialIntoFactory($rootScope, $scope, api, utils, $state, $stateParams, sxt, xhUtils, auth,$filter) {
    var vm = this;
    var user = auth.current();
    vm.data = {};
    vm.data.ApproachType = $stateParams.status == 1 ? 1 : 0;
    vm.outPutDate = new Date();
    vm.data.ApproachTime = $filter('date')(new Date(),'yyyy-MM-dd hh:mm:ss');
    vm.data.MaterialPlanFiles = [];
    vm.vehicleImgs = [];
    vm.goodsImgs = [];
    vm.rummagerImgs = [];
    vm.CertificateImgs = [];
    vm.data.Inspector = user.Name;
    vm.data.IsPacking = true;
    var status = user.Role.MemberType == 0 ? 1 : 110;
    vm.CountDisabled = false;

    api.xhsc.materialPlan.getMaterialPlanDetail($stateParams.BatchId).then(function (q) {
      vm.data.Id = q.data.Id;
      vm.data.PlanId = q.data.PlanId;
      vm.Brands = q.data.Brands.split('，') || [];
      if (vm.data.ApproachType == 1) {
        vm.data.Id = sxt.uuid();
      }

      api.xhsc.materialPlan.getMaterialBatchIntoFactory().then(function (r) {
        if(r.data && r.data.length > 0){
          vm.CountDisabled = false;
          var _subCount = 0;
          r.data.forEach(function (e) {
            if (vm.data.PlanId == e.PlanId) {
              _subCount = parseFloat(e.ApproachCount) + _subCount;
            }
          });

          _subCount = q.data.PlanCount - _subCount;
          vm.data.ApproachCount = _subCount > 0 ? _subCount : 0;
        } else {
          vm.data.ApproachCount = parseFloat(q.data.PlanCount);
          vm.CountDisabled = vm.data.ApproachType == 0 ? true : false;
        }
      });
    });

    var sendgxResult = $rootScope.$on('sendGxResult', function () {
      if (vm.data.ApproachCount == null) {
        utils.alert('进场数量不能为空');
        return;
      }
      if (vm.data.Brand == null) {
        utils.alert('厂家/品牌不能为空');
        return;
      }
      if (vm.data.Supplier == null) {
        utils.alert('供货方不能为空');
        return;
      }
      if (vm.data.Inspector == null) {
        utils.alert('检查人不能为空');
        return;
      }
      if (vm.vehicleImgs.length == 0) {
        utils.alert('请上传至少一张车辆检查照片');
        return;
      }
      if (vm.goodsImgs.length == 0) {
        utils.alert('请上传至少一张货物检查照片');
        return;
      }
      if (vm.rummagerImgs.length == 0) {
        utils.alert('请上传至少一张检查人照片');
        return;
      }
      if (vm.CertificateImgs.length == 0) {
        utils.alert('请上传至少一张合格证照片');
        return;
      }

      vm.data.MaterialPlanFiles = vm.vehicleImgs.concat(vm.goodsImgs, vm.rummagerImgs, vm.CertificateImgs);

      api.xhsc.materialPlan.IntoFactoryMaterialBatch(vm.data).then(function (q) {
        utils.alert("提交成功", null, function () {
          if(vm.data.ApproachType == 0){
            api.xhsc.materialPlan.deleteMaterialPlanBatch(vm.data.Id);
          }
          $state.go("app.xhsc.materialys.materialdownload");
        });
      });
    });

    $scope.$on("$destroy", function () {
      sendgxResult();
      sendgxResult = null;
    });

    //删除图片操作
    $rootScope.$on('delete', function (data, index) {
      $scope.$apply();
    });

    vm.addPhoto = function (type) {
      xhUtils.photo().then(function (image) {
        if (image) {
          // var image;
          switch (type) {
            case 256: {
              photo(type, vm.vehicleImgs, image);
              break;
            }
            case 512: {
              photo(type, vm.goodsImgs, image);
              break;
            }
            case 1024: {
              photo(type, vm.rummagerImgs, image);
              break;
            }
            case 2048: {
              photo(type, vm.CertificateImgs, image);
              break;
            }
          }
          vm.data.ApproachTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
        }
      });
    };

    function photo(type, arr, image) {
      var _id = sxt.uuid();
      arr.push({
        Id: sxt.uuid(),
        BatchId: $stateParams.id,
        OptionType: type,
        ApproachStage: 1,
        ImageName: _id + ".jpeg",
        ImageUrl: _id + ".jpeg",
        ImageByte: image
      });
    }
  }
})(angular, undefined);
