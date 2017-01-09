/**
 * Created by UUI on 2017/1/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_pg')
    .controller('pgJlController',pgJlController);

  /**@ngInject*/
  function pgJlController($scope,$stateParams,remote){
    var vm = this;
    var quarter=$stateParams.quarter;
    remote.report.getReportFormAssessmentJl(quarter).then(function (d) {
      vm.source=d.data;
      vm.loaded=true;
    });

  }
})();
