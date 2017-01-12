/**
 * Created by UUI on 2017/1/11.
 */

(function(){
  'use strict';

  angular
    .module('app.pcReport_pg')
    .controller('pgRateController',pgRateController);

  /**@ngInject*/
  function pgRateController($scope,$stateParams,remote){
    var vm = this;
    var areaId=$stateParams.areaId;
    remote.report.getReportFormAssessmentRate(areaId).then(function (d) {
      vm.source=d.data;
      wrap(vm.source);
      vm.loaded=true;
      if (!vm.source.Heads.length){
        vm.isShowbg=true;
      }

    });


    function wrap(source) {
      source.subTitle = [];
      if (source.Heads) {
        source.Heads.forEach(function (k) {
          k.Sub.forEach(function (n) {
            source.subTitle.push(n);
          });
        });

      }
    }
  }
})();
