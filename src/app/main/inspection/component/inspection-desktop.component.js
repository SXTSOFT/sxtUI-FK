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
  function inspectionDesktopController($state,utils,$scope,api,$mdDialog,$window){

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
    vm.done=function () {
      var num=0;
      if(num==0){
        var confirm = $mdDialog.confirm()
          .title('提示')
          .htmlContent('<br/><b>请先完成水电表抄读，才可以完成验房</b>')
          .ok('抄水电表')
          .cancel('取消');
        $mdDialog.show(confirm).then(function () {
          $state.go("app.meterreading.page")
        });
      }else {

      }
    }
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
