/**
 * Created by lukehua on 2016/11/15.
 */

(function (angular, undefined) {
  'use strict';
  angular
    .module('app.material')
    .component('materialContracts', {
      templateUrl: 'app/main/material/component/material-contracts.html',
      controller: materialContracts,
      controllerAs: 'vm'
    });

  /** @ngInject */
  function materialContracts($scope, api, utils, auth) {
    var vm = this;
    var user = auth.current();
    $scope.pageing = {
      page: 1,
      pageSize: 10,
      total: 0
    };
    vm.pageAction = function (title, page, pageSize, total) {
      $scope.pageing.page = page;
    }
    $scope.$watch("pageing", function () {
      load();
    }, true);

    api.xhsc.Project.getMap("nodb").then(function (r) {
      vm.projects = r.data.map(function (r) { return r.ProjectID });
      load();
    });

    function load() {
      var page = utils.getPage($scope.pageing);
      if(!vm.projects) return;
      api.material.contract.getList({ Skip: page.Skip, Limit: page.Limit, projects: vm.projects.join(',') }).then(function (q) {
        vm.data = q.data.Items || [];
        $scope.pageing.total = q.data.TotalCount;
      });
    }

    vm.delete = function (id) {
      utils.confirm('确认删除此合同信息').then(function () {
        api.material.contract.delete(id).then(function () {
          load();
        })
      });
    }
  }

})(angular, undefined);
