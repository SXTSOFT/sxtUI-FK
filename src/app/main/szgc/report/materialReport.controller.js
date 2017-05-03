/**
 * Created by lukehua on 17/3/13.
 */
(function () {
    'use strict';

    angular
        .module('app.szgc')
        .controller('materialReportController', materialReportController);

    /** @ngInject */
    function materialReportController($scope, $filter, api, utils, $q) {
        var vm = this;
        vm.data = [];
        vm.loading = true;
        vm.switch = 'list';
        $q.all([api.szgc.vanke.projects({ page_size: 1000, page_number: 1 }),
        api.material.MaterialService.MaterialCount()
        ]).then(function (r) {
            r[0].data.data.forEach(function (p) {
                var c = r[1].data.Rows.find(function (count) { return count.ProjectId == p.project_id });
                if (c) {
                    p.TJ = c.TJ;
                    p.JD = c.JD;
                    p.ZX = c.ZX;
                } else {
                    p.TJ = '-';
                    p.JD = '-';
                    p.ZX = '-';
                }
                vm.data.push(p);
            })
            vm.loading = false;
        })

        vm.current = {};
        vm.showDetail = function (item) {
            $q.all([api.material.MaterialService.materialCountDetail(item.project_id),
                api.material.MaterialService.getSupervisorMaterialCount(item.project_id),
                api.material.MaterialService.materialCountResult(item.project_id)]).then(function (res) {
                $scope.batchData = res[0].data.Rows;
                $scope.supervisorData = res[1].data.Rows;
                $scope.mlCheckData = res[2].data.Rows;
            });
            vm.current = item;
            $scope.mlCheckData = [];
            vm.switch = 'detail';
            vm.listHide = false;
            vm.selType = 1;
        }

        vm.showResult = function (item) {
            api.material.MaterialService.materialCountResult(vm.current.project_id, item.ProcedureId).then(function (res) {
                $scope.mlCheckData = res.data.Rows;
            });
            vm.switch = 'result';
            vm.listHide = true;
        }

        $scope.$watch('vm.listHide', function () {
            if (vm.switch != 'list') {
                if (vm.listHide) {
                    vm.switch = 'result';
                } else {
                    vm.switch = 'detail';
                }
            }
        });

        $scope.$on('$destroy', $scope.$on('goBack', function (s, e) {
            if (vm.switch == 'detail' || vm.switch == 'result') {
                vm.switch = 'list';
                e.cancel = true;
                vm.listHide = true;
            }
            else if (vm.searBarHide) {
                e.cancel = true;
                vm.listHide = false;
            }
        }));
    }
})();
