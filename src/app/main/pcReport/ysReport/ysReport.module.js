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
      title:"工序验收报表",
      url:'/pcReport_ys_gx',
      noBack:true,
      sendBt:false,
      views:{
        'content@app':{
          templateUrl: 'app/main/pcReport/ysReport/gxysFilter.html',
          controller : 'gxysFilterController as vm',
        }
      }
    })
    .state('app.pcReport_ys_rp',{
      noBack:true,
      sendBt:false,
      url:'/pcReport_ys_rp',
      views:{
        'content@app':{
          templateUrl: 'app/main/pcReport/ysReport/gxysReport.html',
          controller : 'gxysReportController as vm',
        }
      }
    })
      .state('app.pcReport_ys_hz',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_ys_hz/{areaId}',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/ysReport/hzProblem/hzProblem.html',
            controller : 'hzProblemController as vm',
          }
        }
      })
  }
})();
