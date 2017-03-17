/**
 * Created by shaoshun on 2017/3/17.
 */
/**
 * Created by lss on 2016/10/10.
 */
/**
 * Created by lss on 2016/10/7.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('progressController', progressController);

  /** @ngInject */
  function progressController($scope,$stateParams,$mdSidenav,api,$q,utils,remote,$timeout,cookie)
  {
    var vm = this;
    vm.projectName=$stateParams.projectName;
    var projectId=$stateParams.projectId;
    vm.href="www/index.html?projectId="+projectId;
  }
})();
