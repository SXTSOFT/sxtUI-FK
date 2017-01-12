/**
 * Created by UUI on 2017/1/11.
 */

(function(){
  'use strict';

  angular
    .module('app.pcReport_pg')
    .controller('pgTrialController',pgTrialController);

  /**@ngInject*/
  function pgTrialController($scope,$stateParams,remote){
    var vm = this;
    var areaId=$stateParams.areaId;
    remote.report.getReportFormAssessmentTrial(areaId).then(function (d) {
      vm.source=d.data.Body;
      vm.loaded=true;
    });

  }
})();
