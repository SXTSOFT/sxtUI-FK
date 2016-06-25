/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxlistController',gxlistController);

  /**@ngInject*/
  function gxlistController($scope,remote,$stateParams){
    var vm=this;
    vm.projectId = $stateParams.projectId;
    vm.role=$stateParams.role;
    remote.Procedure.queryProcedure().then(function(result){
     // console.log(result);
      //vm.procedureData = result.data;
      vm.procedureData = [];
      result.data.forEach(function(it){
        for(var i=0;i<it.SpecialtyChildren.length;i++){
          if(it.SpecialtyChildren[i].WPAcceptanceList.length){
            vm.procedureData.push(it);
            break;
          }
        }
      })
     console.log('vm',result)
    })

  }
})();
