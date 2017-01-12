/**
 * Created by lss on 2016/9/12.
 */
/**
 * Created by lss on 2016/8/16.
 */
(function(){
  'use strict';

  angular
    .module('app.pcReport')
    .controller('pcReportMainController',pcReportMainController);

  /** @ngInject */
  function pcReportMainController(remote,$state,$q,utils,$mdSidenav,$rootScope,$mdDialog,api,xhscService ){
    var vm=this;
    api.setNetwork(0).then(function(){
      function show(ok,cancel,level) {
        function empty() {
          $mdDialog.hide();
        }
        function no() {
          $mdDialog.cancel();
        }
        ok=ok?ok:empty;
        cancel=cancel?cancel:empty;
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            $scope.ok=function () {
              if ($scope.level&&$scope.level>=7){
                ok($scope.currentBuild);
              }else {
                ok($scope.currentArea);
              }
            };
            $scope.currentBuild=null;
            $scope.level=level;
            $scope.cancel=cancel;
            xhscService.getRegionTreeOffline("",7,1).then(function (r) {
              $scope.projects=r;
              if(angular.isArray($scope.projects)&&$scope.projects.length){
                $scope.currentProject=$scope.projects[0];
                if ($scope.currentProject.Children.length){
                  $scope.currentArea=$scope.currentProject.Children[0];
                }
              }
            })

            $scope.$watch("currentArea",function (v) {
              if (v&&v.Children){
                $scope.builds=$.extend(true,[],v.Children);
                 $scope.currentBuild= $scope.builds[0];
              }
            })

          }],
          templateUrl: 'app/main/pcReport/showTemplate.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: false
        })
      }

      function pg_show(ok,cancel) {
        function empty() {
          $mdDialog.hide();
        }

        ok=ok?ok:empty;
        cancel=cancel?cancel:empty;
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            $scope.cancel=cancel;
            $scope.yearArray = [];
            for (var i = 0; i < 5; i++)
            {
              $scope.yearArray.push({id:(2015+i),value:(2015+i)});
            }

            $scope.ok=function () {
              if ($scope.year){
                ok($scope.year.value);
              }
            };
          }],
          templateUrl: 'app/main/pcReport/pg_showTemplate.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: false
        })
      }

      vm.scBuild=function () {
        show(function (area) {
          $mdDialog.hide();
          $state.go("app.pcReport_sl_jt",{areaId:area.RegionID});
        },null,7);
      }

      vm.scProject=function () {
        show(function (area) {
          $mdDialog.hide();
          $state.go("app.pcReport_sl_jt",{areaId:area.RegionID});
        });
      }

      vm.ysProject=function () {
        show(function (area) {
          $mdDialog.hide();
          $state.go("app.pcReport_ys_hz",{areaId:area.RegionID});
        });
      }

      vm.pg_xmb_zb_jl=function(stateCmd){
        pg_show(function(quarter){
          $mdDialog.hide();
          $state.go(stateCmd,{quarter:quarter});
        });
      }
      vm.pg_xmb_zb_class=function(stateCmd){
        pg_show(function(quarter){
          $mdDialog.hide();
          $state.go(stateCmd,{quarter:quarter});
        });
      }

      vm.pg_trial=function () {
        show(function (area) {
          $mdDialog.hide();
          $state.go("app.pcReport_pg_trial",{areaId:area.RegionID});
        },null,4);
      }
    })
  }
})();
/**
 * Created by lss on 2016/10/8.
 */
