/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('xxjdmainController',xxjdmainController);

  /**@ngInject*/
  function xxjdmainController($rootScope,$stateParams,sxt,ys7){
    var vm = this;
    $rootScope.title=$stateParams.projectName;
    vm.project={
      projectId:$stateParams.projectId,
      projectName:$stateParams.projectName
    }
    vm.playSxt =function(){
      ys7.token().then(function (token) {
        sxt.plugin.playYs7([token,'0cb133b18135433780ff396683dbf8da']);
      });
    }
  }
})();
