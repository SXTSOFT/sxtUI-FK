/**
 * Created by lss on 2016/8/16.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('reportDefault',reportDefault);

  /** @ngInject */
  function reportDefault(remote,$state,$q,utils){
    var vm=this;
    var pro=[
      remote.Procedure.authorityByUserId(),
      remote.Project.getMap()
    ]
    $q.all(pro).then(function(r){
      var res=r[0];
      var result=r[1];
      if (res&&res.data&&res.data.length){
        vm.role=res.data[0].MemberType;
      }else {
        vm.role=0;
      }
      if(result&&result.data.length){
        result.data.forEach(function (m) {
          m.AssessmentID='scsl'+ m.ProjectID+'_'+vm.role;
          m.AssessmentSubject= m.ProjectName;
        });
        vm.projects=result.data;
      }
  }).catch(function(k){
      utils.alert("数据加载出错！");
    });
    //查看整改报表
    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }
    //查看验收报告
    vm.Lookintoys = function(item){
      $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
    }
    //验收报告
    remote.Procedure.getInspections(31).then(function(r){
      vm.Inspections=[];
      r.data.forEach(function(o){
        if (o.Sign!=8){
          vm.Inspections.push(o);
        }
      });
    });
    vm.go=function(item){
      function callBack(r){
        if (r&& r.data&& r.data.Children){
          var areas=r.data.Children;
          var  routeData={
            projectId:item.ProjectID,
            assessmentID:item.AssessmentID,
            role:vm.role,
            isReport:1
          };
          if (angular.isArray(areas)&&areas.length>1){
            $state.go("app.xhsc.scsl.chooseArea",routeData)
          }else {
              $state.go("app.xhsc.scsl.sclist",angular.extend(routeData,{area:areas[0].RegionID}));
          }
        }
      }
      remote.Project.GetRegionTreeInfo(item.ProjectID).then(callBack);
    }
  }
})();
