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
    .module('app.pcReport_sl')
    .controller('scslFilterController',scslFilterController);

  /**@ngInject*/
  function scslFilterController($scope,remote,$mdDialog,$state,$rootScope,$timeout){
    var vm = this;
    $scope.currentSC;

    $scope.$watch('project.pid',function(){
      $scope.currentSC = null;
      remote.Project.GetMeasureItemInfoByAreaID($scope.project.pid).then(function(r){
        if (r&& r.data){
          vm.mes=r.data;
        }
      })
    })
    $scope.$watch('project.pid',function(){
      if($scope.project.pid||$scope.project.isGo){
        load()
      }else {
        $scope.project.isGo=true;
      }
    })
    $scope.$watch('currentSC',function(){
      if($scope.currentSC){
        load()
      }

    })

    remote.Procedure.authorityByUserId().then(function(res){
      if (res&&res.data&&res.data.length){
        vm.role=res.data[0].MemberType;
      }else {
        vm.role=0;
      }
      vm.go=function(item){
        $state.go("app.xhsc.scsl.schztb",{
          regionId: item.AreaID,
          RegionName: item.AreaName,
          name: item.AreaName,
          //regionType:Math.pow(2,(item.AreaID.length/5)),
          db:'scsl'+ item.ProjectID+'_'+vm.role,
          measureItemID: item.AcceptanceItemID,
          pname: item.MeasureItemName
        });
      }

      //业务数据包
    }).catch(function(r){});

    $scope.pageing={
      page:1,
      pageSize:10,
      total:0
    }

    $scope.$watch("pageing.pageSize",function(){
      if ($scope.pageing.pageSize){
        load();
      }
    },true);

    function load(){
      remote.Assessment.GetMeasureList({
        ProjectId: $scope.project.pid?$scope.project.pid:"",
        AcceptanceItemIDs:$scope.currentSC?[$scope.currentSC]:[],
        PageSize: $scope.pageing.pageSize,
        CurPage: $scope.pageing.page-1
      }).then(function(r){
        $scope.pageing.total= r.data.TotalCount;
        vm.source= r.data.Data;
      }).catch(function(){
      });
    }
    vm.pageAction=function(title, page, pageSize, total){
      $scope.pageing.page=page;
      load();
    }

    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }
    $scope.project = {
      isMore: true,
      onQueryed: function (data) {
        $scope.project.data = data;
      }
    };


  }
})();
