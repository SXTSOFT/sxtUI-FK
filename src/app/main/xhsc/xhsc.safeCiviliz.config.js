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
      .state('app.xhsc.sf.sfDynamicMain', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '动态安全源',
        url: '/sfDynamicMain',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfDynamicMain.html',
        controller: 'sfDynamicMainController as vm'
      })
      .state('app.xhsc.sf.sfDynamicBase', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '动态安全源',
        url: '/dynamic/{yw}',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfDynamicBase.html',
        controller: 'sfDynamicBaseController as vm'
      })
      .state('app.xhsc.sf.sfDynamicRectify', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '动态安全源',
        url: '/sfDynamicRectify/{Role}/{InspectionID}/{AcceptanceItemID}/{RectificationID}/{AcceptanceItemName}',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfDynamicRectify.html',
        controller: 'sfDynamicRectifyController as vm'
      })
      .state('app.xhsc.sf.sfDynamicAccept', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '动态安全源',
        url: '/sfDynamicAccept/{InspectionId}/{acceptanceItemID}/{acceptanceItemName}/{name}/{regionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfDynamicBase.html',
        controller: 'sfDynamicAcceptController as vm'
      })
      .state('app.xhsc.sf.sfmain', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        showgrzx:false,
        leftArrow: false,
        title: '安全验收',
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
        title: '安全验收',
        url: '/ys/{yw}',
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
        title: '区域选择',
        url: '/sfhouse/{InspectionId}/{role}/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{areaId}/{maxRegion}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_house.html',
        controller: 'safe_civiliz_houseController as vm'
      })
      .state('app.xhsc.sf.sfaccept', {
        noBack: true,
        sendBt: true,
        title: '监理验收',
        rightArrow: false,
        leftArrow: false,
        url: '/sfaccept/{InspectionId}/{acceptanceItemID}/{acceptanceItemName}/{name}/{regionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_accept.html',
        controller: 'safe_civiliz_acceptController as vm'
      })
      .state('app.xhsc.sf.rectify',{
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url: '/rectify/{Role}/{InspectionID}/{AcceptanceItemID}/{RectificationID}/{AcceptanceItemName}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_rectify.html',
        controller: 'safe_civiliz_rectifyController as vm'
      })


    $stateProvider
      .state('app.xhsc.week',{
        url:'/week',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.week.sfWeekMain', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '周安全检查',
        url: '/sfWeekMain',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfWeekMain.html',
        controller: 'sfWeekMainController as vm'
      })
      .state('app.xhsc.week.sfWeekBase', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '周安全检查',
        url: '/week/{yw}',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfWeekBase.html',
        controller: 'sfWeekBaseController as vm'
      })
      .state('app.xhsc.week.sfWeekAccept', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '周安全检查',
        url: '/ sfWeekAccept/{InspectionId}/{acceptanceItemID}/{acceptanceItemName}/{name}/{regionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfWeekAccept.html',
        controller: 'sfWeekAcceptController as vm'
      })
      .state('app.xhsc.week.sfWeekRectify', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '周安全检查',
        url: '/sfWeekRectify/{Role}/{InspectionID}/{AcceptanceItemID}/{RectificationID}/{AcceptanceItemName}',
        templateUrl: 'app/main/xhsc/safeCiviliz/sfWeekRectify.html',
        controller: 'sfWeekRectifyController as vm'
      })
  }
})();
