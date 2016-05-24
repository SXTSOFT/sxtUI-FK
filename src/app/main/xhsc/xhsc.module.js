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
      .state('app.xhsc.ch2',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测实量',
        url   :'/choose/{areaID}/{areaName}/{assessmentID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ch2.html',
            controller:'ChooseController as vm'
          }
        }
      })
      .state('app.xhsc.ch1',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实体质量',
        url   :'/stzl/{assessmentID}/{AssessmentTypeID}/{aname}/{aid}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ch1.html',
            controller:'xtzlChooseController as vm'
          }
        }
      })
      .state('app.xhsc.ch3',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测详情',
        url   :'/scxq/{assessmentID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ch3.html',
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
      .state('app.xhsc.download',{
        noBack:true,
        sendBt:false,
        refreshBtn:true,
        rightArrow:false,
        leftArrow:false,
        title :'现场评估',
        url   :'/download',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/download.html',
            controller:'downloadController as vm'
          }
        }
      })
      .state('app.xhsc.xcpk',{
        noBack:true,
        sendBt:false,
        refreshBtn:false,
        rightArrow:false,
        leftArrow:false,
        title :'现场评估',
        url   :'/xcpk',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ddetail.html',
            controller:'downdetailController as vm'
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
        title:'实体质量评估',
        url   :'/list/{AssessmentID}/{RegionID}/{RegionName}/{AssessmentTypeID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/evaluatelist.html',
            controller:'evaluatelistController as vm'
          }
        }
      })
      //.state('app.xhsc.zg',{
      //  noBack:true,
      //  sendBt:false,
      //  rightArrow:true,
      //  leftArrow:true,
      //  url   :'/check',
      //  views :{
      //    'content@app':{
      //      templateUrl : 'app/main/xhsc/ys/checkHouse.html',
      //      controller:'checkHouseController as vm'
      //    }
      //  }
      //})
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
        url   :'/sc2/{db}/{areaId}/{measureItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/sc2.html',
            controller:'sc2Controller as vm'
          }
        }
      })
      .state('app.xhsc.sctb',{
        noBack:true,
        sendBt:true,
        rightArrow:false,
        leftArrow:false,
        title :'实测详情',
        url   :'/sctb/{db}/{areaId}/{measureItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/scdetail.html',
            controller:'detailscController as vm'
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
      .state('app.xhsc.stzlDetail',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'lx',
        url   :'/stzlDetail/{AssessmentID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/stzlDetail.html',
            controller:'stzlDetailController as vm'
          }
        }
      })
      .state('app.pc', {
        url:'/pc',
        abstract:true,
        views:{
          'main@':{
            controller:['$scope','$rootScope',function ($scope,$rootScope) {
              $scope.$on('$viewContentAnimationEnded', function (event) {
                if (event.targetScope.$id === $scope.$id) {
                  $rootScope.$broadcast('msSplashScreen::remove');
                }
              });
            }],
            template:'<div layout="column" flex ui-view="content" ></div>'
          }
        }
      })
      .state('app.pc.list',{
        url   :'/list/{AssessmentID}',
        views :{
          'content':{
            templateUrl : 'app/main/xhsc/ys/evaluatelist_pc.html',
            controller:'evaluatelistPcController as vm'
          }
        }
      })
    .state('app.xhsc.pkresult',{
      url   :'/pkresult/{AssessmentID}/{RegionID}/{RegionName}/{AssessmentTypeID}',
      views :{
        'content@app':{
          templateUrl : 'app/main/xhsc/ys/evaluatelist_pc.html',
          controller:'evaluatelistPcController as vm'
        }
      }
    });

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
