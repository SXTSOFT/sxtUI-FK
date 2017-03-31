/**
 * Created by lukehua on 2017/1/4.
 */

(function (angular, undefined) {
    'use strict';
    angular
        .module('app.material')
        .component('materialReport', {
            templateUrl: 'app/main/material/component/material-report.html',
            controller: materialReport,
            controllerAs: 'vm'
        });

    /** @ngInject */
    function materialReport($scope, api, sxt, utils) {
        var vm = this;
        $scope.pageing = {
            page: 1,
            pageSize: 10,
            total: 0
        };
        vm.host = sxt.app.api;
        vm.projects = [];
       
        var mobileDetect = new MobileDetect(window.navigator.userAgent);
        vm.isMobile = mobileDetect.mobile();
        vm.getProjects = function () {
            if (vm.projects.length == 0) {
                return api.xhsc.Project.getMap().then(function (r) {
                    vm.projects = r.data;
                });
            }
        };

        vm.clearRegion = function () {
            vm.regions = [];
            vm.sections = [];
            vm.regionId = null;
            vm.sectionId = null;
        }

        vm.getAreas = function (pId) {
            return api.xhsc.Project.GetAreaChildenbyID(pId).then(function (r) {
                vm.regions = r.data;
            });
        };

        vm.clearSection = function () {
            vm.sections = [];
            vm.sectionId = null;
        }

        vm.getSections = function (aId) {
            return api.material.materialPlan.GetProjectSection(aId).then(function (e) {
                vm.sections = e.data;
            });
        };

        vm.getData = function (sid) {
            var page = utils.getPage($scope.pageing);
            return api.material.materialPlan.getMaterialReport(sid, { Skip: page.Skip, Limit: page.Limit }).then(function (r) {
                vm.source = r.data.Items || [];
                $scope.pageing.total = r.data.TotalCount;
            });
        }

        vm.pageAction = function (title, page, pageSize, total) {
            $scope.pageing.page = page;
        }

        $scope.$watch("pageing", function () {
            vm.getData(vm.sectionId);
        }, true);

        vm.printBatchCount = function () {
            $('#export').val($("#divReport").html());
        }
    };
})(angular, undefined);