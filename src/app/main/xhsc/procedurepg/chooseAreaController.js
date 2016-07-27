/**
 * Created by lss on 2016/7/26.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('chooseAreaController',chooseAreaController);

  /** @ngInject */
  function chooseAreaController($scope,$stateParams,db,$state,remote){
    var vm=this,
      id =vm.areasssessmentID= $stateParams.assessmentID;
      vm.projectId=$stateParams.projectId;
      vm.role=$stateParams.role;
      var isReport= vm.isReport=$stateParams.isReport;

    var pk = db('pack'+id);
    vm.project;
    vm.areas=[];
    function  callBack(r){
      vm.project=r;
      if (r.data){
        if (r.data.Children&&angular.isArray(r.data.Children)){
          r.data.Children.forEach(function(m){
            vm.areas.push({
              regionID: m.RegionID,
              regionName: m.RegionName
            });
          });
        }
      }
    }

    if (isReport=='0'||isReport==0){
      pk.get('GetRegionTreeInfo').then(callBack);
    }else {
      remote.Project.GetRegionTreeInfo(vm.projectId).then(callBack);
    }

    vm.go=function(item){
      $state.go('app.xhsc.scsl.sclist',{
        projectId:vm.projectId,
        assessmentID:vm.areasssessmentID,
        area:item.regionID,
        isReport:vm.isReport
      });
    }
  }
})();
