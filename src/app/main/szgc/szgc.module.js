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
      .state('app.szgc.project',{
        //title :'形象进度',
        url   :'/home/jd/{pid}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link2.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.project.buildinglist',{
        //title :'形象进度',
        url   :'/items/{projectType}/{itemId}/{itemName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link3.html',
            controller:'SzgcyhydLink3Controller as vm',
            resolve:{
              builds:['$stateParams', 'api','$q',function($stateParams, api,$q){
                return $q(function(resolve){
                  api.szgc.vanke.buildingsInfo($stateParams.projectType, $stateParams.itemId).then(function (data) {
                    api.szgc.ProjectExService.building($stateParams.pid + '>' + $stateParams.itemId).then(function (data2) {
                      var mx = 0;
                      data.forEach(function (item) {
                        if (mx < item.floors)
                          mx = item.floors;
                        var fd = data2.data.Rows.find(function (it) { return it.RegionId == item.building_id; }) || {};
                        item.gx1 = fd.gx1||0;
                        item.gx2 = fd.gx2 || 0;
                        item.summary = fd.AreaRemark || '';
                      });
                      resolve({
                        floorNum:mx,
                        builds:data
                      });
                    });
                  })
                })
              }]
            }
          }
        }
      })
      .state('app.szgc.project.buildinglist.building',{
        //title :'形象进度',
        url   :'/building/{buildId}/{buildName}/{floors}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/buildingdetail.html',
            controller:'SzgcbuilddetailController as vm',
            resolve:{
              details:['$stateParams','api',function($stateParams,api){
                return api.szgc.ProjectExService.building2($stateParams.pid + '>' + $stateParams.itemId + '>' + $stateParams.buildId).then(function (result) {
                    var pageload = {
                      name: '',
                      datapoints: []
                    }

                    result.data.Rows.forEach(function (r) {
                      pageload.datapoints.push({
                        x: r.ProcedureName,
                        y: r.gx1
                      });
                    })
                    return [pageload];
                  });
              }]
            }
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
