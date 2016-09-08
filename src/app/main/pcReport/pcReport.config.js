/**
 * Created by lss on 2016/9/8.
 */
(function ()
{
  'use strict';

  angular
    .module('app.pcReport', ['app.pcReport_ys'])
    .config(config);

  /** @ngInject */
  function config(msNavigationServiceProvider,$stateProvider)
  {
    // Navigation
    msNavigationServiceProvider.saveItem('report', {
      title : '报表中心',
      group : true,
      weight: 1
    });


    msNavigationServiceProvider.saveItem('report.ysReport', {
      title: '验收',
      icon : 'icon-poll',
      weight:1
    });
    msNavigationServiceProvider.saveItem('report.ysReport.yshzReport', {
      title: '汇总报表',
      state: 'app.xhsc.report.default',
      weight:1
    });

    msNavigationServiceProvider.saveItem('report.ysReport.gxysReport', {
      title: '工序验收报表',
      state: 'app.pcReport_ys_gx',
      weight:2
    });

    msNavigationServiceProvider.saveItem('report.ysReport.scslReport', {
      title: '实测实量报表',
      state: '/',
      weight:3
    });

    msNavigationServiceProvider.saveItem('report.pgReport', {
      title: '评估',
      icon : 'icon-poll',
      weight:2
    });
    msNavigationServiceProvider.saveItem('report.pgReport.xcpgReport', {
      title: '评估',
      weight:1
    });
    //msNavigationServiceProvider.saveItem('components.charts.chart-js', {
    //  title: 'Chart.js',
    //  state: 'app.components_charts_chart-js'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.charts.chartist', {
    //  title: 'Chartist',
    //  state: 'app.components_charts_chartist'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.charts.nvd3', {
    //  title: 'nvD3',
    //  state: 'app.components_charts_nvd3'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.maps', {
    //  title: 'Maps',
    //  icon : 'icon-map-marker',
    //  state: 'app.components_maps'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.price-tables', {
    //  title: 'Price Tables',
    //  icon : 'icon-view-carousel',
    //  state: 'app.components_price-tables'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.tables', {
    //  title: 'Tables',
    //  icon : 'icon-table-large'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.tables.simple-table', {
    //  title: 'Simple Table',
    //  state: 'app.components_tables_simple-table'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.tables.datatable', {
    //  title: 'Datatable',
    //  state: 'app.components_tables_datatable'
    //});
    //
    //msNavigationServiceProvider.saveItem('components.widgets', {
    //  title: 'Widgets',
    //  icon : 'icon-apps',
    //  state: 'app.components_widgets'
    //});
  }
})();
