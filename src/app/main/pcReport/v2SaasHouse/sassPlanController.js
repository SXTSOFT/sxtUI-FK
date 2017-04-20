/**
 * Created by shaoshunliu on 2017/4/19.
 */
(function(){
  'use strict';
  angular
    .module('app.pcReport_v2Sass')
    .controller('v2SassPlanController',v2SassPlanController);

  /**@ngInject*/
  function v2SassPlanController($scope,remote,$mdDialog,$stateParams,$state,$rootScope ,$q,$window){
    var vm = this;
    vm.open=function (flag) {
      switch (flag){
        case "summary":
          $window.open("app/main/pcReport/v2SaasHouse/summaryReport.html")
          break;
        case "daily":
          $window.open("app/main/pcReport/v2SaasHouse/dailyReport.html")
          break;
      }

    };
  }
})();
