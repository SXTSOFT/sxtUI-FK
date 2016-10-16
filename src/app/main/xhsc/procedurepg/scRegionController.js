/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scRegionController',scRegionController);

  /** @ngInject */
  function scRegionController($scope,$stateParams,sxt,$rootScope,xhUtils,remote,$timeout,$q,$state,$mdDialog,utils,db){
    var vm=this,
    projectId = $stateParams.projectId,
    acceptanceItemID=$stateParams.acceptanceItemID,
    acceptanceItemName = $stateParams.acceptanceItemName,
    area=$stateParams.area,
    assessmentID = $stateParams.assessmentID,
    isReport= vm.isReport=$stateParams.isReport;
    vm.maxRegion = $stateParams.maxRegion;
    $rootScope.title = $stateParams.acceptanceItemName;
    $rootScope.sendBt = false;
    vm.maxRegion = $stateParams.maxRegion;
    //var _db=db('pack'+ assessmentID);
    vm.nums={
      qb:0,
      wtj:0,//未提交
      ytj:0//已检查
    }
    function  setNum(status,region){
      if((vm.maxRegion==8&&region.RegionType==8)||vm.maxRegion==16&&region.RegionType>=8){
        vm.nums.qb++;
        switch (status){
          case  0:
            vm.nums.wtj++;
            break;
          case  1:
            vm.nums.ytj++;
            break;
        }
      }
    }

    function  load(){

      vm.nums={
        qb:0,
        wtj:0,//未提交
        ytj:0//已检查
      }

      function initRegion(region){
        function ConvertClass(status){
          var style;
          switch (status){
            case 0:
              style="wait";
              break;
            case 1:
              style="pass";
              break;
            default:
              break;
          }
          return style;
        }
        function _init(region){
          function setStatus(statusArr){
            if (angular.isArray(statusArr)&&statusArr.find(function(k){
                    return k==acceptanceItemID;
              })){
                return 1;
            }
            return 0;
          }
          region.Status=setStatus(region.StatusList)

          if (region&&region.RegionType==8||region&&region.RegionType==16){
              region.style= ConvertClass(region.Status);
              setNum(region.Status,region);
          }
          if (region&&region.Children.length){
            region.Children.forEach(function(r){
              _init(r);
            });
          }
          if (region.RegionType==4){
            region.floors=[];
            region.Children.forEach(function(k){
              if (!k.Children.length){
                region.floors.push(k)
              }
            })
          }
        }
        _init(region);
      }

      vm.isRegionShow=function(region){
        if(vm.maxRegion>8){
          if (region.Children&&region.Children.length){
            var f= region.Children.find(function(o){
              return o.Status==vm.filterNum||vm.filterNum==-1;
            });
            if (f){
              return true;
            }
          }
        }
        return region.Status==vm.filterNum||vm.filterNum==-1;
      }

      function  callBack(r){
        vm.loading = true;
        var project= r.data.data,_area;
        if (angular.isArray(project.Children)){
          project.Children.forEach(function(k){
            initRegion(k);
          });
          vm.houses =  project.Children;
        }
      }
      remote.Assessment.GetRegionTreeInfo(projectId,'pack'+assessmentID).then(callBack);
    }

    load();

    vm.selected = function(r){
      var routeData={
        areaId: r.RegionID,
        regionId: r.RegionID,
        RegionName: r.RegionName,
        name: r.FullRegionName,
        regionType: r.RegionType,
        db:assessmentID,
        measureItemID:acceptanceItemID,
        pname:acceptanceItemName
      }
      $state.go('app.xhsc.scsl._sc',routeData);
      //if (isReport=='0'||isReport==0){
      //  $state.go('app.xhsc.scsl._sc',routeData);
      //}else {
      //  $state.go('app.xhsc.scsl.schztb',routeData);
      //}
    }
    //总包点击事件

    vm.zk = function(item){
      item.show = !item.show;
    }
    vm.filterNum = isReport=='1'? 1:-1;
    vm.filter = function(num){
      vm.filterNum = num;
    }
  }
})();
