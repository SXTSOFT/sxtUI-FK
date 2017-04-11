
(function (angular, undefined) {
  'use strict';
  angular
    .module('app.insideYs')
    .component('insideYsList', {
      templateUrl: 'app/main/pcReport/insideYs/component/insideYs-list.html',
      controller: insideYs,
      controllerAs: 'vm'
    });
  /** @ngInject */
  function insideYs($scope, api, utils) {
    var vm = this;
    load();
    vm.projectData = [];
    vm.selected = [];

    $scope.$watch("vm.selected", function () {
      vm.data = vm.lsData && vm.lsData.filter(function (f) {
        return vm.selected.length == 0 || vm.selected.find(function (select) { return f.status == select })
      });
    }, true);

    $scope.$watch("vm.project", function () {
      vm.data = vm.lsData && vm.lsData.filter(function (f) {
        return vm.project.length == 0 || vm.project.find(function (select) { return f.rectifyOu == select })
      });
    }, true);
    function load(rectifyOu, status) {
      api.insideYs.batch.getList({ rectifyOu: rectifyOu, status: status }).then(function (r) {
        vm.data = r.data;
        vm.lsData = vm.data;
        r.data.forEach(function (item) {
          if (!vm.projectData.find(function (f) { return f.rectifyOu == item.rectifyOu }) && item.rectifyOu) {
            vm.projectData.push({ rectifyOu: item.rectifyOu, rectifyOuName: item.rectifyOuName })
          }
        }, this);

      });
    };

    vm.toggle = function (item, list) {
      if (list == null) return;
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

  }
})(angular, undefined);
