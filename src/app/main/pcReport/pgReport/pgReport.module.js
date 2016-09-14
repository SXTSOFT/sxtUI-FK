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
        url:'/pcReport_pg',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/pgReport/pgReportFilter.html',
            controller : 'pgReportFilterController as vm',
          }
        }
      })
      .state('app.pcReport_pg_default',{
        url:'/pcReport_pg_default/{year}/{quart}',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/pgReport/pgDefault.html',
            controller : 'pgDefaultController as vm',
          }
        }
      })
  }
})();
