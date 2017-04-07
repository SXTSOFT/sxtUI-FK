/**
 * Created by 陆科桦 on 2016/10/14.
 */

(function (angular, undefined) {
  'use strict';

  angular
    .module('app.material', ['app.core','app.xhsc','ui.tree','ngMaterial', 'ngMessages'])
    .config(config);
  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider
      .state('app.material', {
        url: '/material',
        views: {
          'content@app': {
            template: '<ui-view class="animate-slide-left" flex layout="column"></ui-view>'
          }
        },
        abstract: true
      })
      .state('app.material.list', {
        url:'/list',
        template:'<material-list flex layout="column"></material-list>'
      })
      .state('app.material.add', {
        url: '/add/{id}/{cid}',
        template: '<material-add flex layout="column"></material-add>'
      })
      .state('app.material.contracts', {
        url:'/contracts',
        template:'<material-contracts flex layout="column"></material-contracts>'
      })
      .state('app.material.contract', {
        url:'/contract/{id}',
        template:'<material-contract flex layout="column"></material-contract>'
      })
      .state('app.material.type', {
        url:'/type',
        template:'<material-type flex layout="column"></material-type>'
      })
      .state('app.material.typeAdd',{
        url:'/typeAdd/{id}',
        template:'<material-class-add flex layout="column"></material-class-add>'
      })
      .state('app.material.plans',{
        url:'/plans',
        template:'<material-plans flex layout="column"></material-plans>'
      })
      .state('app.material.plan',{
        url:'/plan/{id}',
        template:'<material-plan flex layout="column"></material-plan>'
      })
      .state('app.material.batchDetail',{
        url:'/batchDetail/{planId}',
        template:'<material-batch-detail flex layout="column"></material-batch-detail>'
      })
      .state('app.material.materialLibrary',{
        url:'/library/{cid}',
        template:'<material-library flex layout="column"></material-library>'
      })
      .state('app.material.materialReport',{
        url:'/materialReport',
        template:'<material-Report flex layout="column"></material-Report>'
      });

    msNavigationServiceProvider.saveItem('material', {
      allow: [{user: 'm',memberType:20}],
      title: '材料验收',
      group: true,
      weight: 2
    });

    // msNavigationServiceProvider.saveItem('material.type', {
    //   title: '材料分类',
    //   icon: 'icon-sort-variant',
    //   state: 'app.material.type',
    //   weight: 1
    // });

    // msNavigationServiceProvider.saveItem('material.list', {
    //   title: '材料管理',
    //   icon: 'icon-view-list',
    //   state: 'app.material.list',
    //   weight: 1
    // });

    msNavigationServiceProvider.saveItem('material.materialLibrary', {
      allow: [{user: 'm',memberType:16}],
      title: '集团材料库',
      icon: 'icon-view-list',
      state: 'app.material.materialLibrary',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('material.materialReport', {
      allow: [{user: 'm',memberType:20}],
      title: '材料验收报表',
      icon: 'icon-calendar-blank',
      state: 'app.material.materialReport',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('material.contracts', {
      allow: [{user: 'm',memberType:20}],
      title: '项目材料管理',
      icon: 'icon-account',
      state: 'app.material.contracts',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('material.plans', {
      allow: [{user: 'm',memberType:20}],
      title: '材料进场计划',
      icon: 'icon-calendar-text',
      state: 'app.material.plans',
      weight: 1
    });

  }
})(angular, undefined);
