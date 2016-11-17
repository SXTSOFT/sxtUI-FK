/**
 * Created by 陆科桦 on 2016/10/23.
 */
(function(angular,undefined){
  'use strict';
  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config($stateProvider,msNavigationServiceProvider){
    $stateProvider
      .state('app.xhsc.materialys', {
        url: '/ys',
        views: {
          'content@app': {
            template: '<ui-view flex layout="column"></ui-view>'
          }
        },
        abstract: true
      })
      // .state('app.xhsc.materialys.download',{
      //   noBack:false,
      //   sendBt: false,
      //   rightArrow: false,
      //   leftArrow: false,
      //   url:'',
      //   swap:[
      //     {active:true,label:'材料验收',url:'app.xhsc.materialys.download'},
      //     {active:false,label:'工序验收',url:'app.xhsc.gx.gxmain'}
      //   ],
      //   template: '<materialys-download flex layout="column"></materialys-download>'
      // })
      .state('app.xhsc.materialys.planList',{
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url:'/planList/{id}/{title}',
        template: '<material-plan-list flex layout="column"></material-plan-list>'
      })
      .state('app.xhsc.materialys.planDetail',{
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url:'/planDetail/{batchId}',
        template:'<material-plan-detail></material-plan-detail>'
      })
      .state('app.xhsc.materialys.intoFactory',{
        title:'材料进场',
        noBack:true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url:'/intoFactory/{status}/{BatchId}/{PlanId}/{PlanCount}/{Brand}',
        template:'<material-into-factory flex layout="column"></material-into-factory>'
      })
      .state('app.xhsc.materialys.checkInfo',{
        noBack:true,
        sendBt:true,
        title:'材料验收',
        url:'/checkInfo/{id}',
        template: '<material-ys-check-info flex layout="column"></material-ys-check-info>'
      })
      .state('app.xhsc.materialys.inspectionReport',{
        noBack:true,
        sendBt:true,
        title:'送检报告归档',
        url:'/inspectionReport/{id}',
        template: '<material-ys-inspection-report flex layout="column"></material-ys-inspection-report>'
      })
      .state('app.xhsc.materialys.approval',{
        noBack:true,
        sendBt:true,
        title:'材料验收详情',
        url:'/approval/{planId}/{id}',
        template: '<material-ys-approval flex layout="column"></material-ys-approval>'
      })
      .state('app.xhsc.materialys.inspection',{
        noBack:true,
        sendBt:true,
        title:'材料送检',
        url:'/inspection/{id}',
        template: '<material-plan-inspection flex layout="column"></material-plan-inspection>'
      })
      .state('app.xhsc.materialys.exit',{
        noBack:true,
        sendBt:true,
        title:'材料退场',
        url:'/exit/{id}',
        template: '<material-ys-exit flex layout="column"></material-ys-exit>'
      })
      .state('app.xhsc.materialys.unqualifiedExit',{
        noBack:true,
        sendBt:true,
        title:'材料退场',
        url:'/unqualifiedExit/{id}',
        template: '<material-unqualified-exit flex layout="column"></material-unqualified-exit>'
      })
      .state('app.xhsc.materialys.materialPlanProgress',{
        noBack:true,
        sendBt:true,
        title:'流程跟踪',
        url:'/materialPlanProgress/{id}',
        template: '<material-plan-progress flex layout="column"></material-plan-progress>'
      })
  }
})(angular,undefined);
