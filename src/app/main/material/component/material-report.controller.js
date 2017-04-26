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
    function materialReport($scope, api, sxt, utils, $filter,$mdDialog) {
        var vm = this;
        vm.total = 0;
        $scope.pageing = {
            page: 1,
            pageSize: 10
        };
        vm.rendered = false;
        vm.date = {};
        var dateFilter = $filter('date')
        vm.date.eDate = new Date();
        var date_tmp = new Date()
        date_tmp.setDate(date_tmp.getDate() - 7);
        vm.date.sDate = date_tmp;
        vm.regionId = '', vm.sectionId = '';

        vm.host = sxt.app.api;
        vm.projects = [];
        // var mobileDetect = new MobileDetect(window.navigator.userAgent);
        // vm.isMobile = mobileDetect.mobile();
        // vm.isiPad = mobileDetect.mobile() == "iPad";
        var mobileDetect = new MobileDetect(window.navigator.userAgent);
        vm.isMobile = mobileDetect.mobile();
        // vm.getProjects = function () {
        //     if (vm.projects.length == 0) {
        //         return api.xhsc.Project.getMap().then(function (r) {
        //             vm.projects = r.data;
        //         });
        //     }
        // };

        vm.isShowData = true;
        if (vm.isMobile) {
            vm.isShowData = false;
        }

        api.xhsc.Project.getMap().then(function (r) {
            vm.projects = r.data;
            vm.pids = r.data.map(function (r) { return r.ProjectID });
            getData(vm.pids, '', '', '', '');
        });

        vm.clearRegion = function (pid) {
            vm.regions = [];
            vm.sections = [];
            vm.pids = pid;
            vm.regionId = '';
            vm.sectionId = '';
        }

        vm.getAreas = function (pId) {
            return api.xhsc.Project.GetAreaChildenbyID(pId).then(function (r) {
                vm.regions = r.data;
            });
        };

        vm.clearSection = function (rid) {
            vm.sections = [];
            vm.regionId = rid;
            vm.sectionId = '';
        }

        vm.getSections = function (aId) {
            return api.material.materialPlan.GetProjectSection(aId).then(function (e) {
                vm.sections = e.data;
            });
        };

        vm.getData = function (sid) {
            vm.sectionId = sid;
            // return api.material.materialPlan.getMaterialReport(sid, { Skip: page.Skip, Limit: page.Limit }).then(function (r) {
            //     vm.source = r.data.Items || [];
            //     $scope.pageing.total = r.data.TotalCount;
            // });
        }

        vm.pop=function (item) {
          $mdDialog.show({
            parent: angular.element(document.body),
            // targetEvent: $event,
            template:'<md-dialog style="width: 100%;height: 100%;max-height: 100%;max-width: 100%">' +
                        '<md-toolbar class="md-hue-2" layout="row"  style="height: 44px;background-color: #e93030" layout-align="center center">'+
                          '<span flex></span>'+
                          '<h3>详细信息</h3>'+
                          '<span flex style="text-align: right"><md-button style="margin-right: -1%"  ng-click="cancel()">关闭</md-button></span>'+
                        '</md-toolbar>'+
                        '<material-batch-detail flex layout="column"></material-batch-detail>'+
                      '</md-dialog>',
            controller: function ($scope) {
              $scope.planId=item.PlanId;
              $scope.cancel=function () {
                $mdDialog.cancel();
              }
            }

          })
        }

        function getData(pids, rid, sid, sDate, eDate) {
            vm.rendered = false;
            var page = utils.getPage($scope.pageing);
            return api.material.materialPlan.getMaterialReport({ pids: pids, rid: rid, sid: sid, sDate: dateFilter(sDate, 'yyyy-MM-dd'), eDate: dateFilter(eDate, 'yyyy-MM-dd'), Skip: page.Skip, Limit: page.Limit }).then(function (r) {
                vm.source = r.data.Items || [];
                vm.total = r.data.TotalCount;
                vm.rendered = true;
            });
        }

        vm.pageAction = function (title, page, pageSize, total) {
            $scope.pageing.page = page;
        }

        $scope.$watch("pageing", function () {
            if (vm.pids)
                getData(vm.pids, vm.regionId, vm.sectionId, vm.date.sDate, vm.date.eDate)
        }, true);

        vm.printBatchCount = function () {
            $('#export').val($("#divReport").html());
        }

        vm.cx = function () {
            getData(vm.pids, vm.regionId, vm.sectionId, vm.date.sDate, vm.date.eDate)
            if (vm.isMobile) {
                vm.isShowData = true;
            }
        }

        vm.goBack = function () {
            vm.isShowData = false;
        }
    };
})(angular, undefined);
