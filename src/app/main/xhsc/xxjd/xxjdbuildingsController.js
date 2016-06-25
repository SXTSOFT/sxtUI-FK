/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('xxjdbuildingsController',xxjdbuildingsController);

  /**@ngInject*/
  function xxjdbuildingsController(builds,remote,$scope,$stateParams,$rootScope){
    var vm = this;
    //$rootScope.title = $stateParams.projectName
    remote.Assessment.queryProcessBuildings('0000100002').then(function(result){
     // vm.builds = builds;
      console.log('res',result)
    })
    vm.builds = builds;
    vm.builds.floorNum = 0;
    vm.builds.builds.forEach(function(t){
      if(vm.builds.floorNum < t.floors){
        vm.builds.floorNum = t.floors;
      }
    })
   vm.buildLen = vm.builds.builds.length;
    vm.setBuild = function(item){
      $scope.$parent.current = item;
    }
    console.log('builds',vm.builds)
  }
})();
