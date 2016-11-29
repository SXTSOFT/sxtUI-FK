/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sfWeekRectifyController', sfWeekRectifyController);

  /** @ngInject */
  function sfWeekRectifyController($state, $rootScope, $scope, $mdDialog, remote, $timeout, $q, utils, xhUtils, api) {
    var vm = this;
    $rootScope.title = $state.params.Role == 'zb' ? '整改' : '复验';
    vm.ProjectID = $state.params.ProjectID;
    vm.AcceptanceItemID = $state.params.AcceptanceItemID;
    vm.AcceptanceItemName = $state.params.AcceptanceItemName ? $state.params.AcceptanceItemName : "";
    vm.role = $state.params.Role;
    vm.InspectionID = $state.params.InspectionID;
    vm.RectificationID = $state.params.RectificationID;
    api.setNetwork(1).then(function () {
      remote.safe.getRectificationSingle(vm.RectificationID).then(function (r) {
        vm.Rectification = r.data[0];
        vm.pareaList = vm.Rectification.Children;
        vm.regionSelect = vm.pareaList[0];
        vm.warter = vm.regionSelect.RegionName + (vm.AcceptanceItemName ? '(' + vm.AcceptanceItemName + ')' : "");
        vm.regionSelect.hasCheck = true;
      });

      vm.info = {}
      function load() {
        if (!vm.regionSelect) {
          return;
        }
      }
      vm.selectQy = function (item) {
        vm.regionSelect = item;
        vm.regionSelect.hasCheck = true;
        vm.warter = vm.regionSelect.RegionName + (vm.AcceptanceItemName ? '(' + vm.AcceptanceItemName + ')' : "");
        vm.qyslideShow = false;
      }
      vm.qyslide = function () {
        vm.qyslideShow = !vm.qyslideShow;
      }
      $scope.times = xhUtils.zgDays();
      var gxzgChanged = $rootScope.$on('sendGxResult', function () {
        var msg = [];
        vm.pareaList.forEach(function (r) {
          if (!r.hasCheck) {
            msg.push(r.RegionName);
          }
        });
        if (msg.length) {
          utils.alert(msg.join(",") + '尚未查看!');
          return;
        };

        utils.alert('提交成功，请离线上传数据',null,function () {
          $state.go("app.xhsc.sf.sfWeekMain");
        });
      });

      $scope.$on('$destroy', function () {
        gxzgChanged();
        gxzgChanged = null;
      })
    });
  }
})();
