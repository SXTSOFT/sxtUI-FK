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
  function sclistController($scope,remote,$stateParams){
    var vm=this;
    vm.projectId = $stateParams.projectId;
    vm.areaId='';

    vm.role=$stateParams.role;
    remote.Procedure.queryProcedure().then(function(result){
      vm.procedureData = [];
      result.data.forEach(function(it){
        it.SpecialtyChildren.forEach(function(t){
          t.WPAcceptanceList.forEach(function(_t){
            var max = 0,arr=[];
            var idx = _t.ApplicableArea.indexOf(',');
            if(idx == -1){
              _t.maxRegion = _t.ApplicableArea;
            }else{
              arr = _t.ApplicableArea.split(',');
              for(var i=0;i<arr.length;i++){
                if(parseInt(arr[i])>max){
                  max = arr[i];
                }
              }
              _t.maxRegion = max;
            }
          })
        })
        vm.procedureData.push(it);
      })
    })
  }
})();
