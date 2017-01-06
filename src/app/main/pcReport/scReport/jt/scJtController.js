/**
 * Created by shaoshun on 2017/1/5.
 */
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
    .module('app.pcReport_sl')
    .controller('scJtController',scJtController);

  /**@ngInject*/
  function scJtController($scope,remote,$mdDialog,$state,$stateParams,$rootScope,$timeout,$window){
    var vm = this;
    var areadId=$stateParams.areaId;
    remote.report.getReportFormMeasure(areadId).then(function (d) {
      vm.source=d.data;
      wrap(vm.source);
      vm.loaded=true;
      if (!vm.source.Heads.length){
        vm.isShowbg=true;
      }
    });

    function wrap(source) {
      var data=source&&source.Row?source.Row:null;
      if (angular.isArray(data)){
        var index=1;
        source.rows=[];
        data.forEach(function (k) {
          k.num=index;
          k.isGroup=true;
          source.rows.push(k);
          var _index=1;
          k.Children.forEach(function (n) {
            n.num=index+"."+_index;
            source.rows.push(n);
            _index++;
          });
          index++;
        });
      }
    }
  }
})();
