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
    vm.area= $stateParams.projectId;
    vm.projectId = vm.area.substr(0,5);
    vm.assessmentID=$stateParams.assessmentID;
    //var isReport=vm.isReport=$stateParams.isReport;

    function  callback(result){
      vm.procedureData = [];
      if (result.data&&result.data.data){
        vm.procedureData=result.data.data;
      }
    }

    scRemote.Assessment.GetMeasureItemInfoByAreaID(vm.projectId,'pack1'+vm.assessmentID).then(callback);
    //if (isReport=='0'||isReport==0){
    //  var _db=db('pack'+ vm.assessmentID);
    //  _db.get("GetMeasureItemInfoByAreaID").then(callback);
    //}else {
    //  scRemote.Project.GetMeasureItemInfoFilter(vm.projectId).then(callback);
    //}
    //离线待实现
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
        acceptanceItemID:item.AcceptanceItemID ,
        projectId: vm.area,
        acceptanceItemName:item.MeasureItemName,
        maxRegion: getMax(item.SplitRule)
        //isReport:vm.isReport
      });
    };
  }
})();
