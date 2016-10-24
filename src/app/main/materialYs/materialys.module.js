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
      .state('app.xhsc.materialys.download',{
        noBack:false,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        url:'',
        swap:[
          {active:true,label:'材料验收',url:'app.xhsc.materialys.download'},
          {active:false,label:'工序验收',url:'app.xhsc.gx.gxmain'}
        ],
        template: '<materialys-download flex layout="column"></materialys-download>'
      })
  }

})(angular,undefined);
