/**
 * Created by emma on 2016/7/21.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxzgdetailController',gxzgdetailController);

  /**@ngInject*/
  function gxzgdetailController($scope,$stateParams,remote,$q,xhUtils,utils,$rootScope){
    var vm = this;
    vm.InspectionId = $stateParams.InspectionId;
    vm.projectId = $stateParams.projectId;
    vm.acceptanceItemID = $stateParams.acceptanceItemID;
    $rootScope.title = $stateParams.acceptanceItemName;
    vm.role = '';
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
        vm.Inspection = rtv[0].data[0];
        vm.btBatch = vm.Inspection.Children;
        vm.current = vm.btBatch[0];
        load();
        return vm.btBatch;
      })
    }
    initBtBatch(); //获取一个批下面的所有区域
    vm.qyslide = function(){
      vm.qyslideShow = !vm.qyslideShow;
    }
    vm.selectQy = function(item){
      vm.qyslideShow = false;
      vm.current = item;
      vm.setRegion(item);

    }

    vm.setRegion = function(region){
      vm.current = region;
      load();
    }
    vm.nextRegion = function(prev){
      var idx = vm.btBatch.indexOf(vm.current);
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


    function load(){
      remote.Procedure.InspectionCheckpoint.query(vm.acceptanceItemID,vm.current.AreaID,vm.InspectionId).then(function (r) {
        vm.pList = [];
        vm.templist = [];
        r.data.forEach(function(t){
          if(t.InspectionID == vm.InspectionId){
            vm.templist.push(t);
          }
        })
        vm.templist.forEach(function(_t){
          var find = vm.pList.find(function(p){
            return p.id == _t.IndexPointID;
          })
          if(!find){
            var f = {
              id:_t.IndexPointID,
              ProblemSortName:_t.ProblemSortName,
              ProblemDescription: _t.IndexPointID?_t.ProblemDescription:'合格',
              rows:[]
            };
            f.rows.push(_t)
            vm.pList.push(f)
          }else{
            find.rows.push(_t)
          }
        })
        console.log('find',vm.pList)
      });
    }
  }
})();
