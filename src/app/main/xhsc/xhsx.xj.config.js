/**
 * Created by shaoshun on 2016/11/29.
 */
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
      .state('app.xhsc.xj',{
        url:'/xj',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.xj.main', {
        // noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '巡检',
        url: '',
        templateUrl: 'app/main/xhsc/cycleLook/cycleLookMain.html',
        controller: 'cycleLookMainController as vm'
      })
      .state('app.xhsc.xj.base', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '巡检',
        url: '/xj/{yw}',
        templateUrl: 'app/main/xhsc/cycleLook/cycleLookBase.html',
        controller: 'cycleLookBaseController as vm'
      })
      .state('app.xhsc.xj.accept', {
        noBack:true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        title: '巡检',
        url: '/xjAccept/{InspectionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/cycleLook/cycleLookAccept.html',
        controller: 'cycleLookAcceptController as vm'
      })
      .state('app.xhsc.xj.rectify', {
        noBack:true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        title: '巡检',
        url: '/xjRectify/{Role}/{InspectionID}/{AcceptanceItemID}/{RectificationID}/{AcceptanceItemName}',
        templateUrl: 'app/main/xhsc/cycleLook/cycleLookRectify.html',
        controller: 'cycleLookRectifyController as vm'
      })
  }
})();
