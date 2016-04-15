/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseHouseController',ChooseHouseController);

  /** @ngInject */
  function ChooseHouseController($scope,xhUtils,remote,$rootScope,$stateParams,$state){
    var vm=this;
    vm.areaId = $stateParams.areaId;

    vm.search = function(){
      vm.showSearch = true;
    }
    vm.hideSearch = function(){
      vm.showSearch = false;
    }
    vm.open = function(id) {
      console.log('id',id)
      vm.floors = null;
      vm.Region.forEach(function (item) {
        item.showArr = false;
        if (id.RegionName == item.RegionName) {
          vm.floors = item.children;
          id.showArr = true;
        }
      })
    }
    vm.tabStatus = -1;
    vm.myFilter = function(num){
      vm.tabStatus = num;
      //console.log('floor',vm.floors)
    }
    vm.changeStat = function(item,items){
      if(!vm.muti){
        $state.go('app.xhsc.sc',{areaId:vm.areaId,acceptanceItemID:$stateParams.id,regionId:item.RegionID,regionType:item.RegionType,name:item.FullName})
/*        items.forEach(function(t){
          t.selected =false;
        })
        item.selected=true;*/
      }
      else{
        item.selected=!item.selected;
      }

    }
    xhUtils.getRegion( vm.areaId, function(data){
      vm.Region = data.Children;
      vm.Region.forEach(function(t){
        t.selected = false;
        t.status = Math.floor(Math.random()*3);
        t.showArr = false;
        if(t.Children) {
          t.children = t.Children;
          t.children.forEach(function (_t) {
            _t.selected = false;
            _t.status = Math.floor(Math.random() * 3);
            if (_t.Children) {
              _t.children = _t.Children;
              _t.children.forEach(function (_tt) {
                _tt.selected = false;
                _tt.status = Math.floor(Math.random() * 3)
              })
            }
          })
        }
      })
      if(vm.Region.length) {
        vm.open(vm.Region[0]);
      }
    })
    remote.MeasureCheckBatch.getStatus($stateParams.id,$stateParams.areaId,1).then(function(result){
      //console.log('result',result)

    })
  }

})();
