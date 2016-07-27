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
    console.log('role',vm.role)
    remote.Procedure.queryProcedure().then(function(result){
      // console.log(result);
      //vm.procedureData = result.data;
      vm.procedureData = [];
      vm.list=[];
      result.data.forEach(function(it){
        //vm.procedureData.push({name:it.SpecialtyName,rows:[]})
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
              //console.log('plist', plist)
            })
            //vm.procedureData.rows.push(plist);
           // vm.list.push(plist);

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
        $state.go('app.xhsc.gx.gxhousechoose',{role:vm.role,acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,areaId:vm.areaId,maxRegion:i.maxRegion})
      }
    }
  }
})();
