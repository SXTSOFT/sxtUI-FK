/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc', ['app.core'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.xhsc', {
        abstract:true
      })
      .state('app.xhsc.home',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'工程管理',
        url   :'/',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/home/home.html',
            controller:'HomeController as vm'
          }
        }
      })
      .state('app.xhsc.choose',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测实量',
        url   :'/choose',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/choose.html',
            controller:'ChooseController as vm'
          }
        }
      })
      .state('app.xhsc.chooseHouse',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'抹灰工程',
        url   :'/chooseHouse/{id}/{areaId}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/chooseHouse.html',
            controller:'ChooseHouseController as vm'
          }
        }
      })

      .state('app.xhsc.evaluate',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'评估',
        url   :'/evaluate',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/evaluate.html',
            controller:'evaluateController as vm'
          }
        }
      })
      .state('app.xhsc.evaluatelist',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        url   :'/list',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/evaluatelist.html',
            controller:'evaluatelistController as vm'
          }
        }
      })
      .state('app.xhsc.check',{
        noBack:true,
        sendBt:false,
        rightArrow:true,
        leftArrow:true,
        url   :'/check',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/checkHouse.html',
            controller:'checkHouseController as vm'
          }
        }
      })
      .state('app.xhsc.sc',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测',
        url   :'/sc/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/sc.html',
            controller:'scController as vm'
          }
        }
      })
      .state('app.xhsc.sc2',{
        noBack:true,
        sendBt:true,
        rightArrow:false,
        leftArrow:false,
        title :'实测',
        url   :'/sc2/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/sc2.html',
            controller:'sc2Controller as vm'
          }
        }
      })
      .state('app.xhsc.scv',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测查看',
        url   :'/scv/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/scv.html',
            controller:'scController as vm'
          }
        }
      })
      .state('app.xhsc.scd',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测结果',
        url   :'/scd/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/scd.html',
            controller:'scdController as vm'
          }
        }
      })
      .state('app.xhsc.demo',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'DEMO',
        url   :'/demo',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/home/demo.html',
            controller:'DemoController as vm'
          }
        }
      })
      .state('app.xhsc.offline',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'lx',
        url   :'/offline',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/offline/manage.html',
            controller:'offlineController as vm'
          }
        }
      })


    // Navigation
    msNavigationServiceProvider.saveItem('xhsc', {
      // title : '数字工程',
      group : true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('xhsc.home', {
      title    : '首页',
      icon     : 'icon-home',
      state    : 'app.xhsc.home',
      weight   : 1
    });

  }
})();
