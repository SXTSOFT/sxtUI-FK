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
  function materialIntoFactory($rootScope, $scope, api, utils, $state, $stateParams, sxt, xhUtils, auth, $filter, remote,$q) {
    var vm = this;
    var user = auth.current();
    vm.data = {};
    vm.data.ApproachType = $stateParams.status == 1 ? 1 : 0;
    vm.outPutDate = new Date();
    vm.data.ApproachTime = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');
    //vm.data.MaterialPlanFiles = [];
    vm.vehicleImgs = [];
    vm.goodsImgs = [];
    vm.rummagerImgs = [];
    vm.CertificateImgs = [];
    vm.data.Inspector = user.Name;
    vm.data.IsPacking = true;
    var status = user.Role.MemberType == 0 ? 1 : 110;

    api.xhsc.materialPlan.getMaterialPlanDetail($stateParams.SectionId).then(function (q) {
      var data = q.data.Result.find(function (item) { return item.Id == $stateParams.BatchId });
      vm.data.Id = data.Id;
      vm.data.Unit = data.Unit;
      vm.data.PlanId = data.PlanId;
      vm.data.GroupId = sxt.uuid();
      vm.Brands = data.Brands.split(/、|,|，|；|;/) || [];
      if (vm.data.ApproachType == 1) {
        vm.data.Id = sxt.uuid();
      }

      api.xhsc.materialPlan.getMaterialBatchIntoFactory().then(function (r) {
        if (r.data && r.data.length > 0) {
          var _subCount = 0;
          r.data.forEach(function (e) {
            if (vm.data.PlanId == e.PlanId) {
              _subCount = parseFloat(e.ApproachCount) + _subCount;
            }
          });

          _subCount = data.PlanCount - _subCount;
          vm.data.ApproachCount = _subCount > 0 ? _subCount : 0;
        } else {
          vm.data.ApproachCount = parseFloat(data.PlanCount);
        }
      });
    });

    remote.offline.query().then(function (r) {
      var list = r.data.filter(function (item) {
        return item.planId == vm.data.PlanId;
      })
      list.forEach(function (item) {
        switch (item.type) {
          case 256: {
            photo2(item.Id, item.type, vm.vehicleImgs, item.img);
            break;
          }
          case 512: {
            photo2(item.Id, item.type, vm.goodsImgs, item.img);
            break;
          }
          case 1024: {
            photo2(item.Id, item.type, vm.rummagerImgs, item.img);
            break;
          }
          case 2048: {
            photo2(item.Id, item.type, vm.CertificateImgs, item.img);
            break;
          }
        }
      })
    })

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
      // if (vm.vehicleImgs.length == 0) {
      //   utils.alert('请上传至少一张车辆检查照片');
      //   return;
      // }
      // if (vm.rummagerImgs.length == 0) {
      //   utils.alert('请上传至少一张检查人照片');
      //   return;
      // }

      if (vm.goodsImgs.length == 0) {
        utils.alert('请上传至少一张货物检查照片');
        return;
      }

      if (vm.CertificateImgs.length == 0) {
        utils.alert('请上传至少一张合格证照片');
        return;
      }

      

      vm.Files = vm.vehicleImgs.concat(vm.goodsImgs, vm.rummagerImgs, vm.CertificateImgs);
      var q = [api.xhsc.materialPlan.IntoFactoryMaterialBatch(vm.data)];
      vm.Files.forEach(function (item) {
        q.push(api.xhsc.materialPlan.MaterialFile(item));
      })

      $q.all(q).then(function (r) {
        utils.alert("提交成功", null, function () {
          remote.offline.query().then(function (r) {
            var list = r.data.filter(function (item) {
              return item.planId == vm.data.PlanId;
            })

            list.forEach(function (item) {
              remote.offline.delete({ Id: item.Id });
            })

          })

          if (vm.data.ApproachType == 0) {
            api.xhsc.materialPlan.deleteMaterialPlanBatch(vm.data.Id);
          }

          $state.go("app.xhsc.materialys.materialdownload");
        });
      })
    });

    $scope.$on("$destroy", function () {
      sendgxResult();
      sendgxResult = null;
    });

    //删除图片操作
    $rootScope.$on('delete', function (data, index, id) {
      remote.offline.delete({ Id: id });
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

    function photo2(id, type, arr, image) {
      var _id = sxt.uuid();
      var img = {
        Id: id,
        //BatchId: $stateParams.BatchId,
        GroupId:vm.data.GroupId,
        OptionType: type,
        ApproachStage: 1,
        ImageName: _id + ".jpeg",
        ImageUrl: _id + ".jpeg",
        ImageByte: image
      }
      arr.push(img);
    }

    function photo(type, arr, image) {
      var _id = sxt.uuid();
      var img = {
        Id: sxt.uuid(),
        //BatchId: $stateParams.BatchId,
        GroupId:vm.data.GroupId,
        OptionType: type,
        ApproachStage: 1,
        ImageName: _id + ".jpeg",
        ImageUrl: _id + ".jpeg",
        ImageByte: image
      }
      arr.push(img);
      remote.offline.create({ Id: img.Id, planId: vm.data.PlanId, type: type, img: image });
    }
  }
})(angular, undefined);
