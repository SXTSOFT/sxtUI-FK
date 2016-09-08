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
  module('app.pcReport.ysReport',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_ysReport',{
      url:'/report',
      abstract:true,
      views:{
        'content@app':{
          template:'<ui-view flex layout="column"></ui-view>'
        }
      }
    })
    .state('app.pcReport_ysReport_gxysReport',{
      url:'',
      templateUrl: 'app/main/pcReport/ysReport/gxysReport.html',
      controller: 'gxysReportController as vm'
    })
  }
})();
