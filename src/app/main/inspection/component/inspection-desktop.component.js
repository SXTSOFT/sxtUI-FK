/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionDesktop',{
      templateUrl:'app/main/inspection/component/inspection-desktop.html',
      controller:inspectionDesktopController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionDesktopController($state,utils,$scope,api){

    var vm = this;
    vm.currenttab = 0;
    vm.loading = false;
    vm.inspection = function(num){
      switch (num){
        case 0:
              vm.currenttab = 0;
              break;
        case 1:
          vm.currenttab =1;
          break;
        case 2:
          vm.currenttab = 2;
          break;
      }
    };
    // api.inspection.deliverys.getLists().then(function(r){
    //   console.log(r)
    // })

    utils.onCmd($scope,['swap'],function(cmd,e){
      if(e.arg.type){

      }else{
        $state.go('app.statistics.problem')
      }
    })

    utils.onCmd($scope,['tj'],function(cmd,e){
      $state.go('app.statistics.taskpage');
    })

    vm.check = function(){
      $state.go('app.inspection.check')
    }
  }

})();
