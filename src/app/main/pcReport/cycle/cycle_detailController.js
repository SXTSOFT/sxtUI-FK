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
    .module('app.pcReport_cycle')
    .controller('cycle_detailController',cycle_detailController);

  /**@ngInject*/
  function cycle_detailController($stateParams,remote,$rootScope,$scope,$state){
    var inspectionId=$stateParams.inspectionId;
    var vm=this;
    vm.selectSize=10;


    remote.report.getdetail('cycle',inspectionId).then(function (r) {
      vm.source=r.data;
      vm.source.first={};
      vm.source.Supervisions.sort(function (a,b) {
        return a.Time.localeCompare(a,b);
      })
      if (vm.source.Supervisions.length>0){
        vm.source.first=vm.source.Supervisions[vm.source.Supervisions.length-1];
      }

      vm.source.second={};
      vm.source.MainContractors.sort(function (a,b) {
        return a.Time.localeCompare(a,b);
      })
      if (vm.source.MainContractors.length>0){
        vm.source.second=vm.source.MainContractors[vm.source.MainContractors.length-1];
      }

      vm.source.third={};
      vm.source.Companys.sort(function (a,b) {
        return a.Time.localeCompare(a,b);
      })
      if (vm.source.Companys.length>0){
        vm.source.third=vm.source.Companys[vm.source.Companys.length-1];
      }
    })

    $rootScope.$on("goBack",function () {
      $state.go("app.pcReport_cycle_default.filter",{from:"app.pcReport_cycle_detail"});
    })

    $scope.$on("$destroy",function () {
      $rootScope.$$listeners.goBack=[];
    })
  }
})();
/**
 * Created by shaoshunliu on 2016/12/19.
 */
