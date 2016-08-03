/**
 * Created by emma on 2016/8/1.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxalllistController',gxalllistController);

  /**@ngInject*/
  function gxalllistController(remote,$stateParams,$scope,$q,$rootScope,$state){
    var vm = this;
    var acceptanceItemID = $stateParams.acceptanceItemID,
      acceptanceItemName = $stateParams.acceptanceItemName,
      projectId = $stateParams.projectId,
      areaId = $stateParams.areaId?$stateParams.areaId:$stateParams.regionId;
    vm.inspectionId = $stateParams.InspectionId;
    $rootScope.title = $stateParams.acceptanceItemName;
    function load(){
      vm.procedureData.forEach(function(t){
        t.ProblemClassifyList.forEach(function(_t){
          _t.ProblemLibraryList.forEach(function(_tt){
            _tt.AcceptanceItemName = _tt.ProblemSortName +'.'+ _tt.ProblemDescription;
            var f = vm.allProblems && vm.allProblems.find(function(_f){
                return _f.ProblemID == _tt.ProblemID && _f.AreaID == vm.current.AreaID;
              })
            if(f){
              _tt.checked = false;
            }else{
              _tt.checked = true;
            }
            _tt.show = true;
          })
        })
      })
    }
    var promise=[
      remote.Procedure.InspectionIndexJoinApi.query(vm.inspectionId),
      remote.Procedure.queryProcedure()
    ];
    $q.all(promise).then(function(rs){
      vm.procedureData = [];
      vm.allProblems=rs[0] && rs[0].data;
      var basePdata = rs[1].data;
      //console.log('p',allProblems)
      basePdata.forEach(function(it){
        it.SpecialtyChildren.forEach(function(t){
          var p = t.WPAcceptanceList.find(function(a){
            return a.AcceptanceItemID === acceptanceItemID;
          })
          if(p){
            vm.procedureData.push(p);
          }
          load();
        })
      });

    })
    vm.current = [];
    vm.btBatch=[];
    vm.qyslide = function(){
      vm.qyslideShow = !vm.qyslideShow;
    }
    vm.selectQy = function(item){
      vm.current= item;
      //vm.RegionName = item.RegionName;
      vm.qyslideShow = false;
      //vm.setRegion(item);
      load();
      console.log(item)
    }
    remote.Project.getInspectionList(vm.inspectionId).then(function(rtv){
      var  r=rtv.data.find(function(o){
        return o.InspectionId==vm.inspectionId;
      });
      if (angular.isArray(r.Children)){
        r.Children.forEach(function(tt){
          vm.btBatch.push(angular.extend({
            RegionID:tt.AreaID,
            //RegionType:getRegionType( tt.AreaID)
          },tt));
        });
      }
       vm.current = r.Children[0];
    })
    $scope.$watch('vm.current',function(){
      remote.Procedure.InspectionCheckpoint.query(acceptanceItemID,vm.current.AreaID,vm.inspectionId).then(function (r) {
        vm.pList = [];
        vm.templist = [];
        r.data.forEach(function(t){
          if(t.InspectionID == vm.inspectionId){
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
        $scope.$watch('vm.procedureData',function(){
          vm.procedureData && vm.procedureData.forEach(function(t){
            t.ProblemClassifyList.forEach(function(_t){
              _t.ProblemLibraryList.forEach(function(_tt){
                var ff = vm.pList.find(function(r){
                  return r.id == _tt.ProblemID;
                })
                if(ff){
                  _tt.show = false;
                }
              })
            })
          })
          console.log(vm.procedureData)
        })

      });
    })
    vm.checkedOrnot = function(it){
      it.checked = !it.checked;
      //console.log(it)
      var v={
          InspectionID:vm.inspectionId,
          ProblemID:it.ProblemID,
          AreaID:vm.current.AreaID
      }
      remote.Procedure.InspectionIndexJoinApi.create(v);
    }
    var sendaResult = $rootScope.$on('sendGxResult',function(){
      $state.go('app.xhsc.gx.gxresult',{acceptanceItemName:acceptanceItemName,acceptanceItemID:acceptanceItemID,name:vm.RegionFullName,areaId:areaId,projectId:projectId,InspectionId:vm.inspectionId});
    })

    $scope.$on("$destroy",function(){
      sendaResult();
      sendaResult = null;
    });


  }
})();
