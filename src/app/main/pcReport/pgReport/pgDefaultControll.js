/**
 * Created by lss on 2016/9/14.
 */
/**
 * Created by lss on 2016/9/13.
 */
/**
 * Created by lss on 2016/9/8.
 */
/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';
   angular
    .module('app.pcReport_pg')
    .controller('pgDefaultController',pgDefaultController);

  /**@ngInject*/
  function pgDefaultController($scope,remote,$mdDialog,$state,$rootScope,$timeout,$stateParams){
    var vm = this;
    $scope.year=$stateParams.year?$stateParams.year:"";
    $scope.quart=$stateParams.quart?$stateParams.quart:"";
    $scope.pageing={
      page:1,
      pageSize:10,
      total:0
    }
    vm.show=false;
    $scope.$watch("pageing.pageSize",function(){
      if ($scope.pageing.pageSize){
        load();
      }
    },true);

    function load(){
      remote.Assessment.GetAsssmentReportLst({
        Curpage:$scope.pageing.page-1,
        PageSize:$scope.pageing.pageSize,
        Year:$scope.year?$scope.year:0,
        Quarter:$scope.quart?$scope.quart:0
      }).then(function(r){
        $scope.pageing.total= r.data.TotalCount;
        if (r&& r.data){
          vm.source= r.data.Data;
        }
        vm.show=true;
      }).catch(function(){
        vm.show=true;
      });
    }

    vm.pageAction=function(title, page, pageSize, total){
      $scope.pageing.page=page;
      load();
    }
    vm.gohz=function(item){
      $state.go("app.pcReport_pg_pkresult",{
        year:item.Year,
        projectID:item.AssessmentProjectID,
        quarter:item.Quarter,
        assessmentStage:item.AssessmentStage
      })
    }
    vm.gosc=function(item){
      $state.go("app.pcReport_pg_scRegion",{
        year:item.Year,
        projectID:item.AssessmentProjectID,
        quarter:item.Quarter,
        assessmentStage:item.AssessmentStage
      })
    }
    vm.goBack=function(){
      window.history.go(-1);
    }
  }
})();
/**
 * Created by lss on 2016/9/14.
 */
