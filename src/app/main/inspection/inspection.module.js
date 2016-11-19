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
        noBack:true,
        template:'<inspection-desktop layout="column" flex></inspection-desktop>'
      })
  }
})();
