/**
 * Created by lss on 2016/9/2.
 */
/**
 * Created by lss on 2016/8/16.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ysReportController',ysReport);

  /** @ngInject */
  function ysReport(remote,$state,$q,utils,api,$stateParams){
    var vm=this;
    var acceptanceItemID= $stateParams.acceptanceItemID;
    var pro=[
      remote.Procedure.authorityByUserId(),
      remote.Project.getMap()
    ]
    api.setNetwork(0).then(function(){
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
      //验收报告
      remote.Procedure.getInspections(31).then(function(r){
        vm.Inspections=[];
        r.data.forEach(function(o){
          if (o.Sign!=8&& o.AcceptanceItemID==acceptanceItemID){
            vm.Inspections.push(o);
          }
        });
        if (vm.Inspections.length==0){
          utils.alert('查无数据!');
        }
      });
      vm.Lookintoys = function(item){
        $state.go('app.xhsc.gx.gxzgreport',{InspectionId:item.InspectionId, acceptanceItemID:item.AcceptanceItemID,acceptanceItemName:item.AcceptanceItemName,projectId:item.ProjectID});
      }
    });
  }
})();
