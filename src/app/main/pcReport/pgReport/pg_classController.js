/**
 * Created by UUI on 2017/1/9.
 */

(function(){
  'use strict';

  angular
    .module('app.pcReport_pg')
    .controller('pgClassController',pgClassController);

  /**@ngInject*/
  function pgClassController($scope,$stateParams,remote){
    var vm = this;
    var quarter=$stateParams.quarter;
    remote.report.getReportFormAssessmentClass(quarter).then(function (d) {
      vm.source=d.data;
      wrap(vm.source);
      vm.loaded=true;
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
