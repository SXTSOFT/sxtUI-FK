/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChoosePcController',ChoosePcController);

  /** @ngInject */
  function ChoosePcController($scope,$stateParams,$rootScope,xhUtils,remote){
    var vm=this;
    remote.Assessment.queryRegions($stateParams).then(function (result) {
      vm.sections = result.data;
    });
  }

})();
