/**
 * Created by lss on 2016/9/12.
 */
/**
 * Created by lss on 2016/8/16.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('pcReportMainController',pcReportMainController);

  /** @ngInject */
  function pcReportMainController(remote,$state,$q,utils,$mdDialog,$mdSidenav,$rootScope,api){
    var vm=this;
    api.setNetwork(0).then(function(){

    })
  }
})();
/**
 * Created by lss on 2016/10/8.
 */
