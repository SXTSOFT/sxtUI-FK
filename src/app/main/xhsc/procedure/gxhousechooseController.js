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
    $rootScope.title = $stateParams.acceptanceItemName;
    $timeout(function(){
    remote.Assessment.queryAllBulidings(projectId).then(function(result){
      vm.loading = true;
      result.data.RegionRelations.forEach(function(d){
        d.projectTree =  d.RegionName;
        d.projectTitle = result.data.ProjectName + d.RegionName;
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
      vm.houses =  result.data.RegionRelations;
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
      //console.log(vm.data)
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
