/**
 * Created by lss on 2016/9/14.
 */
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
    module('app.pcReport_pg',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_pg',{
        title:"现场评估报表",
        url:'/pcReport_pg',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/pgReport/pgReportFilter.html',
            controller : 'pgReportFilterController as vm',
          }
        }
      })
      .state('app.pcReport_pg_default',{
        url:'/pcReport_pg_default/{year}/{quart}',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/pgReport/pgDefault.html',
            controller : 'pgDefaultController as vm',
          }
        }
      })
      .state('app.pcReport_pg_pkresult',{
        noBack:true,
        sendBt:false,
        url:'/pkresult/{year}/{projectID}/{quarter}/{assessmentStage}',
        views :{
          'content@app':{
            templateUrl : 'app/main/pcReport/pgReport/pchz.html',
            controller:'pchzController as vm'
          }
        }
      })
      .state('app.pcReport_pg_scRegion',{
        noBack:true,
        sendBt:false,
        url:'/scRegion/{year}/{projectID}/{quarter}/{assessmentStage}',
        views :{
          'content@app':{
            templateUrl : 'app/main/pcReport/pgReport/scRegion.html',
            controller:'pgScRegionController as vm'
          }
        }
      })
  }
})();
