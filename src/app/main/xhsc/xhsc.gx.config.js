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
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序验收',
        url: '',
        templateUrl: 'app/main/xhsc/procedure/gxmain.html',
        controller: 'gxmainController as vm'
      })
      .state('app.xhsc.gx.gxlist', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序选择',
        url: '/gxlist/{projectId}',
        templateUrl: 'app/main/xhsc/procedure/gxlist.html',
        controller: 'gxlistController as vm'
      })
      .state('app.xhsc.gx.gxhousechoose', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url: '/gxhousechoose/{acceptanceItemID}/{projectId}/{acceptanceItemName}/{areaId}',
        templateUrl: 'app/main/xhsc/procedure/gxhousechoose.html',
        controller: 'gxhousechooseController as vm'
      })
      .state('app.xhsc.gx.gxtest', {
        noBack: true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url: '/gxtest/{acceptanceItemID}/{acceptanceItemName}/{name}/{regionId}/{projectId}/{areaId}',
        templateUrl: 'app/main/xhsc/procedure/gxtest.html',
        controller: 'gxtestController as vm'
      })
      .state('app.xhsc.gx.gxresult', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序结果',
        url: '/gxresult/{acceptanceItemName}/{name}/{areaId}/{projectId}',
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
        title :'工序',
        url   :'/gxdetail',
        templateUrl : 'app/main/xhsc/procedure/gxdetail.html',
        controller:'gxdetailController as vm'
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
      .state('app.xhsc.gx.gxresult.gxrychoose',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'人员选择',
        url   :'/rychoose',
        templateUrl : 'app/main/xhsc/procedure/gxrychoose.html',
        controller:'gxrychooseController as vm'
      })

  }
})();
