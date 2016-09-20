/**
 * Created by lss on 2016/9/18.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport_pg')
    .controller('pgScRegionController',pgScRegionController);

  /** @ngInject */
  function pgScRegionController($scope,$stateParams,$rootScope,xhUtils,remote){
    var vm=this;
    remote.Assessment.queryRegions($stateParams).then(function (result) {
      vm.sections = result.data;
    });
  }

})();
