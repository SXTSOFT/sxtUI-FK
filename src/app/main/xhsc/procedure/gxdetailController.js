/**
 * Created by emma on 2016/6/6.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxdetailController',gxdetailController);

  /**@ngInject*/
  function gxdetailController($scope,$stateParams,remote,$q,xhUtils){
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
        remote.Project.getInspectionList(vm.projectId),
        remote.Project.queryAllBulidings(vm.projectId)
      ];
      vm.btBatch=[];
      return $q.all(promises).then(function(rtv){
        var  r=rtv[0].data.find(function(o){
          return o.InspectionId==InspectionId;
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
      load();
    }

    function load(){
      remote.Procedure.InspectionCheckpoint.query(vm.acceptanceItemID,vm.current.RegionID).then(function (r) {
        remote.Procedure.InspectionPoint.query().then(function (r1) {
          //fg.data = r.data;
          r.data.forEach(function (c) {
            var p = r1.data.find(function (p1) {
              return p1.MeasurePointID==c.PositionID;
            });

            //if(p){
            //  p.geometry.options.customSeq = true;
            //  p.geometry.options.seq = c.ProblemSortName;
            //  p.geometry.options.v = c;
            //  fg.addData(p.geometry);
            //}
          })
        });
        console.log('p',r)
        vm.pList = [];
        r.data.forEach(function(t){
          var find = vm.pList.find(function(p){
            return p.id == t.IndexID;
          })
          if(!find){
            var f = {
              id:t.IndexID,
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
