/**
 * Created by lss on 2016/8/16.
 */
/**
 * Created by jiuyuong on 2016/6/22.
 */
/**
 * Created by lss on 2016/8/16.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.xhsc.report',{
        url:'/report',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.report.default', {
        noBack:false,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '报表中心',
        url: '',
        templateUrl: 'app/main/xhsc/report/reportDefault.html',
        controller: 'reportDefault as vm'
      })
      .state('app.xhsc.report.ysReport', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '验收报表',
        url: '/{acceptanceItemID}',
        templateUrl: 'app/main/xhsc/report/ysReport.html',
        controller: 'ysReportController as vm'
      })
  }
})();
