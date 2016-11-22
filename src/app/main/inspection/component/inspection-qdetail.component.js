/**
 * Created by emma on 2016/11/16.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionQdetail',{
      templateUrl:'app/main/inspection/component/inspection-qdetail.html',
      controller:inspectionQdetailController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionQdetailController($stateParams){

    var vm = this;
  }
})();
