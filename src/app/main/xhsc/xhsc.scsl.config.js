
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {


    msNavigationServiceProvider.saveItem('xh.pcmain', {
      title: '设置',
      state: 'app.xhsc.pcmain',
      icon:'icon-account',
      weight:1
    });

    // State
    $stateProvider
      .state('app.xhsc.scsl',{
        url:'/scsl',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.scsl.scslmain', {
        noBack:false,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        showgrzx:true,
        title: '实测实量',
        url: '',
        templateUrl: 'app/main/xhsc/procedurepg/scslmain.html',
        controller: 'scslmainController as vm'
      })
      .state('app.xhsc.scsl.sclist', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '选择实测项',
        url: '/sclist/{projectId}/{assessmentID}/{area}/{isReport}',
        templateUrl: 'app/main/xhsc/procedurepg/sclist.html',
        controller: 'sclistController as vm'
      })
      .state('app.xhsc.scsl.scRegion', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/scRegion/{assessmentID}/{area}/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{maxRegion}/{isReport}',
        templateUrl: 'app/main/xhsc/procedurepg/scRegion.html',
        controller: 'scRegionController as vm'
      })
      .state('app.xhsc.scsl.schztb', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/schztb/{db}/{areaId}/{measureItemID}/{regionId}/{regionType}/{name}/{pname}',
        templateUrl: 'app/main/xhsc/procedurepg/schztb.html',
        controller: 'schztbController as vm'
      })
      .state('app.xhsc.scsl.schztbdetail', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/schztbdetail/{regionId}/{itemId}/{acceptanceItemID}',
        templateUrl: 'app/main/xhsc/procedurepg/schztbdetail.html',
        controller: 'schztbdetailController as vm'
      })
      .state('app.xhsc.scsl._sc',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        url   :'/_sc/{db}/{areaId}/{measureItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/procedurepg/_sc.html',
            controller:'_scController as vm'
          }
        }
      })
      .state('app.xhsc.scsl.chooseArea',{
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title :'请选择分期',
        url   :'/chooseArea/{assessmentID}/{projectId}/{role}/{isReport}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/procedurepg/chooseArea.html',
            controller:'chooseAreaController as vm'
          }
        }
      })
  }
})();
