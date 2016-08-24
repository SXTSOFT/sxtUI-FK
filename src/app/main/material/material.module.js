/**
 * Created by leshuangshuang on 16/8/5.
 */
(function ()
{
  'use strict';

  angular
    .module('app.material', ['app.core','angular-echarts','angularFileUpload','app.szgc'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.material', {
        abstract:true
      })

      .state('app.material.ys',{
        noBack:true,
        title:'验收',
        url:'/mys',
        views :{
          'content@app':{
            controller:'MMyProcessController as vm',
            templateUrl:'app/main/material/ys/myProcess-app.html'
          }
        }
      })
      .state('app.material.ys.add', {
        title:'添加验收',
        url: '/new/{projectid}/{name}/{batchId}/{procedureTypeId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'MAddProcessController as vm',
        templateUrl: 'app/main/szgc/material/addProcess-app.html'
      })
      .state('app.material.ys.addnew', {
        noBack:true,
        title:'添加验收',
        url: '/newadd/{projectid}/{name}/{batchId}/{procedureTypeId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'MAddProcessNewController as vm',
        templateUrl: 'app/main/szgc/material/addProcess-appnew.html'
      })
      .state('app.material.ys.upload', {
        title:'添加验收',
        url: '/upload/{projectid}/{name}/{type}/{idTree}/{nameTree}',
        controller: 'MuploadProcessController as vm',
        templateUrl: 'app/main/szgc/material/upload.html'
      })

      //.state('app.material.ys.list', {
      //  title:'验收',
      //  url: '/list',
      //  controller: 'materialListController as vm',
      //  templateUrl: 'app/main/material/ys/materialList.html'
      //})


  }
})();
