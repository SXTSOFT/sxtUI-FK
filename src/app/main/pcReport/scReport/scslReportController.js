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
    vm.go=function(item,role){
      var relaArr=item.RelationID.split(',');
      var relationID;
      switch (role){
        case 0:
          relationID=relaArr.find(function (o) {
            return o.indexOf("_0")>-1||o.indexOf("_1")>-1;
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
            return o.indexOf("_2")==-1&&o.indexOf("_0")==-1;
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

    $scope.pageing={
      page:1,
      pageSize:10,
      total:0
    }

    vm.btnShow=function (item,indentiy) {
      var r =item.RelationID.indexOf(indentiy)>-1
      if (!r&&indentiy=="_0"){
        if (item.RelationID.indexOf('_1')>-1){
          return true
        }
      }
      if (!r&&indentiy=='_4'){
        if (item.RelationID.indexOf('_0')==-1&&item.RelationID.indexOf('_2')==-1){
          return true
        }
      }
      return r;
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
          o.MeasureTime=o.MeasureTime?o.MeasureTime:"";
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
