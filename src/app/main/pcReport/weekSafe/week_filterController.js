
/**
 * Created by lss on 2016/9/13.
 */

(function(){
  'use strict';

  angular
    .module('app.pcReport_week')
    .controller('week_filterController',week_filterController);

  /**@ngInject*/
  function week_filterController($state,$stateParams,remote,$scope,xhscService,$rootScope,sxtlocaStorage){
    var vm=this;
    var mobileDetect = new MobileDetect(window.navigator.userAgent);
    vm.isMobile=mobileDetect.mobile();
    vm.isiPad=mobileDetect.mobile()=="iPad";
    vm.display=true;
    if (vm.isMobile&&vm.isiPad||!vm.isMobile){
      pc($scope,sxtlocaStorage,$rootScope);
    }else {
      mobile($scope,$stateParams,vm,$rootScope)
    }


    // function init() {
    //   remoteParams();
    //   if (from=="app.pcReport_week_detail"){
    //     $scope.ok();
    //   }
    //   load()
    // }
    // //初始化页面
    // init();
    //
    // function remoteParams() {
    //   var params= sxtlocaStorage.getObj("week_params");
    //   if(params){
    //     $scope.myDate = new Date();
    //     $scope.minDate=params.minDate;
    //     if (!$scope.minDate){
    //       $scope.minDate = new Date(
    //         $scope.myDate.getFullYear(),
    //         $scope.myDate.getMonth() - 1,
    //         $scope.myDate.getDate());
    //     }
    //     $scope.maxDate=params.maxDate;
    //     if (!$scope.maxDate){
    //       $scope.maxDate = new Date(
    //         $scope.myDate.getFullYear(),
    //         $scope.myDate.getMonth() + 1,
    //         $scope.myDate.getDate());
    //     }
    //     $scope.currentProject=params.currentProject;
    //     $scope.currentArea=params.currentArea;
    //   }
    // }
    //
    //
    // //加载数据
    // function load() {
    //   xhscService.getRegionTreeOffline("",3,1).then(function (r) {
    //     $scope.projects=r;
    //   });
    // }

    $scope.$on("$destroy",function () {
      $rootScope.$$listeners.goBack=[];
    })

  }



  function pc($scope,sxtlocaStorage,$rootScope) {


    $scope.$watch("minDate",function (v) {
      if (v){
        var params= sxtlocaStorage.getObj("week_params");
        if (!params){
          params={};
        }
        params.minDate=v;
        sxtlocaStorage.setObj("week_params",params);
      }
    })

    $scope.$watch("maxDate",function (v) {
      if (v){
        var params= sxtlocaStorage.getObj("week_params");
        if (!params){
          params={};
        }
        params.maxDate=v;
        sxtlocaStorage.setObj("week_params",params);
      }
    })

    $scope.$watch("currentArea",function (v) {
      if (v){
        var params= sxtlocaStorage.getObj("week_params");
        if (!params){
          params={};
        }
        params.currentArea=v;
        sxtlocaStorage.setObj("week_params",params);
      }
    })

    $scope.$watch("currentProject",function (v) {
      if (v){
        var params= sxtlocaStorage.getObj("week_params");
        if (!params){
          params={};
        }
        params.currentProject=v;
        sxtlocaStorage.setObj("week_params",params);
      }
    })

    $rootScope.$on("goBack",function () {
      $state.go("app.pcReport_main");
    });
  }


  function mobile($scope,$stateParams,vm,$rootScope) {
    var from=$stateParams.from;
    //详细里面返回
    if (from=="app.pcReport_week_detail"){
      vm.display=false;
      //展示明细
      $rootScope.$emit("filter");
    }else {
      vm.display=true;
      $scope.ok=function () {
        vm.display=false;
        $rootScope.$emit("filter");
      }

      $scope.$watch("minDate",function (v) {
        if (v){
          var params= sxtlocaStorage.getObj("week_params");
          if (!params){
            params={};
          }
          params.minDate=v;
          sxtlocaStorage.setObj("week_params",params);
        }
      })

      $scope.$watch("maxDate",function (v) {
        if (v){
          var params= sxtlocaStorage.getObj("week_params");
          if (!params){
            params={};
          }
          params.maxDate=v;
          sxtlocaStorage.setObj("week_params",params);
        }
      })

      $scope.$watch("currentArea",function (v) {
        if (v){
          var params= sxtlocaStorage.getObj("week_params");
          if (!params){
            params={};
          }
          params.currentArea=v;
          sxtlocaStorage.setObj("week_params",params);
        }
      })

      $scope.$watch("currentProject",function (v) {
        if (v){
          var params= sxtlocaStorage.getObj("week_params");
          if (!params){
            params={};
          }
          params.currentProject=v;
          sxtlocaStorage.setObj("week_params",params);
        }
      })
    }
    //返回按钮
    $rootScope.$on("goBack",function () {
      if (vm.display){
        $state.go("app.pcReport_main");
      }else {
        vm.display=true;
        $rootScope.$emit("hide")
      }
    })

  }

})();
/**
 * Created by shaoshunliu on 2016/12/19.
 */
