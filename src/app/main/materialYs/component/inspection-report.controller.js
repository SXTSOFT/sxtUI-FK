/**
 * Created by 陆科桦 on 2016/10/27.
 */

(function (angular,undefined) {
  'use strict';
  angular
    .module('app.xhsc')
    .component('materialYsInspectionReport',{
      templateUrl:'app/main/materialYs/component/inspection-report.html',
      controller:inspectionReport,
      controllerAs:'vm'
    });

  /** @ngInject */
  function inspectionReport($rootScope,$scope,api,utils,$stateParams){
    var vm = this;
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.ReportTime = new Date().Format('yyyy年MM月dd日');
    vm.data.LabCheck = true;

    $scope.$on("$destroy",function(){
      sendReportResult();
      sendReportResult = null;
    });

    var sendReportResult = $rootScope.$on('sendGxResult',function() {
      api.xhsc.materialPlan.PostReportInfo(vm.data).then(function (r) {
        utils.alert('提交成功!');
      })
    });
  }
})(angular,undefined);
