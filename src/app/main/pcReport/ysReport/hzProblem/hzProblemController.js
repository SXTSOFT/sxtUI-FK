/**
 * Created by shaoshun on 2017/1/5.
 */
/**
 * Created by lss on 2016/9/12.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_ys')
    .controller('hzProblemController',hzProblemController);

  /**@ngInject*/
  function hzProblemController($scope,$stateParams,remote){
    var vm = this;
    var areadId=$stateParams.areaId;
    remote.report.getReportFormInspection(areadId).then(function (d) {
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

        if (source.Row){
          var index=1;
          source.Row.forEach(function (k) {
            k.num=index++;
          });
        }
      }
    }
  }
})();
