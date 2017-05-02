/**
 * Created by shaoshunliu on 2017/4/19.
 */
(function(){
  'use strict';
  angular
    .module('app.pcReport_v2Sass')
    .controller('v2SassPlanController',v2SassPlanController);

  /**@ngInject*/
  function v2SassPlanController($scope,remote,$mdDialog,$stateParams,$state,$rootScope ,$q,$window){
    var vm = this;
    vm.regions = [];
    remote.Project.getMap("nodb").then(function(result) {
      vm.regions.push({
        RegionID: "",
        RegionName: "全部"
      })
      result.data.forEach(function(m) {
        vm.regions.push({
          RegionID: m.ProjectID,
          RegionName: m.ProjectName
        })
      });
    });
    vm.ck = function(item) {
      $scope.project = item.RegionID;
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

    $scope.$watch("project", function() {
      if ($scope.project && $scope.project != "-" || $scope.project === "") {
        load();
      }
    });
    function load() {
      var t = [];
      vm.source = [];
      remote.vaSass.getPlan(
        $scope.project && $scope.project != "-" ? $scope.project : "",
        ($scope.pageing.page-1)*$scope.pageing.pageSize,
        $scope.pageing.pageSize
      ).then(function(r) {
        $scope.pageing.total = r.data.totalCount;
        r.data.items.forEach(function(o) {
          vm.source.push(o);
        });

      }).catch(function() {});
    }

    vm.pageAction = function(title, page, pageSize, total) {
      $scope.pageing.page = page;
      load();
    }


    vm.open=function (flag,item) {
      var des=item.projectName+item.description
      console.log(des);
      switch (flag){
        case "summary":
          $window.open("out/summaryReport.html?id="+item.id+"&des="+des+"&localhost="+sxt.app.api)
          break;
        case "daily":
          $window.open("out/dailyReport.html?id="+item.id+"&des="+des+"&localhost="+sxt.app.api)
          break;
        case "pro":
          $state.go("app.insideYs.list",{id:item.id});
          break;
      }
    };
  }
})();
