/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxhousechooseController',gxhousechooseController);

  /** @ngInject */
  function gxhousechooseController($scope,$stateParams,db,$rootScope,xhUtils,remote,$timeout,$q){
    var vm=this,
      id = $stateParams.assessmentID,
      AssessmentTypeID = $stateParams.AssessmentTypeID,
      projectId = $stateParams.projectId,
      acceptanceItemID=$stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName,
      areaId = $stateParams.areaId;
    $rootScope.title = $stateParams.acceptanceItemName;
    $q.all([
      remote.Assessment.queryAllBulidings(projectId),
      remote.Assessment.getRegionStatus(projectId)
    ]).then(function(res){
      vm.loading = true;
      var result=res[0];
      var status=res[1]&&res[1].data?res[1].data:[];
      result.data.RegionRelations.forEach(function(d){
        d.projectTree =  d.RegionName;
        d.projectTitle = result.data.ProjectName + d.RegionName;
        d.Children && d.Children.forEach(function(c){
          c.projectTree = d.projectTree + c.RegionName;
          c.Children && c.Children.forEach(function(r){
            r.projectTree = c.projectTree + r.RegionName;
            wrap(status,r);
            r.Children && r.Children.forEach(function(_r){
              _r.projectTree = r.projectTree + _r.RegionName;
              wrap(status,_r);
            })
          })
        })
      })
      vm.houses =  result.data.RegionRelations;
    });

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
        region.status=1;
        region.Percentage=0;
      }
      region.style=ConvertClass(region.status);
    }

    function ConvertClass(status){
        var style;
        switch (status){
          case 2:
            style="pass";
            break;
          case 4:
            style="ng";
            break;
          case 8:
            style="yet";
            break;
          case 16:
            style="wait";
            break;
          default:
            style="dy";
            break;
        }
      return style;
    }

    vm.chroom = function(r){
      switch (r.status){
        case 1:
          vm.showmyDialog = true;
          vm.data = {
            name: r.projectTree,
            regionId: r.RegionID,
            projectId:projectId,
            areaId:areaId,
            acceptanceItemName:acceptanceItemName,
            acceptanceItemID:acceptanceItemID
          }
          break;
        default:
          break;
      }
    }


    vm.zk = function(item){
      item.show = !item.show;
    }
    vm.filterNum = 0;
    vm.filter = function(num){
      vm.filterNum = num;
    }

    vm.regionfilterByStatus=function(region){
      return !vm.filterNum||region.status==vm.filterNum ;
    }

    vm.statusRight=function(status){
        return true;
    }
  }
})();
