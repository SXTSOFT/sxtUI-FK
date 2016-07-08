/**
 * Created by emma on 2016/7/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzjcheckController',gxzjcheckController);

  /**@ngInject*/
  function gxzjcheckController($stateParams,remote,$rootScope,$q){
    var vm = this;
    vm.InspectionId = $stateParams.InspectionId;
    vm.acceptanceItemID = $stateParams.acceptanceItemID
    vm.acceptanceItemName = $stateParams.acceptanceItemName;
    vm.areaId = $stateParams.areaId;
    vm.projectId = $stateParams.projectId;
    console.log('state',$stateParams)
    vm.info={
      current:null
    }


    $rootScope.title = vm.acceptanceItemName;

    function initBtBatch(){

      function getRegionType(regionID){
        var  regionType;
        switch (regionID.length){
          case 5:
            regionType=1;
            break;
          case 10:
            regionType=2;
            break;
          case 15:
            regionType=4;
            break;
          case 20:
            regionType=8
            break;
          default:
            regionType=16
            break;
        }
        return regionType;
      }
      var promises=[
        remote.Project.getInspectionList(vm.InspectionId)
      ];
      vm.btBatch=[];
      return $q.all(promises).then(function(rtv){
        var  r=rtv[0].data.find(function(o){
          return o.InspectionId==vm.InspectionId;
        });
        if (angular.isArray(r.Children)){
          r.Children.forEach(function(tt){
            vm.btBatch.push(angular.extend({
              RegionID:tt.AreaID,
              RegionType:getRegionType( tt.AreaID)
            },tt));
          });
        }
       // vm.selectQy(vm.btBatch[0]);
        console.log('vm',vm.btBatch)
        vm.info.selected = vm.btBatch[0];
        return vm.btBatch;
      })
    }
    initBtBatch(); //获取一个批下面的所有区域

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
