/**
 * Created by emma on 2016/7/8.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzjcheckController',gxzjcheckController);

  /**@ngInject*/
  function gxzjcheckController($state,$stateParams,remote,$rootScope,$q,$scope,utils){
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
                _tt.AcceptanceItemName = _tt.ProblemSortName +'.'+ _tt.ProblemDescription;
              })
            })
          })
        })
      });
      //console.log('vm',vm.procedureData)
    })
    vm.setRegion = function(region){
      vm.info.selected = region;
    }
    vm.nextRegion = function(prev){
      var idx = vm.btBatch.indexOf(vm.info.selected);
      if(idx != -1){
        if(prev){
          if(idx>0){
            vm.setRegion(vm.btBatch[idx-1]);
          }else{
            utils.alert('查无数据');
          }
        }else{
          if(idx<vm.btBatch.length-1){
            vm.setRegion(vm.btBatch[idx+1])
          }else{
            utils.alert('查无数据');
          }
        }
      }
    }

    vm.cancelCurrent = function ($event) {
      //$event.stopPropagation();
      //$event.preventDefault();
      vm.info.current = null;
    }
    vm.qyslide = function(){
      vm.qyslideShow = !vm.qyslideShow;
    }
    vm.selectQy = function(item){
      item.hasCheck=true;
      vm.info.selected = item;
      vm.qyslideShow = false;
      vm.setRegion(item);
    }

    var sendZjResult = $rootScope.$on('sendGxResult',function() {
      remote.Procedure.updataZjStatus(vm.InspectionId).then(function(r){
        if(!r.data.ErrorCode){
          utils.alert('保存成功',null,function(){
            $state.go("app.xhsc.gx.gxmain");
          });
        }
      })
    });

    $scope.$on("$destroy",function(){
      sendZjResult();
      sendZjResult = null;
    });

  }
})();
