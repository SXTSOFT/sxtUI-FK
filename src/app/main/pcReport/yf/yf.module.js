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
  module('app.pcReport_yf',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_yf_default',{
        title:"移动验房",
        url:'/pcReport_yf_default',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/yf/yf_default.html',
            controller : 'yf_defaultController as vm',
          }
        }
      })
      .state('app.pcReport_yf_detail',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_yf_detail/{regionId}/{inspectionId}',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/yf/yf_detail.html',
            controller : 'yf_detailController as vm',
          }
        }
      })
  }
})();
