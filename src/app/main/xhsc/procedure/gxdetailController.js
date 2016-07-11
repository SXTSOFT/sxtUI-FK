/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxdetailController',gxdetailController);

  /**@ngInject*/
  function gxdetailController($scope,$stateParams,remote,$q,xhUtils,utils){
    var vm = this,
      acceptanceItemName = $stateParams.acceptanceItemName,
      InspectionId = $stateParams.InspectionId,
      areaId = $stateParams.areaId;
      vm.projectId = $stateParams.projectId;
      vm.acceptanceItemID = $stateParams.acceptanceItemID;
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
        remote.Project.getInspectionList(InspectionId)
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
      remote.Procedure.InspectionCheckpoint.query(vm.acceptanceItemID,vm.current.AreaID).then(function (r) {
        vm.pList = [];
        r.data.forEach(function(t){
          var find = vm.pList.find(function(p){
            return p.id == t.IndexPointID;
          })
          if(!find){
            var f = {
              id:t.IndexPointID,
              ProblemDescription: t.ProblemDescription,
              rows:[]
            };
            f.rows.push(t)
            vm.pList.push(f)
          }else{
            find.rows.push(t)
          }
        })
        console.log('find',vm.pList)
      });
    }

  }
})();
