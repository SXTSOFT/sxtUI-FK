/**
 * Created by shaoshunliu on 2017/4/19.
 */
/**
 * Created by lss on 2016/9/13.
 */

(function ()
{
  'use strict';
  angular.
  module('app.pcReport_v2Sass',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_v2Sass_plan',{
        title:"内部验房",
        url:'/pcReport_v2Sass_plan',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/v2SaasHouse/sassPlan.html',
            controller : 'v2SassPlanController as vm',
          }
        }
      })
      // .state('app.pcReport_sl_rp',{
      //   noBack:true,
      //   sendBt:false,
      //   url:'/pcReport_sl_rp/{scSelected}/{secSelected}',
      //   views:{
      //     'content@app':{
      //       templateUrl: 'app/main/pcReport/scReport/scslReport.html',
      //       controller : 'scslReportController as vm',
      //     }
      //   }
      // })
      // .state('app.pcReport_sl_jt',{
      //   noBack:true,
      //   sendBt:false,
      //   url:'/pcReport_sl_jt/{areaId}',
      //   views:{
      //     'content@app':{
      //       templateUrl: 'app/main/pcReport/scReport/jt/scJt.html',
      //       controller : 'scJtController as vm',
      //     }
      //   }
      // })
  }
})();
