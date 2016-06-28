/**
 * Created by emma on 2016/6/24.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('xxjdbuildingsController',xxjdbuildingsController);

  /**@ngInject*/
  function xxjdbuildingsController(remote,$scope,$stateParams,$rootScope){
    var vm = this;
    $rootScope.title = $stateParams.projectName
    vm.stageId = '0000100002';
    remote.Assessment.queryProcessBuildings(vm.stageId).then(function(result){
     vm.builds = result.data;

      vm.builds.floorNum = 0;
      vm.builds.forEach(function(t){
        if(vm.builds.floorNum < t.floors){
          vm.builds.floorNum = t.floors;
        }
      })
      vm.buildLen = vm.builds.length;
      console.log('res',vm.builds)
    })
    //vm.builds = builds;

    vm.setBuild = function(item){
      $scope.$parent.current = item;
    }
    //console.log('builds',vm.builds)
  }
})();
