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
  function meterreadingPageController(){
    var vm = this;
    vm.myDate=new Date();

  }

})();
