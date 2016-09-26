(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planBuild',{
      templateUrl:'app/main/plan/component/plan-build.html',
      controller:planBuild,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planBuild($scope,api){
    $scope.msWizard = {
      selectedIndex:2
    }
    var vm = this;
    vm.data = {

    }
    vm.getMaps = function () {
      return api.xhsc.Project.getMap().then(function (r) {
        vm.data.projects = r.data;
      })
    }
    $scope.$watch('msWizard.selectedIndex',function () {
      switch ($scope.msWizard.selectedIndex){
        case 1:

          break;
      }
    })
  }
})(angular,undefined);
