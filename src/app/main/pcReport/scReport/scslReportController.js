(function(){
  'use strict';
  angular
    .module('app.pcReport_sl')
    .controller('scslReportController',scslReportController);

  /**@ngInject*/
  function scslReportController($scope,remote,$mdDialog,$stateParams,$state,$rootScope ,$q){
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
      $mdDialog.show({
        controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
        }],
        template: '<md-dialog   ng-cloak><md-dialog-content layout="column"> <md-progress-circular class="md-accent md-hue-1" md-diameter="20" md-mode="indeterminate"></md-progress-circular><p style="padding-left: 6px;">数据加载中...</p></md-dialog-content></md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false
      });
      remote.Assessment.GetMeasureList({
        ProjectId: vm.secSeleced,
        AcceptanceItemIDs:vm.scSelected?[vm.scSelected]:[],
        PageSize: $scope.pageing.pageSize,
        CurPage: $scope.pageing.page-1
      }).then(function(r){
        $scope.pageing.total= r.data.TotalCount;
        vm.source= r.data.Data;
        vm.show=true;
        $mdDialog.hide();
      }).catch(function(){
        vm.show=true;
        $mdDialog.cancel();
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
