/**
 * Created by lss on 2016/7/25.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sclistController',sclistController);

  /**@ngInject*/
  function sclistController($scope,scRemote,$stateParams,db,$state){
    var vm=this;
    var remote=  scRemote;
    vm.projectId = $stateParams.projectId;
    vm.assessmentID=$stateParams.assessmentID;
    vm.role=$stateParams.role;
    //离线待实现
    var _db=db('pack'+ vm.assessmentID);
    _db.get("GetMeasureItemInfoByAreaID").then(function(result){
      vm.procedureData = [];
      if (result.data){
        vm.procedureData=result.data;
      }
    }).catch(function(r){

    });
    function getMax(regionStr){
      var val= 0,tmp;
      var  arr=regionStr.split(',');
      if (angular.isArray(arr)){
        arr.forEach(function(o){
          tmp=parseInt(o);
          if (val<tmp){
              val=tmp;
          }
        });
      }
      return val;
    }
    vm.go=function(item){
      $state.go('app.xhsc.scsl.scRegion',{
        assessmentID:vm.assessmentID,
        role:vm.role,
        acceptanceItemID:item.AcceptanceItemID ,
        projectId: vm.projectId,
        acceptanceItemName:item.MeasureItemName,
        maxRegion: getMax(item.SplitRule)
      });
    };
  }
})();
