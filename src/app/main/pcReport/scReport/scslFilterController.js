/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function() {
    'use strict';

    angular
        .module('app.pcReport_sl')
        .controller('scslFilterController', scslFilterController);

    /**@ngInject*/
    function scslFilterController($scope, remote, $mdDialog, $state, $rootScope, $timeout, $window) {
        var vm = this;
        $scope.currentSC;
        var mobileDetect = new MobileDetect(window.navigator.userAgent);
        vm.isMobile = mobileDetect.mobile();
        vm.isiPad = mobileDetect.mobile() == "iPad";
        $scope.$watch('project.pid', function() {
            $scope.currentSC = null;
            remote.Project.GetMeasureItemInfoByAreaID($scope.project.pid).then(function(r) {
                if (r && r.data) {
                    vm.mes = r.data;
                }
            })
        })
        $scope.$watch('project.pid', function() {
            if ($scope.project.pid || $scope.project.isGo) {
                load()
            } else {
                $scope.project.isGo = true;
            }
        })
        $scope.$watch('currentSC', function() {
            if ($scope.currentSC) {
                load()
            }

        })

      vm.go=function(item,role){
        var relaArr=item.RelationID.split(',');
        var relationID;
        switch (role){
          case 0:
            relationID=relaArr.find(function (o) {
              return o.indexOf("_0")>-1;
            })

            if (!relationID){
              relationID=relaArr.find(function (o) {
                return o.indexOf("_1")>-1;
              })
            }

            break;
          case 2:
            relationID=relaArr.find(function (o) {
              return o.indexOf("_2")>-1;
            })
            break;
          default:
            relationID=relaArr.find(function (o) {
              return o.indexOf("_2")==-1&&(o.indexOf("_0")==-1&&o.indexOf("_1")==-1);
            })
            break;
        }
        $state.go("app.xhsc.scsl.schztb",{
          regionId: item.AreaID,
          RegionName: item.AreaName,
          name: item.AreaName,
          db:relationID,
          measureItemID: item.AcceptanceItemID,
          pname: item.MeasureItemName
        });
      }

        if ($rootScope.scslFilter) {
            $scope.currentSC = $rootScope.scslFilter.currentSC;
            $scope.project = $rootScope.scslFilter.project;

        }
        $scope.pageing = {
            page: 1,
            pageSize: 10,
            total: 0
        }
        $scope.$watch("pageing.pageSize", function() {
            if ($scope.pageing.pageSize) {
                load();
            }
        }, true);

      vm.btnShow=function (item,indentiy) {
        var r =item.RelationID.indexOf(indentiy)>-1
        if (!r&&indentiy=="_0"){
          if (item.RelationID.indexOf('_1')>-1){
            return true
          }
        }
        if (!r&&indentiy=='_4'){
          if (item.RelationID.indexOf('_0')==-1&&item.RelationID.indexOf('_1')==-1&&item.RelationID.indexOf('_2')==-1){
            return true
          }
        }
        return r;
      }
        function load() {
            remote.Assessment.GetMeasureList({
                ProjectId: $scope.project.pid ? $scope.project.pid : "",
                AcceptanceItemIDs: $scope.currentSC ? [$scope.currentSC] : [],
                PageSize: $scope.pageing.pageSize,
                CurPage: $scope.pageing.page - 1
            }).then(function(r) {
                $scope.pageing.total = r.data.TotalCount;
                vm.source = r.data.Data;
                vm.source.forEach(function(o) {
                    o.MeasureTime = o.MeasureTime ? o.MeasureTime : "";
                })
                $rootScope.scslFilter = {
                    currentSC: $scope.currentSC,
                    project: $scope.project
                }

            }).catch(function() {});
        }
        vm.pageAction = function(title, page, pageSize, total) {
            $scope.pageing.page = page;
            load();
        }

        vm.Lookintoys = function(item) {
            $state.go('app.xhsc.gx.gxzgreport', { InspectionId: item.InspectionId, acceptanceItemID: item.AcceptanceItemID, acceptanceItemName: item.AcceptanceItemName, projectId: item.ProjectID });
        }
        $scope.project = {
            isMore: true,
            onQueryed: function(data) {
                $scope.project.data = data;
            }
        };

        //--------------------------------------------以下为移动适配---------------------------------------
        vm.source = remote.Project.getMap();
        vm.gxSelected = [];
        vm.secSelected = [];
    }
})();
