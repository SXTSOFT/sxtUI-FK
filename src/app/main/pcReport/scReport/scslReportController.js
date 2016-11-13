(function(){
  'use strict';
  angular
    .module('app.pcReport_sl')
    .controller('scslReportController',scslReportController);

  /**@ngInject*/
  function scslReportController($scope,remote,$mdDialog,$stateParams,$state,$rootScope ,$q,$window){
    var vm = this;

    vm.scSelected=$stateParams.scSelected?$stateParams.scSelected:"";
    vm.secSeleced=$stateParams.secSelected;


    vm.show=false;
    remote.Procedure.authorityByUserId().then(function(res){
      if (res&&res.data&&res.data.length){
        vm.role=res.data[0].MemberType;
      }else {
        vm.role=0;
      }
      //load();
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
        ProjectId: vm.secSeleced,
        AcceptanceItemIDs:vm.scSelected?[vm.scSelected]:[],
        PageSize: $scope.pageing.pageSize,
        CurPage: $scope.pageing.page-1
      }).then(function(r){
        $scope.pageing.total= r.data.TotalCount;
        vm.source= r.data.Data;
        vm.source.forEach(function (o) {
          o.MeasureTime=$window.moment(o.MeasureTime).format("YYYY-MM-DD");
        })
        vm.show=true;

      }).catch(function(){
        vm.show=true;
      });
    }
    //load();
    vm.pageAction=function(title, page, pageSize, total){
      $scope.pageing.page=page;
      load();
    }
    vm.goBack=function(){
      window.history.go(-1);
    }

    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }
  }
})();
