/**
 * Created by jiuyuong on 2016/6/22.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.xhsc.jthome',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        showgrzx:true,

        title :'星河集团',
        url   :'/',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/home/Jthome.html',
            controller:'jthomeController as vm'
          }
        }
      })
      .state('app.xhsc.prjhome',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        // showgrzx:true,
        title :'深圳雅宝',
        url   :'/prjhome/{companyId}/{companyName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/home/prjhome.html',
            controller:'prjhomeController as vm'
          }
        }
      })
      .state('app.xhsc.home',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        // showgrzx:true,
        title :'工程管理',
        url   :'/index',
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
        url   :'/choose2/{areaID}/{areaName}/{assessmentID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ch2.html',
            controller:'ChooseScController as vm'
          }
        }
      })
      .state('app.xhsc.ch1',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实体质量',
        url   :'/stzl/{assessmentID}/{AssessmentTypeID}/{aname}/{aid}/{typename}',
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
      .state('app.xhsc.choose',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        url   :'/choose/{acceptanceItemID}/{projectId}/{acceptanceItemName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/choose.html',
            controller:'ChooseController as vm'
          }
        }
      })
      .state('app.xhsc.download',{
        noBack:true,
        sendBt:false,
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
        url   :'/list/{AssessmentID}/{RegionID}/{RegionName}/{AssessmentTypeID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/evaluatelist.html',
            controller:'evaluatelistController as vm'
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
        sendBt:false,
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
      .state('app.xhsc.glxwSetting',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'',
        url   :'/glxwSetting/{AssessmentID}/{AssessmentTypeID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/glxwSetting.html',
            controller:'glxwSettingController as vm'
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
            template:'<div layout="column" fullscreen="" flex ui-view="content" ></div>'
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
      .state('app.xhsc.ch31',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测详情',
        url   :'/scxq/{year}/{projectID}/{quarter}/{assessmentStage}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ch31.html',
            controller:'ChoosePcController as vm'
          }
        }
      })
      .state('app.pc.ch3',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测详情',
        url   :'/scxq/{year}/{projectID}/{quarter}/{assessmentStage}',
        views :{
          'content':{
            templateUrl : 'app/main/xhsc/ys/ch3_pc.html',
            controller:'ChoosePcController as vm'
          }
        }
      })
      .state('app.pc.sctb',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测详情',
        url   :'/sctb/{db}/{areaId}/{measureItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content':{
            templateUrl : 'app/main/xhsc/ys/scdetail_pc.html',
            controller:'detailscController as vm'
          }
        }
      })
      .state('app.xhsc.sctbdetail',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测详情',
        url   :'/sctbdetail/{recordId}/{itemId}/{MeasureRecordID}/{AcceptanceItemID}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/sctbdetail.html',
            controller:'sctbdetailController as vm'
          }
        }
      })
      .state('app.pc.sctbdetail',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测详情',
        url   :'/sctbdetail/{recordId}/{itemId}/{AcceptanceItemID}/{MeasureRecordID}',
        views :{
          'content':{
            templateUrl : 'app/main/xhsc/ys/sctbdetail_pc.html',
            controller:'sctbdetailController as vm'
          }
        }
      })
      .state('app.xhsc.pkresult',{
        //url   :'/pkresult/{AssessmentID}/{RegionID}/{RegionName}/{AssessmentTypeID}',
        url:'/pkresult/{year}/{projectID}/{quarter}/{assessmentStage}',
        noBack:true,
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/evaluatelist_pc.html',
            controller:'evaluatelistPcController as vm'
          }
        }
      })
      .state('app.pc.pkresult', {
        url: '/pkresult/{year}/{projectID}/{quarter}/{assessmentStage}',
        views: {
          'content': {
            templateUrl: 'app/main/xhsc/ys/evaluatelist_pc.html',
            controller: 'evaluatelistPcController as vm'
          }
        }
      });

  }
})();
