/**
 * Created by emma on 2016/7/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzjcheckController',gxzjcheckController);

  /**@ngInject*/
  function gxzjcheckController($stateParams,remote,$rootScope){
    var vm = this;
    vm.InspectionId = $stateParams.InspectionId;
    vm.acceptanceItemID = $stateParams.acceptanceItemID
    vm.acceptanceItemName = $stateParams.acceptanceItemName;
    vm.areaId = $stateParams.areaId;
    vm.projectId = $stateParams.projectId;
    //console.log('state',$stateParams)
    vm.info={
      current:null
    }
    $rootScope.title = vm.acceptanceItemName;
    remote.Procedure.queryProcedure().then(function(result){
      vm.procedureData = [];
      result.data.forEach(function(it){
        it.SpecialtyChildren.forEach(function(t){
          var p = t.WPAcceptanceList.find(function(a){
            return a.AcceptanceItemID === vm.acceptanceItemID;
          })
          if(p){
            vm.procedureData.push(p);
          }
          vm.procedureData.forEach(function(t){
            t.SpecialtyChildren = t.ProblemClassifyList;
            t.ProblemClassifyList.forEach(function(_t){
              _t.WPAcceptanceList = _t.ProblemLibraryList;
              _t.SpecialtyName = _t.ProblemClassifyName;
              _t.ProblemLibraryList.forEach(function(_tt){
                _tt.AcceptanceItemName = _tt.ProblemDescription;
              })
            })
          })
        })
      });
      //console.log('vm',vm.procedureData)
    })
  }
})();
