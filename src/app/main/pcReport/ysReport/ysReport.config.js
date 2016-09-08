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
          template:'<ui-view flex layout="column"></ui-view>',
          templateUrl: 'app/main/pcReport/ysReport/gxysReport.html',
          controller : 'gxysReportController as vm',
        }
      }
    })
  }
})();
