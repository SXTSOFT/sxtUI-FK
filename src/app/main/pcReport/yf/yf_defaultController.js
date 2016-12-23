/**
 * Created by shaoshunliu on 2016/12/19.
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
    .module('app.pcReport_yf')
    .controller('yf_defaultController',yf_defaultController);

  /**@ngInject*/
  function yf_defaultController($state,remote){
     var vm=this;

      remote.report.getWrapList('house').then(function (r) {
        vm.source=r.data

      })

      vm.go=function (item) {
        $state.go("app.pcReport_yf_detail",{regionId:item.AreaID,inspectionId:item.InspectionID});
      }
  }
})();
