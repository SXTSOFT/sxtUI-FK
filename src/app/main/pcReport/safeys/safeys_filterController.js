
/**
 * Created by lss on 2016/9/13.
 */

(function(){
  'use strict';

  angular
    .module('app.pcReport_safeys')
    .controller('safeys_filterController',safeys_filterController);

  /**@ngInject*/
  function safeys_filterController($state,$stateParams,remote,$scope,$timeout,xhscService,$rootScope,sxtlocaStorage){
    var vm=this;
    var mobileDetect = new MobileDetect(window.navigator.userAgent);
    vm.isMobile=mobileDetect.mobile();
    vm.isiPad=mobileDetect.mobile()=="iPad";
    vm.display=true;

    var params= sxtlocaStorage.getObj("safeys_params")
    $scope.core=params?params:{};
    if ($scope.core.minDate){
      $scope.core.minDate=new Date($scope.core.minDate)
    }
    if($scope.core.maxDate){
      $scope.core.maxDate=new Date($scope.core.maxDate);
    }



    if (vm.isMobile&&vm.isiPad||!vm.isMobile){
      pc($scope,sxtlocaStorage,$rootScope,$timeout,$state);
    }else {
      mobile($scope,$stateParams,vm,$rootScope,$state,sxtlocaStorage)
    }
    xhscService.getRegionTreeOffline("",3,1).then(function (r) {
      $scope.projects=r;
    });

    $scope.$on("$destroy",function () {
      $rootScope.$$listeners.goBack=[];
    })

  }



  function pc($scope,sxtlocaStorage,$rootScope,$timeout,$state) {

    $scope.$watch("core.minDate",function (v,o) {
      if (v){
        var params= sxtlocaStorage.getObj("safeys_params");
        if (!params){
          params={};
        }
        params.minDate=v;
        sxtlocaStorage.setObj("safeys_params",params);
        if (!$scope.isbusy){
          $rootScope.$emit("filter");
        }
        $timeout(function () {
          $scope.isbusy=false;
        },500)
      }
    },true)

    $scope.$watch("core.maxDate",function (v,o) {
      if (v){
        var params= sxtlocaStorage.getObj("safeys_params");
        if (!params){
          params={};
        }
        params.maxDate=v;
        sxtlocaStorage.setObj("safeys_params",params);
        if (!$scope.isbusy){
          $rootScope.$emit("filter");
        }
        $timeout(function () {
          $scope.isbusy=false;
        },500)
      }
    },true)

    $scope.$watch("core.currentArea",function (v,o) {
      if (v){
        var params= sxtlocaStorage.getObj("safeys_params");
        if (!params){
          params={};
        }
        params.currentArea=v;
        sxtlocaStorage.setObj("safeys_params",params);
        if (!$scope.isbusy){
          $rootScope.$emit("filter");
        }
        $timeout(function () {
          $scope.isbusy=false;
        },500)
      }
    },true)

    $scope.$watch("core.currentProject",function (v,o) {
      if (v){
        var params= sxtlocaStorage.getObj("safeys_params");
        if (!params){
          params={};
        }
        params.currentProject=v;
        sxtlocaStorage.setObj("safeys_params",params);
        if (!$scope.isbusy){
          $rootScope.$emit("filter");
        }
        $timeout(function () {
          $scope.isbusy=false;
        },500)
      }
    },true)


    $rootScope.$on("goBack",function () {
      $state.go("app.pcReport_main");
    })
  }


  function mobile($scope,$stateParams,vm,$rootScope,$state,sxtlocaStorage) {
    var from=$stateParams.from;
    $scope.ok=function () {
      vm.display=false;
      $rootScope.$emit("filter");
    }
    //详细里面返回
    if (from=="app.pcReport_safeys_detail"){
      vm.display=false;
      //展示明细
      $rootScope.$emit("show");
    }else {
      vm.display=true;

      $scope.$watch("core.minDate",function (v,o) {
        if (v){
          var params= sxtlocaStorage.getObj("safeys_params");
          if (!params){
            params={};
          }
          params.minDate=v;
          sxtlocaStorage.setObj("safeys_params",params);
        }
      },true)

      $scope.$watch("core.maxDate",function (v,o) {
        if (v){
          var params= sxtlocaStorage.getObj("safeys_params");
          if (!params){
            params={};
          }
          params.maxDate=v;
          sxtlocaStorage.setObj("safeys_params",params);
        }
      },true)

      $scope.$watch("core.currentArea",function (v,o) {
        if (v){
          var params= sxtlocaStorage.getObj("safeys_params");
          if (!params){
            params={};
          }
          params.currentArea=v;
          sxtlocaStorage.setObj("safeys_params",params);
        }
      },true)

      $scope.$watch("core.currentProject",function (v,o) {
        if (v){
          var params= sxtlocaStorage.getObj("safeys_params");
          if (!params){
            params={};
          }
          params.currentProject=v;
          sxtlocaStorage.setObj("safeys_params",params);
        }
      },true)
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
