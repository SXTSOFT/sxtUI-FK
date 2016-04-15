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
      vm.current = id;
      //vm.floors = null;
      //vm.Region.forEach(function (item) {
      //  item.showArr = false;
      //  if (id.RegionName == item.RegionName) {
      //    vm.floors = item.Children;
      //    id.showArr = true;
      //  }
      //})
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

     vm.Region = data.Children;/*
      vm.Region.forEach(function(t){
        t.selected = false;
        t.status = -1;
        t.showArr = false;
        if(t.Children) {
          t.children = t.Children;
          t.children.forEach(function (_t) {
            _t.selected = false;
            _t.status = -1;
            if (_t.Children) {
              _t.children = _t.Children;
              _t.children.forEach(function (_tt) {
                _tt.selected = false;
                _tt.status = -1;
              })
            }
          })
        }
      })*/
      remote.MeasureCheckBatch.getStatus($stateParams.id,$stateParams.areaId,1).then(function(result){
       // console.log('r',result)
        data.each(function(item){

          var find = result.data.find(function(r){return r.RegionID==item.RegionID;});
          if(find){
            item.status = find.Status;
          }
          else{
            item.status = -1;
          }
        })
      })
      //var tempData = angular.copy(vm.Region);
      /*vm.Region.forEach(function(it){
        console.log('region',it)
        if(it.status == 1){
          var idx=vm.Region.indexOf(it);
          console.log('idx',idx)
          return;
        }
        it.children.forEach(function(t){
          if(t.status == -1){

          }
          if(t.children){
            t.children.forEach(function(r){
              if(r.status == -1){

              }
            })
          }

        })
      })*/

      if(vm.Region.length) {
        vm.open(vm.Region[0]);
      }
    })

    vm.goMeasure = function(){
      console.log('none')
    }

  }

})();
