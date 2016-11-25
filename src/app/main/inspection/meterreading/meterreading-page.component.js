/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('meterreadingPage',{
      templateUrl:'app/main/inspection/meterreading/meterreading-page.html',
      controller:meterreadingPageController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function meterreadingPageController($scope,utils,$state){
    var vm = this;
    vm.myDate=new Date();


    utils.onCmd($scope,['save'],function(cmd,e){
      //保存
      $state.go("app.inspection.desktop")
    })
  }

})();
