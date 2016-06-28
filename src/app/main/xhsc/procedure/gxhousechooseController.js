/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxhousechooseController',gxhousechooseController);

  /** @ngInject */
  function gxhousechooseController($scope,$stateParams,db,$rootScope,xhUtils,remote,$timeout,$q,$state){
    var vm=this,
      id = $stateParams.assessmentID,
      AssessmentTypeID = $stateParams.AssessmentTypeID,
      projectId = $stateParams.projectId,
      acceptanceItemID=$stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName,
      role=$stateParams.role,
      areaId = $stateParams.areaId;

    $rootScope.title = $stateParams.acceptanceItemName;
    if(role == "zb"){
      $rootScope.sendBt = true;
    }
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
      function  setNum(status){
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
            vm.nums.yzg++;
            break;
          case  16:
            vm.nums.wzg++;
            break;
        }

      }
      //状态设置与用户区域权限
      function filterOrSetting(status,region){
        if (region.RegionType>4){
          statusSetting(status,region);
        }
        var st=status.find(function(o){
          return o.AreaId==region.RegionID;
        });
        if (st){
          region.hasShowRight=true;
        }
      }
      //状态设置
      function statusSetting(status,region){
        if(!angular.isArray(status)){
          status=[status];
        }
        var  st=status.find(function(o){
          return o.AcceptanceItemID==acceptanceItemID&& o.AreaId==region.RegionID;
        });
        if (st){
          region.status=st.Status;
          region.Percentage=st.Percentage;
        }else {
          region.status=0;
          region.Percentage=0;
        }
        region.style=ConvertClass(region.status);
        setNum(region.status);
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
            style="wy";
            break;
          case 16:
            style="yet";
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
          filterOrSetting(status,d)
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

    vm.callBack=function(){
      load();
    };
    vm.selected = function(r){
      switch (role){
        case "zb":
          zbSelected(r);
          break;
        case "jl":
          jlSelected(r);
          break;
        default:
          jfSelect();
          break;
      }
    }
    //总包点击事件
    function zbSelected(r){
        switch (r.status){
          case 0:
            r.checked = !r.checked;
          break;
        }
    }
    //监理点击事件
    function jlSelected(r){
      switch (r.status){
        case 1:
          $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:acceptanceItemID,acceptanceItemName:acceptanceItemName,name:r.projectTree,
            regionId:r.RegionID,projectId:projectId,areaId:areaId});
          break;
      }
    }
    //甲方点击事件
    function  jfSelect(){

    }

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
          show=[0,2,8,16];
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

    function sendResult(){
      vm.data = {
        projectId:projectId,
        Rows:[],
        acceptanceItemName:acceptanceItemName,
        acceptanceItemID:acceptanceItemID
      }
      vm.houses.forEach(function(t){
        t.Children.forEach(function(_t){
          if(_t.checked){
            vm.data.Rows.push(_t);
          }
          _t.Children.forEach(function(_tt){
            if(_tt.checked){
              vm.data.Rows.push(_tt);
            }
            _tt.Children.forEach(function(l){
              if(l.checked){
                vm.data.Rows.push(l)
              }
            })
          })
        })
      })
      if(vm.data.Rows.length){
        vm.showmyDialog = true;
      }
    }
    $rootScope.$on('sendGxResult',sendResult);
  }
})();
