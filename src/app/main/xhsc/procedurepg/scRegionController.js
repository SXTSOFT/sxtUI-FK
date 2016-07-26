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
    role=$stateParams.role,
    assessmentID = $stateParams.assessmentID;
    vm.maxRegion = $stateParams.maxRegion;
    $rootScope.title = $stateParams.acceptanceItemName;
    $rootScope.sendBt = false;
    vm.maxRegion = $stateParams.maxRegion;
    var _db=db('pack'+ assessmentID);
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
              style="dy";
              break;
            default:
              break;
          }
          return style;
        }
        function _init(region){
          if (region.RegionType==8||region.RegionType==16){
              region.style= ConvertClass(region.Status);
              setNum(region.Status,region);
          }
          if (region.Children.length){
            region.Children.forEach(function(r){
              _init(r);
            });
          }
        }
        _init(region);
      }

      vm.isRegionShow=function(region){
        if (region.Children&&region.Children.length){
          var f= region.Children.find(function(o){
            return o.Status==vm.filterNum
          });
          if (f){
            return true;
          }
        }
        return  (vm.filterNum==-1||region.Status==vm.filterNum);
      }

      _db.get("GetRegionTreeInfo").then(function(r){
          vm.loading = true;
          var project= r.data,area;
          if (angular.isArray(project.Children)){
              if (project.Children.length>1){
                  area=project.Children.find(function(k){
                      return k.selected;
                  });
              }else {
                area=project.Children[0];
              }
              initRegion(area);
              vm.houses =  [area];
          }
      }).catch(function(r){

      });
    }

    load();

    vm.selected = function(r){
      $state.go('app.xhsc.scsl._sc',{
        regionId: r.RegionID,
        RegionName: r.RegionName,
        name: r.FullRegionName,
        regionType: r.RegionType,
        db:assessmentID,
        measureItemID:acceptanceItemID,
        pname:acceptanceItemName
      });
    }
    //总包点击事件

    vm.zk = function(item){
      item.show = !item.show;
    }
    vm.filterNum = -1;
    vm.filter = function(num){
      vm.filterNum = num;
      //load();
    }
  }
})();
