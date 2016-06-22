/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc', ['app.core','ngCordova'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    $stateProvider
      .state('app.xhsc', {
        abstract:true
      })
      .state('app.xhsc.mcenter',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        opBtn:true,
        title :'个人中心',
        url   :'/mcenter',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/mcenter.html',
            controller:'mcenterController as vm'
          }
        }
      })
      .state('app.xhsc.pcenter',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'消息中心',
        url   :'/pcenter',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/pcenter.html',
            controller:'pcenterController as vm'
          }
        }
      })
  }
})();
