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
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '安全验房',
        url: '/Mian',
        templateUrl: 'app/main/xhsc/yf/yfMain.html',
        controller: 'yfMainController as vm'
      })
  }
})();
