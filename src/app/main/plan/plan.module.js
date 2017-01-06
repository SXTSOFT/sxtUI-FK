/**
 * Created by jiuyuong on 2016/3/30.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.plan', ['app.core','app.xhsc',
      'gantt',
      'gantt.sortable',
      'gantt.movable',
      'gantt.drawtask',
      'gantt.tooltips',
      'gantt.bounds',
      'gantt.progress',
      'gantt.table',
      'gantt.tree',
      'gantt.groups',
      'gantt.dependencies',
      'gantt.overlap',
      'gantt.resizeSensor','angularFileUpload'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider
      .state('app.plan', {
        url: '/plan',
        views: {
          'content@app': {
            template: '<ui-view class="animate-slide-left" flex layout="column"></ui-view>'
          }
        },
        abstract: true
      })
      .state('app.plan.task', {
        url: '/task',
        abstract: true,
        template: '<ui-view flex layout="column"></ui-view>'
      })
      .state('app.plan.task.demo', {
        url: '/demo/taskTable',
        template: '<div task-table flex></div>'
      })
      .state('app.plan.task.list', {
        url: '',
        template: '<plan-tasks flex layout="column"></plan-tasks>'
      })
      .state('app.plan.task.detail', {
        url: '/levels/{id}',
        template: '<plan-task-v flex layout="column"></plan-task-v>'
      })
      .state('app.plan.task.detailLevel', {
        url: '/level0/{id}',
        template: '<plan-task-level flex layout="column"></plan-task-level>'
      })
      .state('app.plan.template', {
        url: '/temp',
        abstract: true,
        template: '<ui-view flex layout="column"></ui-view>'
      })
      .state('app.plan.template.list', {
        url: '',
        template: '<plan-templates flex layout="column"></plan-templates>'
      })
      .state('app.plan.template.detail', {
        url: '/{id}/{taskLibraryId}',
        template: '<plan-template flex layout="column"></plan-template>'
      })
      .state('app.plan.bc', {
        url: '/bc',
        abstract: true,
        template: '<ui-view flex layout="column"></ui-view>'
      })
      .state('app.plan.bc.list', {
        url: '',
        template: '<plan-bc flex layout="column"></plan-bc>'
      })
      .state('app.plan.bc.detail', {
        url: '/{id}',
        template: '<plan-bcAdd flex layout="column"></plan-bcAdd>'
      })
      .state('app.plan.buildPlan',{
        url:'/build',
        template:'<plan-build flex layout="column"></plan-build>'
      })
      .state('app.plan.create',{
        url:'/create',
        template:'<plan-create flex layout="column"></plan-create>'
      })

      .state('app.plan.milestone',{
        url:'/milestone/{id}',
        abstract:true,
        template:'<ui-view layout="column" flex></ui-view>'
        //template:'<plan-milestone flex layout="column"></plan-milestone>'
      })
      .state('app.plan.milestone.gantt',{
        url:'/gantt',
        template:'<plan-milestone flex layout="column"></plan-milestone>'
      })
      .state('app.plan.milestone.item',{
        url:'/item',
        template:'<plan-gantt flex layout="column"></plan-gantt>'
      })
      .state('app.plan.gantts',{
        url:'/gantts',
        template:'<plan-ganttlist flex layout="column"></plan-ganttlist>'
      })
      .state('app.plan.personplan',{
        url:'/personplan',
        template:'<plan-personplan layout="column" flex></plan-personplan>',
        sendBt: false,
        noBack:true
      })
      .state('app.plan.report',{
        url:'/report',
        template:'<plan-report layout="column" flex></plan-report>'
      })
    msNavigationServiceProvider.saveItem('plan', {
      title: '计划管理',
      group: true,
      weight: 2
    });
    msNavigationServiceProvider.saveItem('plan.build', {
      title: '创建计划',
      state: 'app.plan.buildPlan',
      icon: 'icon-open-in-new',
      weight: 1
    });
    msNavigationServiceProvider.saveItem('plan.gantt', {
      title: '查看计划',
      state: 'app.plan.gantts',
      icon: 'icon-poll',
      weight: 1
    });
    msNavigationServiceProvider.saveItem('plan.template', {
      title: '模板管理',
      icon: 'icon-folder',
      weight: 1
    });
    msNavigationServiceProvider.saveItem('plan.personplan', {
      title: '个人计划',
      icon: 'icon-view-list',
      state:'app.plan.personplan',
      weight: 1
    });
    msNavigationServiceProvider.saveItem('plan.report', {
      title: '报表管理',
      icon: 'icon-table',
      state: 'app.plan.report',
      weight: 1
    });
    msNavigationServiceProvider.saveItem('plan.template.template', {
      title: '模板',
      state: 'app.plan.template.list',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('plan.template.task', {
      title: '任务',
      state: 'app.plan.task.list',
      weight: 1
    });
    //msNavigationServiceProvider.saveItem('plan.template.task.demo', {
    //  title: 'demo',
    //  state: 'app.plan.task.demo',
    //  icon: 'icon-account',
    //  weight: 1
    //});

    msNavigationServiceProvider.saveItem('plan.template.bc', {
      title: '补偿',
      state: 'app.plan.bc.list',
      weight: 1
    });
  }
})(angular, undefined);
