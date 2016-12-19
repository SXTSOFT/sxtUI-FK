/**
 * Created by UUI on 2016/11/29.
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
      .state('app.xhsc.yf',{
        url:'/yf',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.yf.Main', {
        // noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '移动验房',
        url: '/Mian',
        templateUrl: 'app/main/xhsc/yf/yfMain.html',
        controller: 'yfMainController as vm'
      })

      .state('app.xhsc.yf.yfBase', {
      noBack:true,
      sendBt: false,
      rightArrow: false,
      leftArrow: false,
      title: '移动验房',
      url: '/yf/{yw}',
      templateUrl: 'app/main/xhsc/yf/yfBase.html',
      controller: 'yfBaseController as vm'
    })
      .state('app.xhsc.yf.yfAccept', {
        noBack:true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        title: '移动验房',
        url: '/yfAccept/{InspectionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/yf/yfAccept.html',
        controller: 'yfAcceptController as vm'
      })
      .state('app.xhsc.yf.yfRectify', {
        noBack:true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        title: '移动验房',
        url: '/yfRectify/{Role}/{InspectionID}/{AcceptanceItemID}/{RectificationID}/{AcceptanceItemName}',
        templateUrl: 'app/main/xhsc/yf/yfRectify.html',
        controller: 'yfRectifyController as vm'
      })
  }
})();
