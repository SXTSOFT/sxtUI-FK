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
        noBack:false,
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
        noBack:false,
        sendBt: false,
        rightArrow: false,
        //showgrzx:true,
        leftArrow: false,
        title: '安全项选择',
        url: '/sfitem/{role}/{projectId}',
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_item.html',
        controller: 'safe_civiliz_itemController as vm'
      })
      .state('app.xhsc.gx.sfhouse', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/sfhouse/{InspectionId}/{role}/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{areaId}/{maxRegion}',
        templateUrl: 'app/main/xhsc/procedure/safe_house.html',
        controller: 'safe_houseController as vm'
      })

  }
})();
