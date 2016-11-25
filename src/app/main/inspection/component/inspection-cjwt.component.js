/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionCjwt',{
      templateUrl:'app/main/inspection/component/inspection-cjwt.html',
      controller:inspectionCjwtController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionCjwtController($scope,utils,$state,$rootScope){

    var vm = this;

    $rootScope.shell.prev = '返回';
    utils.onCmd($scope,['prev'],function(cmd,e){


    })
    vm.select = function(){

    }
  }
})();
