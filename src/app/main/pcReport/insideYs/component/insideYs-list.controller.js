
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
  function insideYs($scope, api,$stateParams, utils) {
    var vm = this;
    vm.projectData = [];
    vm.selected = [];
    vm.id=$stateParams.id;

    $scope.pageing = {
      page: 1,
      pageSize: 10,
      total: 0
    }

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
      api.insideYs.batch.getList(
        { rectifyOu: rectifyOu,
          status: status,
          Limit:$scope.pageing.pageSize,
          Skip: ($scope.pageing.page-1)*$scope.pageing.pageSize
        },vm.id).then(function (r) {
        vm.data = r.data;
        $scope.pageing.total = vm.data.totalCount;
        vm.lsData = vm.data;
        r.data.items.forEach(function (item) {
          if (!vm.projectData.find(function (f) { return f.rectifyOu == item.rectifyOu }) && item.rectifyOu) {
            vm.projectData.push({ rectifyOu: item.rectifyOu, rectifyOuName: item.rectifyOuName })
          }
        }, this);

      });
    };

    load();
    $scope.$watch("pageing.pageSize", function() {
      if ($scope.pageing.pageSize) {
        load();
      }
    }, true);


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
