/**
 * Created by jiuyuong on 2016/1/21.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider,authProvider)
  {


    // State
    $stateProvider
      .state('app.szgc', {
        abstract:true
      })
      .state('app.szgc.home',{
        url   :'/',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/home.html',
            controller:'SzgcHomeController as vm'
          }
        }
      })
      .state('app.szgc.report', {
        url      : '/report',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/report.html',
            controller: 'SzgcReportController as vm'
          }
        }
      });

    // Translation
    //$translatePartialLoaderProvider.addPart('app/main/auth');

    // Navigation
    msNavigationServiceProvider.saveItem('szgc', {
      title : '数字工程',
      group : true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('szgc.home', {
      title    : '首页',
      icon     : 'icon-tile-four',
      state    : 'app.szgc.home',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('szgc.report', {
      title    : '报表',
      icon     : 'icon-tile-four',
      state    : 'app.szgc.report',
      weight   : 1
    });
  }
})();
