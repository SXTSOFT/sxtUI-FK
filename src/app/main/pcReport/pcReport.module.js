/**
 * Created by lss on 2016/9/8.
 */
(function ()
{
  'use strict';

  angular
    .module('app.pcReport', ['app.pcReport_sl','app.pcReport_ys','app.pcReport_pg'])
    .config(config);
  /** @ngInject */
  function config(msNavigationServiceProvider,$stateProvider,$mdIconProvider)
  {
    $stateProvider
      .state('app.pcReport_hz',{
        url:'/pcReport_hz',
        views:{
          'content@app':{
            templateUrl: 'app/main/pcReport/hzReport.html',
            controller : 'hzReportController as vm',
          }
        }
      })
    // Navigation
    msNavigationServiceProvider.saveItem('xh', {
      title : '星河集团',
      group : true,
      weight: 1
    });
    msNavigationServiceProvider.saveItem('xh.pcenter', {
      title: '主页',
      state: 'app.xhsc.home',
      icon:'icon-account',
      weight:1
    });

    msNavigationServiceProvider.saveItem('xh.ysReport', {
      title: '验收',
      icon : 'icon-poll',
      weight:1
    });
    msNavigationServiceProvider.saveItem('xh.ysReport.yshzReport', {
      title: '汇总报表',
      state: 'app.pcReport_hz',
      weight:1
    });

    msNavigationServiceProvider.saveItem('xh.ysReport.gxysReport', {
      title: '工序验收报表',
      state: 'app.pcReport_ys_gx',
      weight:2
    });

    msNavigationServiceProvider.saveItem('xh.ysReport.scslReport', {
      title: '实测实量报表',
      state: 'app.pcReport_sl_sc',
      weight:3
    });

    msNavigationServiceProvider.saveItem('xh.pgReport', {
      title: '评估',
      icon  : 'icon-tile-four',
      weight:2
    });
    msNavigationServiceProvider.saveItem('xh.pgReport.xcpgReport', {
      title: '现场评估',
      weight:1,
      state:'app.pcReport_pg'
    });
  }
})();
