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
  function progressController($scope,$stateParams,$rootScope,$mdSidenav,api,$q,utils,remote,$timeout,cookie,authToken)
  {
    var vm = this;
    var projectName=$stateParams.projectName;
    var projectId=$stateParams.projectId;
    $rootScope.title=projectName;
    var token=authToken.getToken();
    vm.href="www/index.html?projectId="+projectId+"&token="+token;
  }
})();
