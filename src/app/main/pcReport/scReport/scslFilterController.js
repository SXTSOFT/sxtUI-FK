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

    vm.removeRegion=function(chip){
      if (chip.index||chip.index===0){
        for (var  i=chip.index;i<vm.ngModel.length;i++){
          vm.ngModel[i]=null;
        }
      }
      for (var i=$scope.secSelected.length-1;i>=0;i--)
      {
        if ($scope.secSelected[i].RegionID.toString().length>chip.RegionID.toString().length){
          $scope.secSelected.splice(i,1);
        }
      }
    }
    vm.secSource=[[],[],[],[],[]];
    vm.ngModel=[null,null,null,null,null]
    $scope.secSelected=[]
    remote.Project.getMap().then(function (result) {
      result.data.forEach(function (m) {
        vm.secSource[0].push({
          RegionID: m.ProjectID,
          RegionName: m.ProjectName
        })
      });
    });
    vm.getChild=function(item){
      $timeout(function(){
        function child(){
          return  remote.Project.GetAreaChildenbyID(item.RegionID);
        }
        switch ((""+item.RegionID).length){
          case 5:
            item.index=0;
            child().then(function(r){
              vm.secSource[1]= r.data;
              console.log(r)
            });
            break;
          case 10:
            item.index=1;
            child().then(function(r){
              vm.secSource[2]= r.data;
            });
            break;
          case 15:
            item.index=2;
            child().then(function(r){
              vm.secSource[3]= r.data;
            });
            break;
          case 20:
            item.index=3;
            child().then(function(r){
              vm.secSource[4]= r.data;
            });
            break;
          case 25:
            item.index=4;
            child().then(function(r){
              vm.secSource[5]= r.data;
            });
            break;
        }
        $scope.secSelected.push(item);
      })
    }
    //vm.click=function(){
    //  $rootScope.scParams={
    //    scSelected: $scope.currentSC,
    //    secSelected:$scope.secSelected.length?$scope.secSelected[length-1]:null
    //  }
    //  $state.go("app.pcReport_sl_rp",{
    //    scSelected:$scope.currentSC,
    //    secSelected:$scope.secSelected.length?$scope.secSelected[$scope.secSelected.length-1].RegionID:null
    //  })
    //}
    $scope.$watch('project.pid',function(){
      $scope.currentSC = null;
      remote.Project.GetMeasureItemInfoByAreaID($scope.project.pid).then(function(r){
        if (r&& r.data){
          vm.mes=r.data;
        }
      })
    })
    $scope.$watch('project.pid',function(){
      if($scope.project.pid){
        load()
      }
    })
    $scope.$watch('currentSC',function(){
      if($scope.currentSC){
        load()
      }

    })
    //$scope.$watch(function(){
    //  return vm.ngModel[0];
    //},function(){
    //  if (vm.ngModel[0]){
    //    remote.Project.GetMeasureItemInfoByAreaID(vm.ngModel[0].RegionID).then(function(r){
    //      if (r&& r.data){
    //        vm.mes=r.data;
    //      }
    //    })
    //  }else {
    //    $scope.currentSC=null;
    //  }
    //});
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
      if ($scope.pageing.pageSize&&$scope.project.pid){
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
        ProjectId: $scope.project.pid,//vm.secSeleced,
        AcceptanceItemIDs:$scope.currentSC?[$scope.currentSC]:[],
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
    $scope.project = {
      isMore: true,
      onQueryed: function (data) {
        $scope.project.data = data;
      }
    };


  }
})();
