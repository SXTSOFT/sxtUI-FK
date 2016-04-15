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
    }
    vm.tabStatus = -1;
    vm.myFilter = function(num){
      vm.tabStatus = num;
      //console.log('floor',vm.floors)
    }
    vm.changeStat = function(item,items){
      if(!vm.muti){
        $state.go('app.xhsc.sc',{areaId:vm.areaId,acceptanceItemID:item.AcceptanceItemID,regionId:item.RegionID,regionType:item.RegionType,name:item.FullName})
      }
      else{
        item.selected=!item.selected;
      }

    }
    xhUtils.getRegion( vm.areaId, function(data){

     vm.Region = data.Children;
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


      if(vm.Region.length) {
        vm.open(vm.Region[0]);
      }
    })

    vm.goMeasure = function(){
      console.log('none')
    }

  }

})();
