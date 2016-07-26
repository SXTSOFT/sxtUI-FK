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
  function chooseAreaController($scope,$stateParams,db,$state){
    var vm=this,
      id =vm.areasssessmentID= $stateParams.assessmentID;
      vm.projectId=$stateParams.projectId;
      vm.role=$stateParams.role;

    var pk = db('pack'+id);
    vm.project;
    vm.areas=[];
    pk.get('GetRegionTreeInfo').then(function(r){
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
    }).catch(function(r){

    });
    vm.go=function(item){
      var f= vm.project.data.Children.forEach(function(r){
        if ( r.RegionID==item.regionID){
          r.selected=true;
        }else {
          r.selected=false;
        }
      });
      pk.update(vm.project).then(function(){
        $state.go('app.xhsc.scsl.sclist',{
          projectId:vm.projectId,
          assessmentID:vm.areasssessmentID,
          role:vm.role
        });
      });
    }
  }
})();
