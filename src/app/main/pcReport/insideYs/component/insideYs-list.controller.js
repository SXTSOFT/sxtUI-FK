
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
  function insideYs($scope, api, $stateParams, utils) {
    var vm = this;
    vm.projectData = [];
    vm.selected = [1,2,4];
    vm.id = $stateParams.id;

    $scope.pageing = {
      page: 1,
      pageSize: 10,
      total: 0
    }

    $scope.$watch("vm.selected + vm.project + pageing.pageSize + pageing.page", function () {
      var status = vm.selected.reduce(function (item, value) { return item + value; },0);
      var project = (vm.project&&vm.project.join(','))||null;
      load(project,status);
    }, true);


    function load(rectifyOu, status) {
      api.insideYs.batch.getList(
        {
          rectifyOu: rectifyOu,
          status: status,
          Limit: $scope.pageing.pageSize,
          Skip: ($scope.pageing.page - 1) * $scope.pageing.pageSize
        }, vm.id).then(function (r) {
          vm.data = r.data;
          $scope.pageing.total = vm.data.totalCount;

            r.data.items.forEach(function(item){

             if (item.rectifyOu && item.rectifyOuName) {

              var ou = item.rectifyOu.split(',');
              var name = item.rectifyOuName.split(',');
              for(var i=0;i<ou.length;i++)
              {
                if(!vm.projectData.find(function (f) { return f.rectifyOu == ou[i] }))
                {
                  vm.projectData.push({ rectifyOu: ou[i], rectifyOuName: name[i] })
                }
              } 
            }

          },this);

        });
    };

    // $scope.$watch("pageing.pageSize", function () {
    //   if ($scope.pageing.pageSize) {
    //     load();
    //   }
    // }, true);


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

    vm.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };
    vm.exportExcel = function () {
      var url = window.sxt.app.api;
      return url + api.insideYs.batch.getListExcel(vm.id);
    }
    
  }
})(angular, undefined);
