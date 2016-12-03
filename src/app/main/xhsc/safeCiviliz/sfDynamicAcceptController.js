/**
 * Created by shaoshun on 2016/11/29.
 */
/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sfDynamicAcceptController',sfDynamicAcceptController);

  /**@ngInject*/
  function sfDynamicAcceptController($scope,$stateParams,remote,xhUtils,$rootScope,$state,$q,utils,api,xhscService){
    var vm = this;
    var projectId = $stateParams.projectId,
      areaId = $stateParams.areaId?$stateParams.areaId:$stateParams.regionId;
    vm.InspectionId=$stateParams.InspectionId;

    vm.info = {
      current:null,
      projectId:projectId,
      regionId:areaId,
      cancelMode:function () {
        vm.cancelCurrent(null);
      }
    };

    api.setNetwork(1).then(function(){
      vm.cancelCurrent = function ($event) {
        vm.info.current = null;
      }
      $scope.areas= xhscService.getRegionTreeOffline("", 31, 1);
      $scope.procedure=remote.safe.getSecurityItem.cfgSet({
        offline: true
      })("DayInspects");
      $scope.current={};


      $scope.$watch("current.region",function (v,o) {
        if (v&&$scope.current.procedure){
          vm.info.show=true;
        }else {
          vm.info.show=false;
        }
      })
      $scope.$watch("current.procedure",function (v,o) {
        if (v){
          if ($scope.current.region){
            vm.info.show=true;
          }else {
            vm.info.show=false;
          }
          vm.procedureData=[v];
          vm.procedureData.forEach(function(t){
            t.SpecialtyChildren = t.ProblemClassifyList;
            t.ProblemClassifyList.forEach(function(_t){
              _t.WPAcceptanceList = _t.ProblemLibraryList;
              _t.SpecialtyName = _t.ProblemClassifyName;
              _t.ProblemLibraryList.forEach(function(_tt){
                _tt.AcceptanceItemName = _tt.ProblemSortName +'.'+ _tt.ProblemDescription;
              })
            })
          })
        }
      })
    });

  }
})();
