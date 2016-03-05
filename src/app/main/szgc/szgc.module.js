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
      .state('app.szgc.area',{
        noBack:true,
        title :'划区',
        url   :'/edit/{pid}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/area.html',
            controller:'SzgcAreaController as vm'
          }
        }
      })
      .state('app.szgc.xc',{
        noBack:true,
        title :'验收',
        url   :'/xc/{pid}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/xc.html',
            controller:'SzgcXCController as vm'
          }
        }
      })
      .state('app.szgc.view',{
        noBack:true,
        title :'验收',
        url   :'/zg/view/{pid}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/view.html',
            controller:'SzgcXCController as vm'
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
        url   :'/building/{buildId}/{buildName}/{floors}/{floorNum}',
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
                      { x: '墙体', id: 'f95cd41c-f47d-4fdc-a0ff-c138450ea279' },
                      { x: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b' },
                      { x: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0' },
                      { x: '油漆', id: '00000000-0000-0000-0000-000000000000' },
                      { x: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a' }
                    ]

                    result.data.Rows.forEach(function (r) {
                      var g = gx.find(function (g) { return g.id == r.ProcedureId; });
                      if (g) {
                        g.y = r.gx1;
                      }
                    });
                    pageload.datapoints = gx;
                    var char = angular.copy(pageload);
                    //char.datapoints.splice(0, 1);
                    return [char];
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
      .state('app.szgc.tzg', {
        noBack:true,
        title    :'发送整改通知',
        url      : '/zg/send/{pid}',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/send.html',
            controller: 'SzgcZgController as vm'
          }
        }
      })

      .state('app.szgc.zg', {
        title    :'整改',
        url      : '/zg',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/zgdetail.html',
            controller: 'SzgcZgController as vm'
          }
        }
      })
      .state('app.szgc.zgdetail', {
        title    :'整改详情',
        url      : '/zgdetail/{pid}',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/zgdetail1.html',
            controller: 'SzgcZgController as vm'
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
      icon     : 'icon-home',
      state    : 'app.szgc.home',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('szgc.report', {
      title    : '划区',
      icon     : 'icon-pen',
      state    : 'app.szgc.area',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('szgc.ys', {
      title    : '验收',
      icon     : 'icon-apps',
      state    : 'app.szgc.xc',
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

    //msNavigationServiceProvider.saveItem('szgc.send', {
    //  title    : '查看整改',
    //  icon     : 'icon-account-switch',
    //  state    : 'app.szgc.report',
    //  weight   : 1
    //})
  }
})();
