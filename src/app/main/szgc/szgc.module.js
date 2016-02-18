/**
 * Created by jiuyuong on 2016/1/21.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc', ['app.core','angular-echarts','angularFileUpload'])
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
        noBack:true,
        title :'万科数字工程',
        url   :'/',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/home.html',
            controller:'SzgcHomeController as vm'
          }
        }
      })
      .state('app.szgc.jd',{
        title :'形象进度',
        url   :'/home/jd/:id',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link2.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.jd2',{
        title :'形象进度',
        url   :'/home/jd2',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link3.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.yhyd',{
        title :'一户一档',
        url   :'/home/yhyd',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.report', {
        noBack:true,
        title    :'报表',
        url      : '/report',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/report.html',
            controller: 'SzgcReportController as vm'
          }
        }
      })
      .state('app.szgc.report.viewBath', {
        title :'质量总表',
        url: '/viewBath',
        controller: 'viewBathController as vm',
        templateUrl: 'app/main/szgc/report/viewBath-app.html'
      })
      .state('app.szgc.report.viewBath.view', {
        title :'查看详细',
        url: '/{bathid}',
        controller: 'viewBathDetailController as vm',
        templateUrl: 'app/main/szgc/report/viewBathDetail-app.html'
      })
      .state('app.szgc.report.batchCount', {
        title :'项目填报情况统计表',
        url:'/batchCount',
        controller: 'batchCountController as vm',
        templateUrl: 'app/main/szgc/report/batchCount-app.html'
      })
      .state('app.szgc.report.projectMasterList', {
        title:'项目班组总览表',
        url:'/projectMasterList',
        controller: 'projectMasterListController1 as vm',
        templateUrl: 'app/main/szgc/report/projectMasterList-app.html'
      })
      .state('app.szgc.settings',{
        noBack:true,
        title:'设置',
        url:'/settings',
        views :{
          'content@app':{
            controller:'SzgcSettingsController as vm',
            templateUrl:'app/main/szgc/settings/settings.html',
            resolve:{
              profile:['api',function(api){
                return api.szgc.vanke.profile();
              }]
            }
          }
        }
      })
      .state('app.szgc.ys',{
        noBack:true,
        title:'验收',
        url:'/ys',
        views :{
          'content@app':{
            controller:'MyProcessController as vm',
            templateUrl:'app/main/szgc/ys/myProcess-app.html'
          }
        }
      })
      .state('app.szgc.ys.add', {
        title:'添加验收',
        url: '/new/{projectid}/{name}/{batchId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'AddProcessController as vm',
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
