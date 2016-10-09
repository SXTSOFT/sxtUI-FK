/**
 * Created by lss on 2016/9/12.
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
    .module('app.pcReport_ys')
    .controller('gxysReportController',gxysReportController);

  /**@ngInject*/
  function gxysReportController($scope,remote,$mdDialog,$state,$rootScope ){
    var vm = this;
    var params=$rootScope.gxParams;
    vm.gxSelected=params&&params.gxSelected? params.gxSelected:[];
    vm.secSelected=params&&params.secSelected? params.secSelected:[];
    vm.show=false;

    function convertStatus(status){
      var zt=''
      switch (status){
        case 1:
          zt="待验收";
          break;
        case 2:
          zt="合格";
          break;
        case 4:
          zt="不合格";
          break;
        case 8:
          zt="未整改";
          break;
        case 16:
          zt="已整改";
          break;
        default:
          zt="未知";
          break;
      }
      return zt;
    }

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
      var tmp=[];
      vm.gxSelected.forEach(function(k){
        tmp.push(k.AcceptanceItemID);
      });
      vm.source=[];
      remote.Procedure.GetInspectionInfoListEx({
        PageSize:$scope.pageing.pageSize,
        CurPage:$scope.pageing.page-1,
        status:31,
        ProjectId: vm.secSelected.length?vm.secSelected[0]:"",
        AcceptanceItemIDs:tmp
      }).then(function(r){
        $scope.pageing.total= r.data.TotalCount;
        r.data.Data.forEach(function(o){
          //非自检单并根据工序过滤
          if (o.InspectionTime){
            var d=new Date(o.InspectionTime).Format("yyyy-MM-dd hh:mm:ss");
            o.InspectionTime=d;
          }
          o.statusName=convertStatus(o.Status)
          vm.source.push(o);
        });
        vm.show=true;
      }).catch(function(){
        vm.show=true;
      });
    }

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
