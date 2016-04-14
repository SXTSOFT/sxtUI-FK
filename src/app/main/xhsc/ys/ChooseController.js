/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseController',ChooseController);

  /** @ngInject */
  function ChooseController($scope,$timeout,remote,$rootScope,xhUtils){
    var vm=this;
    function toggleRightEvent(){
      //$mdSidenav('right')
      //  .toggle();
    }

    xhUtils.getProcedure(function(result){
      vm.xhMeasure = result;
    });
    vm.close = function () {
      //$mdSidenav('right').close()
      //  .then(function () {
      //    //$log.debug("close RIGHT is done");
      //  });
    };
    function areaSelectEvent(event,data){
      vm.areaId = data.AreaName;
    }
    $rootScope.$on('areaSelect',areaSelectEvent)
    $rootScope.$on('toggleRightEvent',toggleRightEvent)
  }

})();
