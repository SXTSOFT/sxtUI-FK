/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxlistController',gxlistController);

  /**@ngInject*/
  function gxlistController($scope,remote,$stateParams,$state){
    var vm=this;
    vm.projectId = $stateParams.projectId;
    vm.role=$stateParams.role;

    remote.Procedure.queryProcedure().then(function(result){
      vm.procedureData = [];
      vm.list=[];
      result.data.forEach(function(it){
        var name = it.SpecialtyName;
        var plist=[];
        it.SpecialtyChildren.forEach(function(t){
          if(t.WPAcceptanceList.length) {

            t.WPAcceptanceList.forEach(function (_t) {
              var max = 0, arr = [];
              var idx = _t.ApplicableArea.indexOf(',');
              if (idx == -1) {
                _t.maxRegion = _t.ApplicableArea;
              } else {
                arr = _t.ApplicableArea.split(',');
                for (var i = 0; i < arr.length; i++) {
                  if (parseInt(arr[i]) > max) {
                    max = arr[i];
                  }
                }
                _t.maxRegion = max;
              }
              plist.push(_t);
            })
          }
        })
        vm.procedureData.push({name:name,rows:plist});
//console.log('plist', vm.procedureData)
        //vm.procedureData.push({name:it.SpecialtyName,rows:vm.wpalist});
      })
    //  ui-sref="app.xhsc.gx.zjhouseChoose({role:vm.role,acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,areaId:vm.areaId,maxRegion:i.maxRegion})"
    })
    vm.choosego = function(i){
      if(!vm.role){
        $state.go('app.xhsc.gx.zjhouseChoose',{role:vm.role,acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,areaId:vm.areaId,maxRegion:i.maxRegion})
      }else{
        if (vm.role=='regionState'){
          $state.go('app.xhsc.gx.regionStates',{acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,maxRegion:i.maxRegion});
          return;
        }
        $state.go('app.xhsc.gx.gxhousechoose',{role:vm.role,acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,areaId:vm.areaId,maxRegion:i.maxRegion})
      }
    }
  }
})();
