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
    xhscService.getProfile().then(function (profile) {
      vm.role = profile.role;
      vm.OUType = profile.ouType;
      vm.loaded = true;
      vm.duties=profile.duties||[];


      var isJlorzb = (vm.role == "0" || vm.role == 0) || (vm.role == "2" || vm.role == 2)
      vm.yw=[
        {
          type:"zl",
          name:"质量",
          items:[
            {
              right: vm.duties.indexOf("1")>-1,
              type:"zl",
              title: "实测实量",
              img: "app/main/xhsc/images/application/scsl.svg",
              state: "app.xhsc.scsl.scslmain",
              stateParams: null
            }, {
              right: vm.duties.indexOf("2")>-1,
              type:"zl",
              title: "工序验收",
              img: "app/main/xhsc/images/application/gxys.svg",
              state: "app.xhsc.gx.gxmain",
              stateParams: null
            },
            {
              right: vm.duties.indexOf("2")>-1,
              title: "日常巡检",
              type:"zl",
              img: "app/main/xhsc/images/application/cycke.svg",
              state: "app.xhsc.xj.main",
              stateParams: null
            },
            {
              right: vm.OUType == 1 || vm.OUType == "1",
              title: "现场评估",
              type:"zl",
              img: "app/main/xhsc/images/application/xcpg.svg",
              state: "app.xhsc.download",
              stateParams: null
            },
            {
              right:vm.duties.indexOf("6")>-1,
              title: "移动验房",
              type:"zl",
              img: "app/main/xhsc/images/application/yf.svg",
              state: "app.xhsc.yf.Main",
              stateParams: null
            },
            {
              right:vm.duties.indexOf("4")>-1,
              title: "材料验收",
              type:"zl",
              img: "app/main/xhsc/images/application/material.svg",
              state: "app.xhsc.materialys.materialdownload",
              stateParams: null
            }
          ]
        },
        {
          type:"aq",
          name:"安全",
          items:[
            {
              right: vm.duties.indexOf("5")>-1,
              type:"aq",
              title: "安全验收",
              img: "app/main/xhsc/images/application/weekys.svg",
              state: "app.xhsc.sf.sfmain",
              stateParams: null
            },
            // {
            //   right: vm.duties.indexOf("5")>-1,
            //   type:"aq",
            //   title: "动态危险源",
            //   img: "app/main/xhsc/images/application/dyn.svg",
            //   state: "app.xhsc.dyn.sfDynamicMain",
            //   stateParams: null
            // },
            {
              right: vm.duties.indexOf("5")>-1,
              title: "周安全检查",
              type:"aq",
              img: "app/main/xhsc/images/application/weekjc.svg",
              state: "app.xhsc.week.sfWeekMain",
              stateParams: null
            }
          ]
        },{
          type:"jh",
          name:"计划",
          items:[
            {
              right:vm.duties.indexOf("7")>-1,
              title: "计划管理",
              type:"jh",
              img: "app/main/xhsc/images/application/plan.svg",
              state: "app.plan.personplan",
              stateParams: null
            }
          ]
        }
      ]
      vm.show=function (item) {
        return item.items.length&&item.items.some(function (k) {
            return k.right
          });
      }

      vm.click=function (item) {
        $state.go(item.state);
      }

    })
  }
})();
