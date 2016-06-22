/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxhousechooseController',gxhousechooseController);

  /** @ngInject */
  function gxhousechooseController($scope,$stateParams,db,$rootScope,xhUtils,remote,$timeout){
    var vm=this,
      id = $stateParams.assessmentID,
      AssessmentTypeID = $stateParams.AssessmentTypeID,
      projectId = $stateParams.projectId,
      acceptanceItemID=$stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName,
      areaId = $stateParams.areaId;
      //vm.data={
      //  acceptanceItemName:acceptanceItemName,
      //  acceptanceItemID:acceptanceItemID
      //}
    //console.log(areaId)
    $rootScope.title = $stateParams.acceptanceItemName;
    $timeout(function(){
    remote.Assessment.queryAllBulidings(projectId).then(function(result){
      //var projectName = result.data.ProjectName;
      vm.loading = true;
      vm.fitHouse = [];
      var f=result.data.RegionRelations.find(function(t){
        return t.RegionID ===areaId;
      })
      if(f){
        vm.fitHouse.push(f);
      }
      //console.log('house',vm.fitHouse)
      vm.fitHouse.forEach(function(d){
        d.projectTree =  d.RegionName;
        d.Children && d.Children.forEach(function(c){
          c.projectTree = d.projectTree + c.RegionName;
          c.Children && c.Children.forEach(function(r){
            r.projectTree = c.projectTree + r.RegionName;
            r.Children && r.Children.forEach(function(_r){
              _r.projectTree = r.projectTree + _r.RegionName;
            })
          })
        })
      })
      vm.houses = vm.fitHouse[0];
      vm.projectTitle = result.data.ProjectName + result.data.RegionRelations[0].RegionName;
     // vm.projectTitle =  result.data.RegionRelations[0].RegionName;
     // console.log(vm.houses)
    })

    },500)
    vm.chroom = function(r){
      vm.showmyDialog = true;
      vm.data = {
        name: r.projectTree,
        regionId: r.RegionID,
        projectId:projectId,
        areaId:areaId,
        acceptanceItemName:acceptanceItemName,
        acceptanceItemID:acceptanceItemID
      }
    }
    vm.zk = function(item){
      item.show = !item.show;
    }
    vm.filterNum = 0;
    vm.filter = function(num){
      vm.filterNum = num;
    }



  }

})();
