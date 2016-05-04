/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseController',ChooseController);

  /** @ngInject */
  function ChooseController($scope,$timeout,remote,$rootScope,xhUtils,Db){
    var vm=this;
    function toggleRightEvent(){
      //$mdSidenav('right')
      //  .toggle();
    }
    Db.area.allDocs({include_docs:true}).then(function(r){
      console.log('r',r);
    })
    Db.area.get('1234').then(function(r){
      console.log('1234',r);
    })
/*    var store = new Store('area', { remote: 'http://localhost:5984/areas',ajax:{
      withCredentials:false
    } })
    store.sync();
    store.findAll().then(function(r){
      console.log('r',r)
    })
    store.*/
/*    remote.Project.Area.query().then(function(result){
      vm.Areas = result.data;
      vm.selectedArea = vm.Areas[0];

    })*/
    $scope.$watch('vm.selectedArea',function(){
      if(vm.selectedArea) {
        xhUtils.getProcedure(vm.selectedArea.AreaID, function (result) {
          vm.xhMeasure = result;
        });
      }
    })

    vm.close = function () {
      //$mdSidenav('right').close()
      //  .then(function () {
      //    //$log.debug("close RIGHT is done");
      //  });
    };
    function areaSelectEvent(event,data){
      vm.areaId = data.AreaName;
    }
  }

})();
