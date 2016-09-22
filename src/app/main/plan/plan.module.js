/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan', ['app.core'])
    .config(config);

  /** @ngInject */
  function config($stateProvider,msNavigationServiceProvider)
  {
    $stateProvider
      .state('app.plan', {
        url:'/plan',
        views:{
          'content@app':{
            template:'<ui-view class="animate-slide-left" flex layout="column"  style="overflow: hidden;"></ui-view>'
          }
        },
        abstract:true
      })
      .state('app.plan.task',{
        url:'/task',
        abstract:true,
        template:'<ui-view flex layout="column"></ui-view>'
      })
      .state('app.plan.task.list',{
        url:'',
        template:'<plan-tasks flex layout="column"></plan-tasks>'
      })
      .state('app.plan.task.detail',{
        url:'/{id}',
        template:'<plan-task flex layout="column"></plan-task>'
      })
    msNavigationServiceProvider.saveItem('plan', {
      title : '计划管理',
      group : true,
      weight: 2
    });
    msNavigationServiceProvider.saveItem('plan.gantt', {
      title: '查看计划',
      state: 'app.plan.gantt',
      icon:'icon-account',
      weight:1
    });
    msNavigationServiceProvider.saveItem('plan.task', {
      title: '任务管理',
      state: 'app.plan.task.list',
      icon:'icon-account',
      weight:1
    });
    msNavigationServiceProvider.saveItem('plan.template', {
      title: '模板管理',
      state: 'app.plan.template',
      icon:'icon-account',
      weight:1
    });
    msNavigationServiceProvider.saveItem('plan.build', {
      title: '生成计划',
      state: 'app.plan.template',
      icon:'icon-account',
      weight:1
    });
  }
})(angular,undefined);
