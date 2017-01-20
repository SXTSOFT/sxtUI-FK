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
  module('app.pcReport_safeys',[])
    .config(config);
  /** @ngInject */
  function config($stateProvider)
  {
    $stateProvider
      .state('app.pcReport_safeys_default',{
        title:"安全验收报表",
        url:'/pcReport_safeys_default/{display}',
        noBack:true,
        sendBt:false,
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/safeys/safeys_default.html',
            controller : 'safeys_defaultController as vm',
          }
        }
      })
      .state('app.pcReport_safeys_detail',{
        noBack:true,
        sendBt:false,
        url:'/pcReport_safeys_detail/{regionId}/{inspectionId}',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/safeys/safeys_detail.html',
            controller : 'safeys_detailController as vm',
          }
        }
      })
      .state('app.pcReport_safeys_default.filter',{
        noBack:true,
        title:"安全验收报表",
        // sendBt:false,
        url:'/pcReport_safeys_default/filter/{from}',
        templateUrl: 'app/main/pcReport/safeys/safeys_filter.html',
        controller: 'safeys_filterController as vm'
      })
  }
})();
