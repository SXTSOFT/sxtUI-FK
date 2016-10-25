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
        url:'',
        template: '<material-plan-list flex layout="column"></material-plan-list>'
      })
      .state('app.xhsc.materialys.planDetail',{
        noBack:true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url:'',
        template:'<material-plan-detail></material-plan-detail>'
      })
      .state('app.xhsc.materialys.intoFactory',{
        title:'材料进厂',
        noBack:true,
        sendBt: true,
        rightArrow: false,
        leftArrow: false,
        url:'',
        template:'<material-into-factory></material-into-factory>'
      })
      .state('app.xhsc.materialys.materialAccept',{
        noBack:true,
        sendBt: true,
        rightArrow: false,
        leftArrow: true,
        url:'',
        swap:[
          {active:true,label:'材料验收',url:'app.xhsc.materialys.download'},
          {active:false,label:'工序验收',url:'app.xhsc.gx.gxmain'}
        ],
        template:'<material-plan-accept></material-plan-accept>'
      });
  }

})(angular,undefined);
