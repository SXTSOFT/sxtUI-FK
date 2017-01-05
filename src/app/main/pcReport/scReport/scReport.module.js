/**
 * Created by lss on 2016/9/13.
 */

(function ()
{
  'use strict';
  angular.
    module('app.pcReport_sl',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_sl_sc',{
        title:"实测实量报表",
        url:'/pcReport_sl_sc',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/scReport/scslFilter.html',
            controller : 'scslFilterController as vm',
          }
        }
      })
      .state('app.pcReport_sl_rp',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_sl_rp/{scSelected}/{secSelected}',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/scReport/scslReport.html',
            controller : 'scslReportController as vm',
          }
        }
      })
      .state('app.pcReport_sl_jt',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_sl_jt',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/scReport/jt/scJt.html',
            controller : 'scJtController as vm',
          }
        }
      })
      .state('app.pcReport_sl_project',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_sl_project',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/scReport/project/scProject.html',
            controller : 'scProjectController as vm',
          }
        }
      })
      .state('app.pcReport_sl_building',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_sl_building',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/scReport/building/scBuilding.html',
            controller : 'scBuildingController as vm',
          }
        }
      })
  }
})();
