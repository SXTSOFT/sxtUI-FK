/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseHouseController',ChooseHouseController);

  /** @ngInject */
  function ChooseHouseController($scope,remote,$rootScope,$stateParams){
    var vm=this;
    remote.Project.Area.queryRegion(1).then(function(result){
      vm.Region = result.data;
      vm.Region.forEach(function(t){
        t.selected = false;
        t.status = Math.floor(Math.random()*3);
        t.showArr = false;
        t.children.forEach(function(_t){
          _t.selected = false;
          _t.status = Math.floor(Math.random()*3)
          _t.children.forEach(function(_tt){
            _tt.selected = false;
            _tt.status = Math.floor(Math.random()*3)
          })
        })
      })
      console.log('region',vm.Region)
    })
    remote.MeasureCheckBatch.getStatus($stateParams.id,1,1).then(function(result){
      //console.log('result',result)

    })

    function areaSelectEvent(event,data){
      vm.areaId = data.AreaName;
      remote.Project.Area.queryRegion(1).then(function(result){
        vm.Region = result.data;

      })
      vm.floors =  null;
    }
    vm.search = function(){
      vm.showSearch = true;
    }
    vm.hideSearch = function(){
      vm.showSearch = false;
    }
    vm.open = function(id){
      vm.floors = null;
      vm.Region.forEach(function(item){
        item.showArr = false;
        if(id.RegionName == item.RegionName){
          vm.floors = item.children;
          id.showArr = true;
        }
      })
    }
    vm.tabStatus = -1;
    vm.myFilter = function(num){
      vm.tabStatus = num;

    }
    vm.changeStats = function(id){
      for (var i = 0; i < vm.floors.length; i++) {
        if(vm.floors[i].RegionName == id.RegionName){
          vm.floors[i].selected = !vm.floors[i].selected;
        }
      }
    }
    vm.changeStat = function(item,items){
      if(!vm.muti){
        items.forEach(function(t){
          t.selected =false;
        })
        item.selected=true;
      }
      else{
        item.selected=!item.selected;
      }
/*      vm.floors.forEach(function(item){
        item.children.forEach(function(t){
          if(t.RegionName ==  id.RegionName){
            t.selected = !t.selected;
          }
        })
      })*/

    }
    $rootScope.$on('areaSelect',areaSelectEvent)
  }

})();
