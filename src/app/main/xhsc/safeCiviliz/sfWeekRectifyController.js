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
    vm.role = $state.params.Role;
    vm.InspectionID = $state.params.InspectionID;

    remote.safe.getRectifications.cfgSet({
      offline:true,
      filter:function (item) {
        return item.InspectionExtendID==vm.InspectionID;
      }
    })("WeekInspects").then(function (r) {
      var bacth=angular.isArray(r.data)?r.data[0]:null;
      vm.pareaList=[];
      if (bacth){
        bacth.Rectifications.forEach(function (k) {
            if (k.Children){
              k.Children.forEach(function (m) {
                if (!vm.pareaList.some(function (z) {
                    return z.AreaID==m.AreaID;
                  }))
                vm.pareaList.push(m);
              })
            }
        });
        if (vm.pareaList.length>0){
          vm.regionSelect = vm.pareaList[0];
          vm.regionSelect.hasCheck = true;
          vm.AcceptanceItemName=vm.regionSelect.AcceptanceItemName;
          vm.warter = vm.regionSelect.RegionName + bacth.Describe;;
        }
      }
    });

    api.setNetwork(1).then(function () {

      vm.info = {}

      vm.selectQy = function (item) {
        vm.regionSelect = item;
        vm.regionSelect.hasCheck = true;
        vm.AcceptanceItemID=item.AcceptanceItemID;
        vm.AcceptanceItemName=item.AcceptanceItemName;
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
        utils.alert('提交成功，请稍后离线上传数据',null,function () {
          $state.go("app.xhsc.week.sfWeekMain");
        });
      });

      $scope.$on('$destroy', function () {
        gxzgChanged();
        gxzgChanged = null;
      })
    });
  }
})();
