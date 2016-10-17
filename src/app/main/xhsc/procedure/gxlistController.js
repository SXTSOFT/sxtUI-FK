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
      vm.data=result.data;
      vm.data.sort(function(a,b){
         return a.SpecialtyName.localeCompare(b.SpecialtyName);
      });
      vm.show=true;
    })
    vm.showTab=function(item){
      if (!item.SpecialtyChildren||!item.SpecialtyChildren.length){
        return false;
      }
      var gx= item.SpecialtyChildren;
      for (var  i=0;i<gx.length;i++){
        if (gx[i].WPAcceptanceList&&gx[i].WPAcceptanceList.length){
          return true;
        }
      }
      return false;
    }


    vm.choosego = function(i){
      var applicableArea= i.ApplicableArea;
      var area=-1;
      if (applicableArea){
         var arr=applicableArea.split(",");
          var t;
          arr.forEach(function(k){
              t=parseInt(k);
              if (area<t){
                area=t;
              }
          })

      }
      if(!vm.role){
        $state.go('app.xhsc.gx.zjhouseChoose',{role:vm.role,acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,maxRegion:area})
      }else{
        if (vm.role=='regionState'){
          $state.go('app.xhsc.gx.regionStates',{acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,maxRegion:area});
          return;
        }
        $state.go('app.xhsc.gx.gxhousechoose',{role:vm.role,acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,maxRegion:area})
      }
    }
  }
})();
