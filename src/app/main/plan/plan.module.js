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
      'gantt.resizeSensor'])
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
      .state('app.plan.task.list', {
        url: '',
        template: '<plan-tasks flex layout="column"></plan-tasks>'
      })
      .state('app.plan.task.detail', {
        url: '/{id}',
        template: '<plan-task flex layout="column"></plan-task>'
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
        url: '/{id}',
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
      .state('app.plan.bc.edit', {
        url: '/edit/{id}',
        template: '<plan-bcEdit flex layout="column"></plan-bcEdit>'
      })
      .state('app.plan.buildPlan',{
        url:'/build',
        template:'<plan-build flex layout="column"></plan-build>'
      })
      .state('app.plan.gantt',{
        url:'/gantt',
        template:'<plan-gantt flex layout="column"></plan-gantt>'
      })

    msNavigationServiceProvider.saveItem('plan', {
      title: '计划管理',
      group: true,
      weight: 2
    });
    msNavigationServiceProvider.saveItem('plan.build', {
      title: '创建计划',
      state: 'app.plan.buildPlan',
      icon: 'icon-account',
      weight: 1
    });
    msNavigationServiceProvider.saveItem('plan.gantt', {
      title: '查看计划',
      state: 'app.plan.gantt',
      icon: 'icon-account',
      weight: 1
    });
    msNavigationServiceProvider.saveItem('plan.template', {
      title: '模板管理',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('plan.template.template', {
      title: '模板',
      state: 'app.plan.template.list',
      icon: 'icon-account',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('plan.template.task', {
      title: '任务',
      state: 'app.plan.task.list',
      icon: 'icon-account',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('plan.template.bc', {
      title: '补尝',
      state: 'app.plan.bc.list',
      icon: 'icon-account',
      weight: 1
    });
  }
})(angular, undefined);
