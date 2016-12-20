/**
 * Created by shaoshunliu on 2016/12/19.
 */

(function ()
{
  'use strict';
  angular.
  module('app.pcReport_cycle',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_cycle_default',{
        title:"移动验房",
        url:'/pcReport_cycle_default',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/cycle/cycle_default.html',
            controller : 'cycle_defaultController as vm',
          }
        }
      })
      .state('app.pcReport_cycle_detail',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_cycle_detail/{regionId}/{inspectionId}',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/cycle/cycle_detail.html',
            controller : 'cycle_detailController as vm',
          }
        }
      })
  }
})();
