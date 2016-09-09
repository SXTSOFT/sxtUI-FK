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
  function config($stateProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.material', {
        abstract:true
      })

      .state('app.material.ys',{
        title:'验收',
        url:'/mys/{id}',
        views :{
          'content@app':{
            controller:'MMyProcessController as vm',
            templateUrl:'app/main/material/ys/myProcess-app.html'
          }
        }
      })

      .state('app.material.ys.addAttachment', {
        title:'添加附件',
        url: '/addAttachment/{id}',
        controller: 'AddAttachmentController as vm',
        templateUrl: 'app/main/material/ys/addAttachment-app.html'
      })
      .state('app.material.ys.detail', {
        title:'材料验收详情',
        url: '/detail/{id}',
        controller: 'CheckDataDetailController as vm',
        templateUrl: 'app/main/material/ys/checkDataDetail-app.html'
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


  }
})();
