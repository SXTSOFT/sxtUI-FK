/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxtestController',gxtestController);

  /**@ngInject*/
  function gxtestController($scope,$stateParams,remote,xhUtils,$rootScope,$state){
    var vm = this;
    var acceptanceItemID = $stateParams.acceptanceItemID,
      acceptanceItemName =  $stateParams.acceptanceItemName,
      projectId = $stateParams.projectId;
      vm.RegionFullName =  $stateParams.name;

    vm.info = {
      regionId:$stateParams.regionId
    };
    $rootScope.title = $stateParams.acceptanceItemName;
    remote.Assessment.queryProcedure().then(function(result){
      // console.log(result);
      vm.procedureData = [];
      result.data.forEach(function(it){
        it.SpecialtyChildren.forEach(function(t){
          //t.WPAcceptanceList.forEach(function(_t){
          //  return _t.AcceptanceItemID === acceptanceItemID;
          //})
          var p = t.WPAcceptanceList.find(function(a){
            return a.AcceptanceItemID === acceptanceItemID;
          })
          if(p){
            vm.procedureData.push(p);
          }
          //vm.procedureData.SpecialtyChildren = vm.procedureData;
          vm.procedureData.forEach(function(t){
            t.SpecialtyChildren = t.ProblemClassifyList;
            t.ProblemClassifyList.forEach(function(_t){
              _t.WPAcceptanceList = _t.ProblemLibraryList;
              _t.SpecialtyName = _t.ProblemClassifyName;
              _t.ProblemLibraryList.forEach(function(_tt){
                _tt.AcceptanceItemName = _tt.ProblemSortName;
              })
            })
          })
        })
      });


      console.log('vm',vm.procedureData)
    })
    function sendResult(){
      $state.go('app.xhsc.gxresult',{acceptanceItemName:acceptanceItemName,name:vm.RegionFullName});
    }
    $rootScope.$on('sendGxResult',sendResult);
    vm.setRegion = function(region){
      //console.log('region',region)
     // vm.info.imageUrl = region.DrawingID;
      vm.info.regionId = region.RegionID;
      vm.info.regionType = region.RegionType;
      vm.RegionFullName = region.fullName;
    }
    vm.nextRegion = function(prev){
      //vm.info.regionId 当前
      remote.Assessment.queryAllBulidings(projectId).then(function(result){
          var  rr=xhUtils.wrapRegion(result.data.RegionRelations[0]);
          //console.log('data',result.data)
          var region = xhUtils.findRegion([rr],vm.info.regionId);
          if (region){
            var next=prev?region.prev():region.next();
            if (!next){
              utils.alert("查无数据!");
              return;
            }
            vm.setRegion(next);
          }
      })
      //packdb.get('GetRegionTreeInfo').then(function (result) {
      //  var  rr=xhUtils.wrapRegion(result.data);
      //  var region = xhUtils.findRegion([rr],vm.info.regionId);
      //  if (region){
      //    var next=prev?region.prev():region.next();
      //    if (!next){
      //      utils.alert("查无数据!");
      //      return;
      //    }
      //    vm.setRegion(next);
      //  }
      //});
    };
  }
})();
