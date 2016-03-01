/**
 * Created by emma on 2016/2/23.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcbuilddetailController', SzgcdetailController);

  /** @ngInject */
  function SzgcdetailController($scope,details,$stateParams)
  {

    var vm = this;
    vm.build = {
      name: $stateParams.buildName || $scope.$parent.vm.current.name,
      building_id: $stateParams.buildId || $scope.$parent.vm.current.building_id,
      floors: $stateParams.floors || $scope.$parent.vm.current.floors,
      summary: $stateParams.summary || $scope.$parent.vm.current.summary,
      gx1: $scope.$parent.vm.current.gx1,
      gx2: $scope.$parent.vm.current.gx2
    }
    vm.data= {
      config: {
        showXAxis: true,
        showYAxis: true,
        showLegend: true,
        debug: true,
        stack: true,
        yAxis: {
          min: 0,
          splitNumber: vm.build.floors,
          max: vm.build.floors
        }
      },
      data:details
    };



  }

})();
