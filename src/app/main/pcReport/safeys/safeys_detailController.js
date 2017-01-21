/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_safeys')
    .controller('safeys_detailController',safeys_detailController);

  /**@ngInject*/
  function safeys_detailController($stateParams,remote,$rootScope,$scope,$state,xhUtils){
    var inspectionId=$stateParams.inspectionId;
    var vm=this;
    vm.showImg=function (img) {
      img.url = img.FileContent||img.Url;
      img.alt = ' ';
      xhUtils.playPhoto([img]);
    }
    remote.report.getdetail('Acceptances',inspectionId).then(function (r) {
      vm.source=r.data;
      //报验信息
      vm.source.mainContractorsItem={};
      vm.source.MainContractors.sort(function (a,b) {
        if (!a.Time){
          return true;
        }
        return a.Time.localeCompare(a,b);
      })
      if (vm.source.MainContractors.length>0){
        vm.source.mainContractorsItem=vm.source.MainContractors[0];
      }

      //验收信息
      vm.source.supervisionsItem={};
      vm.source.Supervisions.sort(function (a,b) {
        if (!a.Time){
          return true;
        }
        return a.Time.localeCompare(a,b);
      })
      if (vm.source.Supervisions.length>0){
        vm.source.supervisionsItem=vm.source.Supervisions[vm.source.Supervisions.length-1];
      }
      //复验信息
      vm.source.reviewsItem={};
      vm.source.Reviews.sort(function (a,b) {
        if (!a.Time){
          return true;
        }
        return a.Time.localeCompare(a,b);
      })
      if (vm.source.Reviews.length>0){
        vm.source.reviewsItem=vm.source.Reviews[vm.source.Reviews.length-1];
      }

      //整改信息
      vm.source.rectifysItem={};
      vm.source.Rectifys.sort(function (a,b) {
        if (!a.Time){
          return true;
        }
        return a.Time.localeCompare(a,b);
      })

      if (vm.source.Rectifys.length>0){
        vm.source.rectifysItem=vm.source.Rectifys[vm.source.Rectifys.length-1];
      }
      vm.up=function (item) {
        item.up=!item.up;
      }
      //建设单位
      vm.source.companysItem={};
      vm.source.Companys.sort(function (a,b) {
        if (!a.Time){
          return true;
        }
        return a.Time.localeCompare(a,b);
      })
      if (vm.source.Companys.length>0){
        vm.source.companysItem=vm.source.Companys[vm.source.Companys.length-1];
      }
    })

    $rootScope.$on("goBack",function () {
      $state.go("app.pcReport_safeys_default.filter",{from:"app.pcReport_safeys_detail"});
    })

    $scope.$on("$destroy",function () {
      $rootScope.$$listeners.goBack=[];
    })
  }
})();
