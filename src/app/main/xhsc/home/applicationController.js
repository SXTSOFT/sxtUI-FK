/**
 * Created by shaoshunliu on 2016/11/20.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('applicationController', applicationController);

  /** @ngInject */
  function applicationController($scope, remote, $timeout, $q, xhscService,$state) {
    var vm = this
    var apps = [];
    xhscService.getRegionTreeOffline("", 31, 1).then(function (r) {
      vm.regions=r;
    })


    xhscService.getProfile().then(function (profile) {
      vm.role = profile.role;
      vm.OUType = profile.ouType;
      vm.loaded = true;
      var isJlorzb = (vm.role == "0" || vm.role == 0) || (vm.role == "2" || vm.role == 2)
      vm.yw = [
        {
          right: true,
          title: "实测实量",
          img: "app/main/xhsc/images/application/scsl.svg",
          state: "app.xhsc.scsl.scslmain",
          stateParams: null
        }, {
          right: isJlorzb,
          title: "工序验收",
          img: "app/main/xhsc/images/application/gxys.svg",
          state: "app.xhsc.gx.gxmain",
          stateParams: null
        }, {
          right: isJlorzb,
          title: "安全验收",
          img: "app/main/xhsc/images/application/weekys.svg",
          state: "app.xhsc.sf.sfmain",
          stateParams: null
        }, {
          right: isJlorzb,
          title: "动态危险源",
          img: "app/main/xhsc/images/application/dyn.svg",
          state: "app.xhsc.dyn.sfDynamicMain",
          stateParams: null
        },{
          right: isJlorzb,
          title: "周安全检查",
          img: "app/main/xhsc/images/application/weekjc.svg",
          state: "app.xhsc.week.sfWeekMain",
          stateParams: null
        },{
          right: isJlorzb,
          title: "日常巡检",
          img: "app/main/xhsc/images/application/cycke.svg",
          state: "app.xhsc.xj.main",
          stateParams: null
        }, {
          right: vm.OUType == 1 || vm.OUType == "1",
          title: "现场评估",
          img: "app/main/xhsc/images/application/xcpg.svg",
          state: "app.xhsc.download",
          stateParams: null
        }, {
          title: "安全验房",
          img: "app/main/xhsc/images/application/yf.svg",
          state: "app.xhsc.yf.Main",
          stateParams: null
        }
      ];

      vm.click=function (item) {
        $state.go(item.state);
      }

    })
  }
})();
