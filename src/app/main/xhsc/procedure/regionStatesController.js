/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('regionStatesController',regionStatesController);

  /** @ngInject */
  function regionStatesController($scope,$stateParams,db,$rootScope,xhUtils,remote,$timeout,$q,$state,$mdDialog,utils,api){
    var vm=this,
      projectId = $stateParams.projectId,
      acceptanceItemID=$stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName
      vm.maxRegion = $stateParams.maxRegion;
    $rootScope.title = $stateParams.acceptanceItemName;
    var role='jl';
    function  load(){
      vm.nums={
        qb:0, //全部
        wtj:0,//未提交
        dy:0,//待验收
        hg:0, //合格
        bhg:0,//不合格
        yzg:0,//已整改
        wzg:0//未整改
      }
      function  setNum(status,region){
        function  addNum(status){
          vm.nums.qb++;
          switch (status){
            case  0:
              vm.nums.wtj++;
              break;
            case  1:
              vm.nums.dy++;
              break;
            case  2:
              vm.nums.hg++;
              break;
            case  4:
              vm.nums.bhg++;
              break;
            case  8:
              vm.nums.wzg++;
              break;
            case  16:
              vm.nums.yzg++;
              break;
          }
        }
        if (vm.maxRegion==8){
          if (region.RegionType==8&&region.hasShowRight){
            addNum(status);
          }
        }else {
          if (region.RegionType>=8&&region.hasShowRight){
            addNum(status);
          }
        }
      }
      //状态设置与用户区域权限
      function filterOrSetting(status,region){
        var st=status.find(function(o){
          return o.AreaId.indexOf(region.RegionID)!=-1;
        });
        if (st){
          region.hasShowRight=true;
        }
        if (region.RegionType>4){
          statusSetting(status,region);
        }
      }
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
            region.InspectionId=t.InspectionId;
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
          case 1:
            style="dy";
            break;
          case 2:
            style="pass";
            break;
          case 4:
            style="ng";
            break;
          case 8:
            style="ng";
            break;
          case 16:
            style="yzg";
            break;
          default:
            break;
        }
        return style;
      }
      $q.all([
        remote.Project.queryAllBulidings(projectId),
        remote.Procedure.getRegionStatus(projectId)
      ]).then(function(res){
        vm.loading = true;
        var result=res[0];
        var status=res[1]&&res[1].data?res[1].data:[];
        result.data[0].RegionRelations.forEach(function(d){
          filterOrSetting(status,d);
          d.projectTree =  d.RegionName;
          d.projectTitle = result.data[0].ProjectName + d.RegionName;
          d.Children && d.Children.forEach(function(c){
            filterOrSetting(status,c)
            c.projectTree = d.projectTree + c.RegionName;
            c.checked = false;
            c.Children && c.Children.forEach(function(r){
              r.projectTree = c.projectTree + r.RegionName;
              r.checked = false;
              filterOrSetting(status,r);
              vm.floors=vm.floors?vm.floors:[];
              vm.floors.push(r);
              r.Children && r.Children.forEach(function(_r){
                _r.projectTree = r.projectTree + _r.RegionName;
                _r.checked = false;
                filterOrSetting(status,_r);
              })
            })
          })
        })
        vm.houses =  result.data[0].RegionRelations;
      });
    }

    load();

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
        return compare(region,function(status){
          return vm.statusRight(status);
        });
      }
      return compare(region,function(status){
        return status== vm.filterNum
      });
    }

    vm.statusRight=function(status){
      var show=[0,1,2,4,8,16];
      switch (role){
        case "zb":
          show=[0,1,2,8,16];
          break;
        case  "jl":
          show=[0,1,2,8,16];
          break;
        case  "jf":
          show=[0,1,2,4];
          break;
      }
      return show.indexOf(status)>-1;
    }

    //vm.go=function(item){
    //  if (item.InspectionId){
    //    $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId,
    //      acceptanceItemID:acceptanceItemID,acceptanceItemName:acceptanceItemName,projectId:projectId});
    //  }
    //}
  }
})();
