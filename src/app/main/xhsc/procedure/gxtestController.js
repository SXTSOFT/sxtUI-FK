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
      projectId = $stateParams.projectId,
      areaId = $stateParams.areaId;
      vm.RegionFullName =  $stateParams.name;

    vm.info = {
      current:null,
      projectId:projectId,
      acceptanceItemID:acceptanceItemID,
      regionId:$stateParams.regionId
    };
    vm.cancelCurrent = function ($event) {
      //$event.stopPropagation();
      //$event.preventDefault();
      vm.info.current = null;
    }
    $rootScope.title = $stateParams.acceptanceItemName;
    remote.Procedure.queryProcedure().then(function(result){
       console.log(result);
      vm.procedureData = [];
      result.data.forEach(function(it){
        it.SpecialtyChildren.forEach(function(t){
          var p = t.WPAcceptanceList.find(function(a){
            return a.AcceptanceItemID === acceptanceItemID;
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
    console.log('state',$stateParams)
    //function sendResult(){
    //  $state.go('app.xhsc.gx.gxresult',{acceptanceItemName:acceptanceItemName,name:vm.RegionFullName,areaId:areaId,projectId:projectId});
    //}
    //$rootScope.$on('sendGxResult',sendResult);
    var sendResult = $rootScope.$on('sendGxResult',function(){
      $state.go('app.xhsc.gx.gxresult',{acceptanceItemName:acceptanceItemName,name:vm.RegionFullName,areaId:areaId,projectId:projectId});
    })
    $scope.$on("$destroy",function(){
      sendResult();
    });
    vm.setRegion = function(region){
      //console.log('region',region)
     // vm.info.imageUrl = region.DrawingID;
      vm.info.regionId = region.RegionID;
      vm.info.regionType = region.RegionType;
      vm.RegionFullName = region.fullName;
    }
    vm.nextRegion = function(prev){
      //vm.info.regionId 当前
      remote.Project.queryAllBulidings(projectId).then(function(result){
          var  rr=xhUtils.wrapRegion(result.data[0].RegionRelations[0]);
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
