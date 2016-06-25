/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('xxjdmainController',xxjdmainController);

  /**@ngInject*/
  function xxjdmainController($rootScope,$stateParams){
    var vm = this;
    $rootScope.title=$stateParams.projectName;
    vm.project={
      projectId:$stateParams.projectId,
      projectName:$stateParams.projectName
    }
  }
})();
