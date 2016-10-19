/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('safe_civiliz_acceptController',safe_civiliz_acceptController);

  /**@ngInject*/
  function safe_civiliz_acceptController($scope,$stateParams,remote,xhUtils,$rootScope,$state,$q,utils,api){
    var vm = this;
    var acceptanceItemID = $stateParams.acceptanceItemID,
      acceptanceItemName =  $stateParams.acceptanceItemName,
      projectId = $stateParams.projectId,
      areaId = $stateParams.areaId?$stateParams.areaId:$stateParams.regionId;
    vm.InspectionId=$stateParams.InspectionId;

    vm.info = {
      current:null,
      projectId:projectId,
      acceptanceItemID:acceptanceItemID,
      regionId:areaId,
      cancelMode:function () {
        vm.cancelCurrent(null);
      }
    };

    vm.btBatch;

    api.setNetwork(1).then(function(){
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
          vm.selectQy(vm.btBatch[0]);
          return vm.btBatch;
        })
      }
      initBtBatch(); //获取一个批下面的所有区域
      vm.cancelCurrent = function ($event) {
        vm.info.current = null;
      }
      $rootScope.title = acceptanceItemName;


      vm.water="";
      vm.getWaterText=function(){
        if (vm.info.selected){
          return vm.info.selected.RegionName+'('+acceptanceItemName+')'
        }
        return "";
      }

      remote.Procedure.queryProcedure().then(function(result){
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
                  _tt.AcceptanceItemName = _tt.ProblemSortName +'.'+ _tt.ProblemDescription;
                })
              })
            })
          })
        });
        //console.log('vm',vm.procedureData)
      })
      vm.qyslide = function(){
        vm.qyslideShow = !vm.qyslideShow;
      }
      vm.selectQy = function(item){
        vm.info.selected = item;
        //vm.RegionName = item.RegionName;
        vm.qyslideShow = false;
        vm.setRegion(item);
      }

      var sendResult = $rootScope.$on('sendGxResult',function(){
        var  msg=[];
        vm.btBatch.forEach(function(r){
          if (!r.hasCheck){
            msg.push(r.RegionName);
          }
        });
        if (msg.length){
          utils.alert(msg.join(",")+'尚未验收查看!');
          return;
        };
        $state.go('app.xhsc.sf.sfproblem',{acceptanceItemName:acceptanceItemName,acceptanceItemID:acceptanceItemID,name:vm.RegionFullName,areaId:areaId,projectId:projectId,InspectionId:vm.InspectionId})
      })

      $scope.$on("$destroy",function(){
        sendResult();
        sendResult = null;
      });
      vm.setRegion = function(region){
        region.hasCheck=true;
        vm.info.selected = region;
        vm.water=vm.info.selected.RegionName+'('+acceptanceItemName+')';
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
    });
  }
})();
