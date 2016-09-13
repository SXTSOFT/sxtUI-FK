/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by lss on 2016/9/8.
 */
(function ()
{
  'use strict';
  angular.
    module('app.pcReport_sc',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_sl_sc',{
        url:'/pcReport_sl_sc',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/ysReport/scslFilter.html',
            controller : 'scslFilterController as vm',
          }
        }
      })
      .state('app.pcReport_sl_rp',{
        url:'/pcReport_sl_rp',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/ysReport/scslReport.html',
            controller : 'scslReportController as vm',
          }
        }
      })
  }
})();
