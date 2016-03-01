/**
 * Created by jiuyuong on 2016/2/25.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydLink3Controller', SzgcyhydLink3Controller);

  /** @ngInject */
  function SzgcyhydLink3Controller ($scope, builds) {
    //$scope.$parent.$parent.data.itemName = $stateParams.itemName;
    //$scope.sxtfloor = [
    //    [50, 50, 10, 10, 15, 1],
    //    [50, 20, 10, 10, 10, 2]
    //];
    var vm = this;
    vm.sellLine = 0.6;
    vm.setFloor = function (current) {
      $scope.$parent.vm.current = current;
    }
    console.log('hm',$scope,vm)
    vm.onHammer = function(){
      console.log('b')
    }
    vm.data = builds;
    //console.log('bulids',builds)
    vm.buildLen = builds.builds.length;

    vm.panzoomConfig = {
      zoomLevels: 10,
      neutralZoomLevel: 4,
      scalePerZoomLevel: 0.5
    };
    vm.model = {};
  }

})();
