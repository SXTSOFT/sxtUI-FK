/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('safe_civiliz_itemController',safe_civiliz_itemController);

  /**@ngInject*/
  function safe_civiliz_itemController($scope,remote,$stateParams,$state){
    var vm=this;
    vm.projectId = $stateParams.projectId;
    vm.role=$stateParams.role;
    // var secItems=remote.safe.getSecurityItem.cfgSet({
    //   _id:"secItems",
    //   idField:"SpecialtyID",
    //   offline:true,
    //   filter:function (item) {
    //     return true;
    //   },
    //   dataType:3
    // });

    remote.safe.getSecurityItem().then(function(result){
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
      $state.go('app.xhsc.sf.sfhouse',{role:vm.role,acceptanceItemID:i.AcceptanceItemID,projectId:vm.projectId,acceptanceItemName:i.AcceptanceItemName,maxRegion:area})
    }
  }
})();
