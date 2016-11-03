/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc', ['app.core','angular-echarts','ngCordova','JPushPlugin'])
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
        title :'消息中心',
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
        title :'个人中心',
        url   :'/pcenter',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/pcenter.html',
            controller:'pcenterController as vm'
          }
        }
      })
      .state('app.xhsc.pcmain',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'个人中心',
        url   :'/pcmain',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/pcenter_main.html',
            controller:'pcenter_mainController as vm'
          }
        }
      })
      .state('app.xhsc.person',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'个人信息',
        url   :'/person',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/person.html',
            controller:'personController as vm'
          }
        }
      })
      .state('app.xhsc.message',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :' ',
        url   :'/message',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/message.html',
            controller:'messageController as vm'
          }
        }
      })
      .state('app.xhsc.scPiclst',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测图纸列表',
        url   :'/scPiclst/{projectID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/scPiclst.html',
            controller:'scPiclstController as vm'
          }
        }
      })
      .state('app.xhsc.sc_standar',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测标准化',
        url   :'/sc_standar/{AcceptanceItemID}/{DrawingID}/{AcceptanceIndexID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/center/sc_standar.html',
            controller:'sc_standarController as vm'
          }
        }
      })
  }
})();
