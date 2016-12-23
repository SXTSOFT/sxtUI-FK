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
    .module('app.pcReport_week')
    .controller('week_detailController',week_detailController);

  /**@ngInject*/
  function week_detailController($stateParams,remote){
    var inspectionId=$stateParams.inspectionId;
    var vm=this;
    remote.report.getdetail('WeekInspects',inspectionId).then(function (r) {
      vm.source=r.data;
    })
  }
})();
/**
 * Created by shaoshunliu on 2016/12/19.
 */
