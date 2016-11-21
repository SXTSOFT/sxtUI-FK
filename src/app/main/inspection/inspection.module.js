/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection',['app.core','angular-echarts','angularFileUpload'])
    .config(config);

  /**@ngInject*/
  function config($stateProvider, msNavigationServiceProvider){
    $stateProvider
      .state('app.inspection', {
        abstract:true,
        views:{
          'content@app':{
            template : '<ui-view layout="column" flex></ui-view>'
          }
        }
      })
      .state('app.inspection.desktop', {
        url:'/inspection',
        title:'',
        shell:{
          yfbar:true,
          title:false,
          swap:[
            {active:true,label:'任务',type:true},
            {active:false,label:'问题',type:false}
          ]
        },
        noBack:true,
        template:'<inspection-desktop layout="column" flex></inspection-desktop>'
      })
      .state('app.inspection.check', {
        url:'/check',
        title:'',
        hideFootbar:true,
        shell:{
          yfbar:true,
          prev:true,
          prevIcon:true,
          csb:true,
          cjwt:true
        },
        noBack:true,
        template:'<inspection-check layout="column" flex></inspection-check>'
      })
      .state('app.inspection.cjwt', {
        url:'/cjwt',
        title:'常见问题',
        hideFootbar:true,
        shell:{
          prev:true,
          prevIcon:true,
          title:false
        },
        noBack:true,
        template:'<inspection-cjwt layout="column" flex></inspection-cjwt>'
      })
      //.state('app.inspection.csb', {
      //  url:'/csb',
      //  title:'抄水表',
      //  hideFootbar:true,
      //  shell:{
      //    prev:true,
      //    prevIcon:true,
      //    title:false,
      //    next:'保存'
      //  },
      //  noBack:true,
      //  template:'<inspection-csb layout="column" flex></inspection-csb>'
      //})
      .state('app.inspection.detail', {
        url:'/detail',
        title:'问题详情',
        hideFootbar:true,
        shell:{
          prev:true,
          prevIcon:true,
          title:false
        },
        noBack:true,
        template:'<inspection-qdetail layout="column" flex></inspection-qdetail>'
      })
  }
})();
