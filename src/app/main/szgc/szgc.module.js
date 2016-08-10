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
                  api.szgc.ProjectExService.queryPno($stateParams.pid).then(function (exs) {
                    api.szgc.vanke.buildingsInfo ($stateParams.projectType, $stateParams.itemId).then (function (data) {
                      api.szgc.ProjectExService.building ($stateParams.pid + '>' + $stateParams.itemId).then (function (data2) {
                        var mx = 0;
                        data.data.data.forEach (function (item) {
                          item.floors = item.total_floor;
                          if (mx < item.total_floor)
                            mx = item.floors;
                          var fd = data2.data.Rows.find (function (it) {
                              return it.RegionId == item.building_id;
                            }) || {};
                          item.gx1 = fd.gx1 || 0;
                          item.gx2 = fd.gx2 || 0;
                          item.summary = fd.AreaRemark || '';
                          var sel = exs.data.Rows.find(function (it) { return it.ProjectId == item.building_id; });
                          item.sellLine = parseInt((sel && sel.SellLine) ? (sel.SellLine.indexOf('%') == -1 ? parseInt(sel.SellLine) :
                          parseFloat(sel.SellLine.replace('%', '')) / 100 * item.floors) : -1000);
                          if (isNaN(item.sellLine)) {
                            item.sellLine = -1000;
                          }
                        });
                        resolve ({
                          floorNum: mx,
                          builds: data.data.data
                        });
                      });
                    })
                  });
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
                    }, gx = [
                      //{ x: '主体', id: '953cea5b-b6fb-4eb7-b019-da391f090efd' },
                      { x: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a',color:'rgba(193,35,43,1)' },
                      { x: '油漆', id: 'a3776dab-9d80-4ced-b229-e6bfc51f7988',color:'rgba(181,195,52,1)' },
                      { x: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b',color:'rgba(252,206,16,1)' },
                      { x: '墙板', id: '8bfc6626-c5ed-4267-ab8f-cb2294885c25', color:'rgba(193,35,43,1)'},
                      { x: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0',color:'rgba(181,195,52,1)' }
                      //{ x: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a', color: 'rgba(193,35,43,1)' },
                      //{ x: '油漆', id: 'a3776dab-9d80-4ced-b229-e6bfc51f7988', color: 'rgba(181,195,52,1)' },
                      //{ x: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b', color: 'rgba(252,206,16,1)' },
                      //{ x: '墙板', id: '8bfc6626-c5ed-4267-ab8f-cb2294885c25', color: 'rgba(193,35,43,1)' },
                      //{ x: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0', color: 'rgba(181,195,52,1)' }
                    ]

                    result.data.Rows.forEach(function (r) {
                      var g = gx.find(function (g) { return g.id == r.ProcedureId; });
                      if (g) {
                        g.y = r.gx1;
                      }
                    });

                    //pageload.datapoints = gx;
                    var tempdata = [];
                      tempdata = gx;
                  console.log(gx)
                    tempdata.forEach(function(item){
                      if(!item.y){
                       // pageload.datapoints.push(item);
                        item.color = null;
                      }
                      pageload.datapoints.push(item);
                    })
                    var char = angular.copy(pageload);
                    //char.datapoints.splice(0, 1);
                    return [char];
                  });
              }]
            }
          }
        }
      })
      .state('app.szgc.project.view', {
        title :'查看详细',
        url: '/{bathid}',
        controller: 'viewBathDetailController as vm',
        templateUrl: 'app/main/szgc/report/viewBathDetail-app-go.html'
      })
      .state('app.szgc.yhyd',{
        url   :'/home/yhyd/{pid}/{pname}/{idTree}/{type}/{seq}',
        //url:'/home/yhyd/{regionId}/{regionType}/{roomType}/{procedureId}/{regionName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.yhyd.records',{
        url   :'/records',
        //url:'/home/yhyd/{regionId}/{regionType}/{roomType}/{procedureId}/{regionName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link_records.html',
            controller:'SzgcyhydRecordsController as vm'
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
      .state('app.szgc.ybgcResultT1', {
        noBack:true,
        title    :'一户一档',
        url      : '/ybgcResultT1',
        views    : {
          'content@app': {
            controller: 'yhydController as vm',
            templateUrl: 'app/main/szgc/report/yuyd.html'
          }
        }
      })
      .state('app.szgc.report.viewBath', {
        title :'质量总表',
        url: '/viewBath',
        controller: 'viewBathController as vm',
        templateUrl: 'app/main/szgc/report/viewBath-app.html'
      })
      .state('app.szgc.report.ybgcResult', {
        title :'隐蔽工程',
        url: '/viewYbgc',
        controller: 'ybgcController as vm',
        templateUrl: 'app/main/szgc/report/ybgcResult.html'
      })
      .state('app.szgc.project.ybgcResultT', {
        title :'隐蔽工程',
        url: '/viewYbgc',
        controller: 'yhydController as vm',
        templateUrl: 'app/main/szgc/report/yuyd.html'
      })
      .state('app.szgc.report.picView', {
        title :'隐蔽工程详情',
        url: '/picView/{regionId}/{regionType}/{roomType}/{procedureId}/{regionName}',
        controller: 'ybgcyhydController as vm',
        templateUrl: 'app/main/szgc/report/ybgcyhyd.html'
      })
      .state('app.szgc.report.viewBath.view', {
        title :'查看详细',
        url: '/{bathid}',
        controller: 'viewBathDetailController as vm',
        templateUrl: 'app/main/szgc/report/viewBathDetail-app-go.html'
      })

      .state('app.szgc.report.batchCount', {
        title :'项目填报情况统计表',
        url:'/batchCount',
        controller: 'batchCountController as vm',
        templateUrl: 'app/main/szgc/report/batchCount-app.html'
      })
      .state('app.szgc.report.batchRaio', {
        title :'班组验收合格率对比',
        url:'/batchRaio',
        controller: 'batchRaioController as vm',
        templateUrl: 'app/main/szgc/report/batchRaio-app.html',
        resolve: {
          _projects:['api',function(api){
            return api.szgc.vanke.projects({
              page_size: 1000,
              page_number: 1
            })
          }],
          _skills:['api',function(api){
            console.log('api',api)
            return api.szgc.vanke.skills({ page_number: 1, page_size: 10000 });
          }]
        }
      })
      .state('app.szgc.report.allRaio', {
        title:'总承包单位验收合格率',
        url:'/allRaio',
        controller: 'allRaioController as vm',
        templateUrl: 'app/main/szgc/report/allRaio-app.html',
        resolve: {
          _projects:['api',function(api){
            return api.szgc.vanke.projects({
              page_size: 1000,
              page_number: 1
            })
          }]
        }
      })
      .state('app.szgc.report.projectMasterList', {
        title:'项目班组总览表',
        url:'/projectMasterList',
        controller: 'projectMasterListController1 as vm',
        templateUrl: 'app/main/szgc/report/projectMasterList-app.html'
      })
      .state('app.szgc.report.supCheckResult', {
        title:'监理验收符合率统计',
        url:'/supCheckResult',
        controller: 'supCheckResultController as vm',
        templateUrl: 'app/main/szgc/report/supCheckResult-app.html',
        resolve: {
          _projects:['api',function(api){
            return api.szgc.vanke.projects({
              page_size: 1000,
              page_number: 1
            })
          }]
        }
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
                //api.useNetwork(0);
                return api.szgc.vanke.profile().then(function (r) {
                  //api.resolveNetwork();
                  return r;
                });
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
        url: '/new/{projectid}/{name}/{batchId}/{procedureTypeId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'AddProcessController as vm',
        templateUrl: 'app/main/szgc/ys/addProcess-app.html'
      })
      .state('app.szgc.ys.addnew', {
        title:'添加验收',
        url: '/newadd/{projectid}/{name}/{batchId}/{procedureTypeId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'AddProcessNewController as vm',
        templateUrl: 'app/main/szgc/ys/addProcess-appnew.html'
      })
      .state('app.szgc.ys.upload', {
        title:'添加验收',
        url: '/upload/{projectid}/{name}/{type}/{idTree}/{nameTree}',
        controller: 'uploadProcessController as vm',
        templateUrl: 'app/main/szgc/ys/upload.html'
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
      icon     : 'icon-home',
      state    : 'app.szgc.home',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('szgc.report', {
      title    : '报表',
      icon     : 'icon-chart-bar',
      state    : 'app.szgc.report',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('szgc.ys', {
      title    : '验收',
      icon     : 'icon-apps',
      state    : 'app.szgc.ys',
      weight   : 1
    })

    msNavigationServiceProvider.saveItem('setting', {
      title : '系统管理',
      group : true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('setting.ys', {
      title    : '工序管理',
      icon     : 'icon-tile-four',
      state    : 'app.szgc.home3',
      weight   : 1
    })

    msNavigationServiceProvider.saveItem('setting.ys1', {
      title    : '项目权限',
      icon     : 'icon-account-switch',
      state    : 'app.szgc.home1',
      weight   : 1
    })

    msNavigationServiceProvider.saveItem('setting.ys2', {
      title    : '系统配置',
      icon     : 'icon-cog',
      state    : 'app.szgc.home2',
      weight   : 1
    })
  }
})();
