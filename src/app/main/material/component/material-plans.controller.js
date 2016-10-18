/**
 * Created by 陆科桦 on 2016/10/17.
 */

(function (angular,undefined) {
  'use strict';
  angular
    .module('app.material')
    .component('materialPlans',{
      templateUrl:'app/main/material/component/material-plans.html',
      controller:materialPlans,
      controllerAs:'vm'
    })

  /** @ngInject */
  function materialPlans($scope,api,utils) {
    var vm = this;
    vm.data = {};
    vm.getMaps = function () {
      return api.xhsc.Project.getMap().then(function (r) {
        vm.projects = r.data;
      })
    };

    vm.getSections = function () {
      return api.xhsc.Project.GetAreaChildenbyID(vm.data.ProjectId).then(function (r) {
        vm.sections = r.data;
      })
    }
  }

})(angular,undefined);
