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
      function wrap(status,region){
        if(!angular.isArray(status)){
          status=[status];
        }
        var  status=status.find(function(o){
          return o.AcceptanceItemID==acceptanceItemID&& o.AreaId==region.RegionID;
        });

        if (status){
          region.status=status.Status;
          region.Percentage=status.Percentage;
        }else {
          region.status=0;
          region.Percentage=0;
        }
        region.style=ConvertClass(region.status);
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
          d.projectTree =  d.RegionName;
          d.projectTitle = result.data[0].ProjectName + d.RegionName;
          d.Children && d.Children.forEach(function(c){
            c.projectTree = d.projectTree + c.RegionName;
            c.checked = false;
            c.Children && c.Children.forEach(function(r){
              r.projectTree = c.projectTree + r.RegionName;
              r.checked = false;
              wrap(status,r);

              r.Children && r.Children.forEach(function(_r){
                _r.projectTree = r.projectTree + _r.RegionName;
                _r.checked = false;
                wrap(status,_r);

              })
            })
          })
        })
        vm.houses =  result.data[0].RegionRelations;
        //console.log('vmh',vm.houses)
      });
    }

    load();

    vm.callBack=function(){
      load();
    };
    vm.selected = function(r){

      switch (r.status){
        case 0:
          $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:acceptanceItemID,acceptanceItemName:acceptanceItemName,name:r.projectTree,
            regionId:r.RegionID,projectId:projectId,areaId:areaId});
          if (role=="zb"){
            r.checked = !r.checked;
            //vm.selected=r;
            //vm.showmyDialog = true;
            //vm.data = {
            //  name: r.projectTree,
            //  regionId: r.RegionID,
            //  projectId:projectId,
            //  areaId:areaId,
            //  acceptanceItemName:acceptanceItemName,
            //  acceptanceItemID:acceptanceItemID
            //}
          }
          break;
        case 1:
          if (role=="jl"||role=="jf"){
            $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:acceptanceItemID,acceptanceItemName:acceptanceItemName,name:r.projectTree,
              regionId:r.RegionID,projectId:projectId,areaId:areaId});
          }
          break;
        default:
          break;
      }
    }
    vm.chroom = function(r){
      switch (r.status){
        case 0:
          $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:acceptanceItemID,acceptanceItemName:acceptanceItemName,name:r.projectTree,
            regionId:r.RegionID,projectId:projectId,areaId:areaId});
          if (role=="zb"){
            vm.selected=r;
            vm.showmyDialog = true;
            vm.data = {
              name: r.projectTree,
              regionId: r.RegionID,
              projectId:projectId,
              areaId:areaId,
              acceptanceItemName:acceptanceItemName,
              acceptanceItemID:acceptanceItemID
            }
          }
          break;
        case 1:
          if (1 || role=="jl"||role=="jf"){
            $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:acceptanceItemID,acceptanceItemName:acceptanceItemName,name:r.projectTree,
              regionId:r.RegionID,projectId:projectId,areaId:areaId});
          }
          break;
        default:
          break;
      }
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
            if (vm.regionfilterByStatus(region.Children[i],operator)){
              return true;
            }
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
      vm.showmyDialog = true;
      vm.data = {
        //name: r.projectTree,
        //regionId: r.RegionID,
        projectId:projectId,
        //areaId:areaId,
        Rows:[],
        acceptanceItemName:acceptanceItemName,
        acceptanceItemID:acceptanceItemID
      }
      console.log('vmhouse',vm.houses)
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
    }
    $rootScope.$on('sendGxResult',sendResult);
  }
})();
