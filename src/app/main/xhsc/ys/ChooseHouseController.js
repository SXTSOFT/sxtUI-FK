/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseHouseController',ChooseHouseController);

  /** @ngInject */
  function ChooseHouseController($scope,remote,$rootScope){
    var vm=this;
    remote.Project.Area.queryRegion(1).then(function(result){
      vm.Region = result.data;
      vm.Region.forEach(function(t){
        t.selected = false;
        t.showArr = false;
      })
    })
    function areaSelectEvent(event,data){
      vm.areaId = data.AreaName;
      remote.Project.Area.queryRegion(1).then(function(result){
        vm.Region = result.data;

      })
      vm.floors =  null;
    }
    vm.search = function(){
      $('.search_bar input').focus();
      vm.showSearch = true;
    }
    vm.hideSearch = function(){
      vm.showSearch = false;
    }
    vm.open = function(id){
      vm.Region.forEach(function(item){
        item.showArr = false;
        if(id.RegionName == item.RegionName){
          vm.floors = item.children;
          id.showArr = true;
        }
      })

      for (var i = 0; i < vm.floors.length; i++) {
        vm.floors[i].selected = false;
        for (var j = 0; j < vm.floors[i].children.length; j++) {
          vm.floors[i].children[j].selected = false;

        }
      }
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
