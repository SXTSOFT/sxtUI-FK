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
    vm.click=function(){
      $rootScope.scParams={
        scSelected: $scope.currentSC,
        secSelected:$scope.secSelected.length?$scope.secSelected[length-1]:null
      }
      $state.go("app.pcReport_sl_rp",{
        scSelected:$scope.currentSC,
        secSelected:$scope.secSelected.length?$scope.secSelected[0].RegionID:null
      })
    }

    $scope.$watch(function(){
      return vm.ngModel[0];
    },function(){
      if (vm.ngModel[0]){
        remote.Project.GetMeasureItemInfoByAreaID(vm.ngModel[0].RegionID).then(function(r){
          if (r&& r.data){
            vm.mes=r.data;
          }
        })
      }else {
        $scope.currentSC=null;
      }
    });

  }
})();
