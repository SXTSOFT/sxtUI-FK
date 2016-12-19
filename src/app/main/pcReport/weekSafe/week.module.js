/**
 * Created by shaoshunliu on 2016/12/19.
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
  module('app.pcReport_week',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_week_default',{
        title:"移动验房",
        url:'/pcReport_week_default',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/weekSafe/week_default.html',
            controller : 'week_defaultController as vm',
          }
        }
      })
      .state('app.pcReport_week_detail',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_week_detail',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/weekSafe/week_detail.html',
            controller : 'week_detailController as vm',
          }
        }
      })
  }
})();
