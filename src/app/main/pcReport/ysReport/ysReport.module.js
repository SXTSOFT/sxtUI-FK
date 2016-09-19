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
  module('app.pcReport_ys',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
    .state('app.pcReport_ys_gx',{
      url:'/pcReport_ys_gx',
      views:{
        'content@app':{
          templateUrl: 'app/main/pcReport/ysReport/gxysFilter.html',
          controller : 'gxysFilterController as vm',
        }
      }
    })
    .state('app.pcReport_ys_rp',{
      url:'/pcReport_ys_rp',
      views:{
        'content@app':{
          templateUrl: 'app/main/pcReport/ysReport/gxysReport.html',
          controller : 'gxysReportController as vm',
        }
      }
    })
  }
})();
