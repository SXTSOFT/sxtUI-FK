/**
 * Created by lss on 2016/10/18.
 */

(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    $stateProvider
      .state('app.xhsc.sf',{
        url:'/sf',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.sf.sfmain', {
        noBack:false,
        sendBt: false,
        rightArrow: false,
        showgrzx:true,
        leftArrow: false,
        title: '安全文明',
        url: '',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_main.html',
        controller: 'safe_civiliz_mainController as vm'
      })
      .state('app.xhsc.sf.sfbase', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        //showgrzx:true,
        leftArrow: false,
        title: '安全文明',
        url: '/{yw}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_base.html',
        controller: 'safe_civiliz_baseController as vm'
      })
      .state('app.xhsc.sf.sfitem', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        //showgrzx:true,
        leftArrow: false,
        title: '安全项选择',
        url: '/sfitem/{role}/{projectId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_item.html',
        controller: 'safe_civiliz_itemController as vm'
      })
      .state('app.xhsc.sf.sfhouse', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/sfhouse/{InspectionId}/{role}/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{areaId}/{maxRegion}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_house.html',
        controller: 'safe_civiliz_houseController as vm'
      })
      .state('app.xhsc.sf.sfaccept', {
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url: '/sfaccept/{InspectionId}/{acceptanceItemID}/{acceptanceItemName}/{name}/{regionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_accept.html',
        controller: 'safe_civiliz_acceptController as vm'
      })
      .state('app.xhsc.sf.sfproblem', {
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url: '/sfproblem/{acceptanceItemName}/{acceptanceItemID}/{name}/{areaId}/{projectId}/{InspectionId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_problem.html',
        controller: 'safe_civiliz_problemController as vm'
      })
      .state('app.xhsc.sf.sfinfo', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '安全验收信息',
        url: '/sfinfo/{acceptanceItemName}/{acceptanceItemID}/{name}/{areaId}/{projectId}/{InspectionId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_info.html',
        controller: 'safe_civiliz_infoController as vm'
      })
      .state('app.xhsc.sf.rectify',{
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        title: '整改',
        url: '/rectify/{Role}/{InspectionID}/{AcceptanceItemID}/{RectificationID}/{AcceptanceItemName}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_rectify.html',
        controller: 'safe_civiliz_rectifyController as vm'
      })
  }
})();
