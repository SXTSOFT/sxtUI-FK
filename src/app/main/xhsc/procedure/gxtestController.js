/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxtestController',gxtestController);

  /**@ngInject*/
  function gxtestController($scope,$stateParams,remote,xhUtils,$rootScope,$state,$q,utils){
    var vm = this;
    var acceptanceItemID = $stateParams.acceptanceItemID,
      acceptanceItemName =  $stateParams.acceptanceItemName,
      projectId = $stateParams.projectId,
      areaId = $stateParams.areaId;
    vm.RegionFullName =  $stateParams.name;
    vm.InspectionId=$stateParams.InspectionId;

    vm.info = {
      current:null,
      projectId:projectId,
      acceptanceItemID:acceptanceItemID,
      regionId:$stateParams.regionId
    };

    vm.btBatch;

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
        remote.Project.getInspectionList(projectId),
        remote.Project.queryAllBulidings(projectId)
      ];
      vm.btBatch=[];
      return $q.all(promises).then(function(rtv){
        var  r=rtv[0].data.find(function(o){
            return o.InspectionId==vm.InspectionId;
          });
        var regions=rtv[1].data[0].RegionRelations[0];
        if (angular.isArray(r.Children)){
            var region;
            r.Children.forEach(function(tt){
               region = xhUtils.findRegion(regions,tt.AreaID);
               vm.btBatch.push({
                 RegionID:tt.AreaID,
                 RegionType:getRegionType( tt.AreaID),
                 fullName:region.fullName
               });
            });
          }
        return vm.btBatch;
      })
    }
    initBtBatch(); //获取一个批下面的所有区域
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

    var sendResult = $rootScope.$on('sendGxResult',function(){
      $state.go('app.xhsc.gx.gxresult',{acceptanceItemName:acceptanceItemName,name:vm.RegionFullName,areaId:areaId,projectId:projectId});
    })

    $scope.$on("$destroy",function(){
      sendResult();
    });
    vm.setRegion = function(region){
      vm.info.regionId = region.RegionID;
      vm.info.regionType = region.RegionType;
      vm.RegionFullName = region.fullName;
    }
    vm.nextRegion = function(prev){
      function setNext(regions){
        var region=regions.find(function(o){
            return vm.info.regionId== o.RegionID;
        });
        var index=regions.indexOf(region);
        if (prev){
          if ((index-1)>=0){
            vm.setRegion(regions[index-1]);
            return;
          }
        }else {
          if ((index+1)<regions.length){
            vm.setRegion(regions[index+1]);
            return;
          }
        }
        utils.alert("查无数据!");
      }

      if(vm.btBatch){
        setNext(vm.btBatch);
      }else {
        initBtBatch().then(function(arr){
          setNext(arr);
        })
      }
    };
  }
})();
