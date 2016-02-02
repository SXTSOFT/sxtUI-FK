/**
 * Created by jiuyuong on 2016/1/21.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc', ['app.core','angular-echarts'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
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
      })
      .state('app.szgc.report.viewBath', {
        url: '/viewBath',
        controller: 'viewBathController as vm',
        templateUrl: 'app/main/szgc/report/viewBath-app.html'
      })
      .state('app.szgc.report.batchCount', {
        url:'/batchCount',
        controller: 'batchCountController as vm',
        templateUrl: 'app/main/szgc/report/batchCount-app.html'
      })
      .state('app.szgc.report.projectMasterList', {
        url:'/projectMasterList',
        controller: 'projectMasterListController1 as vm',
        templateUrl: 'app/main/szgc/report/projectMasterList-app.html'
      })
      .state('app.szgc.settings',{
        url:'/settings',
        views :{
          'content@app':{
            controller:'SzgcSettingsController',
            templateUrl:'app/main/szgc/settings/settings.html'
          }
        }
      })
      .state('app.szgc.ys',{
        url:'/ys',
        views :{
          'content@app':{
            controller:'MyProcessController',
            templateUrl:'app/main/szgc/ys/myProcess-app.html'
          }
        }
      })
      .state('app.szgc.ys.update', {
        url: '/update/{projectid}/{name}/{batchId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{checkedCount}',
        controller: 'UpdateProcessController',
        templateUrl: 'app/main/szgc/ys/updateProcess.html'
      })
      .state('app.szgc.ys.add', {
        url: '/new/{projectid}/{name}/{batchId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'AddProcessController',
        templateUrl: 'app/main/szgc/ys/addProcess-app.html'
      })


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
