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

    function  load(){
      vm.nums={
        qb:0, //全部
        wtj:0,//未提交
        dy:0,//待验收
        hg:0, //合格
        bhg:0,//不合格
        yzg:0,//已整改
        wzg:0,//未整改
        ytj:0//已检查
      }
      function  setNum(status,region){
        if(vm.maxRegion >=8){
          vm.nums.qb++;
          switch (status){
            case  0:
              vm.nums.wtj++;
              break;
            case  1:
              vm.nums.ytj++;
              break;
            case  2:
              vm.nums.hg++;
              break;
            case  4:
            case  8:
            case  16:
              vm.nums.bhg++;
              break;
          }
        }
      }
      //状态设置与用户区域权限
      var st2 =[];
      function setInspection(region){
        var percentage= 0,status=0;
        if(region.inspectionRows.length){
          region.inspectionRows && region.inspectionRows.forEach(function(t){
            percentage += t.Percentage;
            status = t.Status;
          })
        }else{
          percentage = region.percentage;
          status = 0;
        }
        if(percentage > 100){
          percentage = 100;
        }
        region.Percentage = percentage;
        region.status = status;
        region.style=ConvertClass(status);
        setNum(status,region);
      }
      //状态设置
      function statusSetting(status,region){
        if(!angular.isArray(status)){
          status=[status];
        }
        var st1 = [];
        region.inspectionRows=[];
        status.forEach(function(t){
          if(t.AcceptanceItemID==acceptanceItemID && t.AreaId == region.RegionID){
            region.inspectionRows.push(t);
          }else{
            region.status=0;
            region.Percentage=0;
          }
        })
        setInspection(region);
      }
      function ConvertClass(status){
        var style;
        switch (status){
          case 0:
            style="wait";
            break;
          case 2:
            style="pass";break;
          case 1:
            style="dy";
            break;
          case 4:
          case 8:
          case 16:
            style="ng";
            break;
          default:
            break;
        }
        return style;
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
              vm.houses =  [area];
          }
      }).catch(function(r){

      });
    }

    load();

    vm.selected = function(r){
      var test={
        regionId: "00025000010000100001",
        RegionName: "4层",
        name: "山海湾二期8栋4层",
        areaId: "0002500001",
        regionType: 8,
        db: "f1373f341c304b77bd6898f8e51ee9e3",
        measureItemID: "d7579fa6e26b4850967d105ac8ed6893",
        pname: "01砼工程",
      }
      $state.go('app.xhsc.scsl._sc',test);
    }
    //总包点击事件

    vm.zk = function(item){
      item.show = !item.show;
    }
    vm.filterNum = -1;
    vm.filter = function(num){
      vm.filterNum = num;
    }

    function compare(region,operator){
      if (region.Children){
        for (var  i=0;i<region.Children.length;i++){
          if (vm.regionfilterByStatus(region.Children[i])){
            return true;
          }
        }
        return  operator(region.status);
      }else {
        return  operator(region.status);
      }
    }

    vm.regionfilterByStatus=function(region){
      if (vm.filterNum==-1){
        return true;
      }
      return compare(region,function(status){
        return vm.statusRight(status);
      });
    }

    vm.statusRight=function(status){
      var show=[0,1,2,4,8,16];
      switch (vm.filterNum){
        case 0:
        case 1:
          show=[0,1];
          break;
        case 2:
          show=[2];
          break;
        case 4:
        case 8:
        case 16:
          show=[4,8,16];
          break;
      }
      return show.indexOf(status)>-1;
    }
  }
})();
