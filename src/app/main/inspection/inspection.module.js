/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection',['app.core','angularFileUpload','gridshore.c3js.chart','angular-chartist'])
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
        url:'/inspection/{status}/{index}',
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
      .state('app.statistics', {
        abstract:true,
        views:{
          'content@app':{
            template : '<ui-view layout="column" flex></ui-view>'
          }
        }
      })
      .state('app.statistics.problem', {
        url:'/statistics',
        title:'',
        shell:{
          yfbar:true,
          title:false,
          swap:[
            {active:false,label:'任务',type:true},
            {active:true,label:'问题',type:false}
          ]
        },
        noBack:true,
        template:'<statistics-problem layout="column" flex></statistics-problem>'
      })
      .state('app.statistics.problemdetail', {
        url:'/problemdetail/{task_id}',
        title:'问题详情',
        hideFootbar:true,
        shell:{
          prev:true,
          prevIcon:true,
          title:false
        },
        noBack:false,
        template:'<statistics-problemdetail layout="column" flex></statistics-problemdetail>'
      })
      .state('app.statistics.problempage', {
        url:'/problempage',
        title:'问题统计',
        noBack:false,
        hideFootbar:false,
        shell:{
          date:true
        },
        template:'<statistics-problempage layout="column" flex></statistics-problempage>'
      })
      .state('app.statistics.taskpage', {
        url:'/taskage',
        title:'任务统计',
        hideFootbar:false,
        shell:{
          statistics:true
        },
        noBack:false,
        template:'<statistics-taskpage layout="column" flex></statistics-taskpage>'
      })
      .state('app.statistics.task', {
        url:'/task',
        title:'任务统计',
        noBack:false,
        template:'<statistics-task layout="column" flex></statistics-task>'
      })
      .state('app.meterreading', {
        abstract:true,
        views:{
          'content@app':{
            template : '<ui-view layout="column" flex></ui-view>'
          }
        }
      })
      .state('app.meterreading.page', {
        url:'/meterreading/{delivery_id}',
        title:'抄水电表',
        noBack:false,
        shell:{
          save:true
        },
        template:'<meterreading-page layout="column" flex></meterreading-page>'
      })

      .state('app.inspection.check', {
        url:'/check/{delivery_id}/{userId}',
        title:'',
        hideFootbar:true,
        shell:{
          yfbar:true,
          prev:true,
          prevIcon:true,
          csb:true,
          cjwt:true
        },
        noBack:false,
        template:'<inspection-check layout="column" flex></inspection-check>',
        params:{question:'',showPopup:'',publicquestion:'',issues:''}
      })
      .state('app.inspection.cjwt', {
        url:'/cjwt/{delivery_id}',
        title:'常见问题',
        hideFootbar:true,
        shell:{
          prev:true,
          prevIcon:true,
          title:false
        },
        noBack:false,
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
        url:'/detail/{id}',
        title:'问题详情',
        hideFootbar:true,
        shell:{
          prev:true,
          prevIcon:true,
          title:false
        },
        noBack:false,
        template:'<inspection-qdetail layout="column" flex></inspection-qdetail>'
      })
  }
})();
