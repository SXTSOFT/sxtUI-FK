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
      .state('app.xhsc.gx',{
        url:'/gx',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.gx.gxmain', {
        noBack:true,
        sendBt: false,
        showgrzx:false,
        rightArrow: false,
        leftArrow: false,
        //title: '工序验收',
        url: '',
        swap:[
          {active:true,label:'材料验收',material:true},
          {active:false,label:'工序验收',material:false}
        ],
        templateUrl: 'app/main/xhsc/procedure/gxmain.html',
        controller: 'gxmainController as vm'
      })
      .state('app.xhsc.gx.yw', {
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序验收',
        url: '/{yw}',
        templateUrl: 'app/main/xhsc/procedure/yw.html',
        controller: 'ywController as vm'
      })
      .state('app.xhsc.gx.gxlist', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序选择',
        url: '/gxlist/{role}/{projectId}',
        templateUrl: 'app/main/xhsc/procedure/gxlist.html',
        controller: 'gxlistController as vm'
      })
      .state('app.xhsc.gx.gxhousechoose', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/gxhousechoose/{InspectionId}/{role}/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{areaId}/{maxRegion}',
        templateUrl: 'app/main/xhsc/procedure/gxhousechoose.html',
        controller: 'gxhousechooseController as vm'
      })
      .state('app.xhsc.gx.zjhouseChoose', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/zjhouseChoose/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{areaId}/{maxRegion}',
        templateUrl: 'app/main/xhsc/procedure/zjhouseChoose.html',
        controller: 'zjhouseChooseController as vm'
      })
      .state('app.xhsc.gx.gxtest', {
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url: '/gxtest/{InspectionId}/{acceptanceItemID}/{acceptanceItemName}/{name}/{regionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/procedure/gxtest.html',
        controller: 'gxtestController as vm'
      })
      .state('app.xhsc.gx.gxalllist', {
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url: '/gxalllist/{acceptanceItemName}/{acceptanceItemID}/{name}/{areaId}/{projectId}/{InspectionId}',
        templateUrl: 'app/main/xhsc/procedure/gxalllist.html',
        controller: 'gxalllistController as vm'
      })
      .state('app.xhsc.gx.gxzjcheck', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序自检',
        url: '/gxzjcheck/{acceptanceItemID}/{acceptanceItemName}/{name}/{areaId}/{projectId}/{InspectionId}',
        templateUrl: 'app/main/xhsc/procedure/gxzjcheck.html',
        controller: 'gxzjcheckController as vm'
      })
      .state('app.xhsc.gx.gxresult', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序结果',
        url: '/gxresult/{acceptanceItemName}/{acceptanceItemID}/{name}/{areaId}/{projectId}/{InspectionId}',
        templateUrl: 'app/main/xhsc/procedure/gxresult.html',
        controller: 'gxresultController as vm'
      })
      .state('app.xhsc.gx.jlgxtest', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序',
        url: '/jlgxtest',
        templateUrl: 'app/main/xhsc/procedure/jlgxtest.html',
        controller: 'jlgxtestController as vm'
      })
      .state('app.xhsc.gx.fgxtest', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序',
        url: '/fgxtest',
        templateUrl: 'app/main/xhsc/procedure/fgxtest.html',
        controller: 'fgxtestController as vm'
      })
      .state('app.xhsc.gx.gxresult.gxdetail',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'工序详情',
        url   :'/gxdetail',
        templateUrl : 'app/main/xhsc/procedure/gxdetail.html',
        controller:'gxdetailController as vm'
      })
      .state('app.xhsc.gx.gxzgdetail',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'工序整改详情',
        url   :'/gxzgdetail/{acceptanceItemID}/{acceptanceItemName}/{projectId}/{InspectionId}',
        templateUrl : 'app/main/xhsc/procedure/gxzgdetail.html',
        controller:'gxzgdetailController as vm'
      })
      .state('app.xhsc.gx.gxzgreport', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '验收详情',
        url: '/gxzgreport/{acceptanceItemID}/{acceptanceItemName}/{projectId}/{InspectionId}',
        templateUrl: 'app/main/xhsc/procedure/gxzgreport.html',
        controller: 'gxzgreportController as vm'
      })
      .state('app.xhsc.gx.gxbdchoose', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '标段选择',
        url: '/bdchoose/{projectId}',
        templateUrl: 'app/main/xhsc/procedure/gxbdchoose.html',
        controller: 'gxbdchooseController as vm'
      })
      .state('app.xhsc.gx.gxbdchoose.gxlist', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序选择',
        url: '/gxbdchoose/{projectId}',
        templateUrl: 'app/main/xhsc/procedure/gxlist.html',
        controller: 'gxlistController as vm'
      })
      .state('app.xhsc.gx.gxbdchoose.gxhousechoose', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/gxhousechoose/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{areaId}',
        templateUrl: 'app/main/xhsc/procedure/gxhousechoose.html',
        controller: 'gxhousechooseController as vm'
      })
      .state('app.xhsc.gx.gxzg',{
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        title: '整改',
        url: '/gxzg/{Role}/{InspectionID}/{AcceptanceItemID}/{RectificationID}/{AcceptanceItemName}',
        templateUrl: 'app/main/xhsc/procedure/gxzg.html',
        controller: 'gxzgController as vm'
      })
      .state('app.xhsc.gx.gxfy',{
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        title: '复验',
        url: '/gxfy/{ProjectID}/{InspectionID}/{AcceptanceItemID}/{RectificationID}',
        templateUrl: 'app/main/xhsc/procedure/gxfy.html',
        controller: 'gxfyController as vm'
      })
      .state('app.xhsc.gx.gxresult.gxrychoose',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'人员选择',
        url   :'/rychoose',
        templateUrl : 'app/main/xhsc/procedure/gxrychoose.html',
        controller:'gxrychooseController as vm',
      })
      .state('app.xhsc.gx.regionStates',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'人员选择',
        url   :'/regionStates/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{maxRegion}',
        templateUrl : 'app/main/xhsc/procedure/regionStates.html',
        controller:'regionStatesController as vm',
      })
  }
})();
