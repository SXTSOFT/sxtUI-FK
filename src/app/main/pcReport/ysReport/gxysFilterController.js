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
    .controller('gxysFilterController',gxysFilterController);

  /**@ngInject*/
  function gxysFilterController($scope,remote,$mdSidenav,$state,$rootScope,$timeout){
    var vm = this;
    $scope.gxSelected=[];
    $scope.project="-";
    vm.regions=[];
    var mobileDetect = new MobileDetect(window.navigator.userAgent);
    vm.isMobile=mobileDetect.mobile();
    vm.isiPad=mobileDetect.mobile()=="iPad";
    remote.Project.getMap().then(function (result) {
      vm.regions.push({
        RegionID: "",
        RegionName:"全部"
      })
      result.data.forEach(function (m) {
        vm.regions.push({
          RegionID: m.ProjectID,
          RegionName: m.ProjectName
        })
      });
    });
    vm.ck=function(item){
      $scope.project=item.RegionID;
    }
    $scope.click=function(){
      $mdSidenav("right").toggle()
    }

    remote.Procedure.queryProcedure().then(function(r){
      if (r.data&&angular.isArray(r.data)){
        $scope.procedures= r.data;
      }
    });

    $scope.choosego=function(item){
      var p=$scope.gxSelected.find(function(o){
        return o.AcceptanceItemID==item.AcceptanceItemID;
      });
      if (!p&&!item.checked){
        $scope.gxSelected.push(item)
      }
      if (p&&item.checked){
        var index=$scope.gxSelected.indexOf(p);
        $scope.gxSelected.splice(index,1);
      }
      initGxName();
    }
    function initGxName(){
      var attr=[];
      $scope.gxSelected.forEach(function(k){
        attr.push(k.AcceptanceItemName);
      });
      $scope.gxNames= attr.join(',');
    }
    $scope.ok=function(){
      $mdSidenav("right").toggle();
    }
    $scope.selectSpecialtyLow=function(item,parent){
      parent.WPAcceptanceList=item.WPAcceptanceList;
    }
    $scope.remove=function(item){
      $timeout(function(){
        var index=$scope.gxSelected.indexOf(item);
        if (index>-1){
          $scope.gxSelected.splice(index,1);
          initGxName();
        }
      })
    }

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
    $scope.$watch("project",function(){
      if (vm.isMobile&&!vm.isiPad){
        return;
      }
      if ($scope.project&&$scope.project!="-"||$scope.project===""){
        load();
      }
    });
    $scope.$watchCollection("gxSelected",function(){
      if (vm.isMobile&&!vm.isiPad){
        return;
      }
      if ($scope.gxSelected.length||$scope.gxSelected.isGo){
        load();
      }else {
        $scope.gxSelected.isGo=true;
      }
    });


    function load(){
      var t=[];
      $scope.gxSelected.forEach(function(k){
        t.push(k.AcceptanceItemID);
      });
      vm.source=[];
      remote.Procedure.GetInspectionInfoListEx({
        PageSize:$scope.pageing.pageSize,
        CurPage:$scope.pageing.page-1,
        status:31,
        ProjectId:$scope.project&&$scope.project!="-"?$scope.project:"",
        AcceptanceItemIDs:t
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
      }).catch(function(){
      });
    }

    vm.pageAction=function(title, page, pageSize, total){
      $scope.pageing.page=page;
      load();
    }
    vm.filter=function(){
      var p= vm.regions.find(function(k){
          return k.RegionID==$scope.project;
      })

      $rootScope.gxParams={
        gxSelected:$scope.gxSelected,
        secSelected:p&&p.RegionID?[p]:[]
      }
      $state.go("app.pcReport_ys_rp");
    }

    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }

  }
})();
