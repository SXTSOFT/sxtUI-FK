/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('ChooseController',ChooseController);

  /** @ngInject */
  function ChooseController($scope, $timeout, $mdSidenav,$rootScope){
    var vm=this;
    function toggleRightEvent(){
      console.log('a')
      //$mdSidenav('right')
      //  .toggle();
      vm.procedure = [{
        name:'工序一',
        id:1
      },{
        name:'工序二',
        id:2
      }]
    }


    vm.close = function () {

      //$mdSidenav('right').close()
      //  .then(function () {
      //    //$log.debug("close RIGHT is done");
      //  });
    };

    $rootScope.$on('toggleRightEvent',toggleRightEvent)
  }

})();
