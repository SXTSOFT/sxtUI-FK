/**
 * Created by lss on 2016/10/18.
 */

(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    $stateProvider
      .state('app.xhsc.sf',{
        url:'/sf',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.sf.sfmain', {
        noBack:false,
        sendBt: false,
        rightArrow: false,
        showgrzx:true,
        leftArrow: false,
        title: '安全文明',
        url: '',
        templateUrl: 'app/main/xhsc/safeCiviliz/safeCiviliz_main.html',
        controller: 'safeCiviliz_mainController as vm'
      })
  }
})();
