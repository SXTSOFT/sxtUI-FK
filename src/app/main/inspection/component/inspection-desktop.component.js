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
  function inspectionDesktopController($state,utils,$scope,api,$mdDialog,$window,$stateParams){

    var vm = this;
    vm.currenttab = 0;
    vm.loading = false;
    vm.selected=0;
    vm.parm={
      loginname:'13510000103',
      status:null,
      page_size:10,
      page_number:1
    }
      api.inspection.estate.getdeliveryslist(vm.parm).then(function (r) {
        vm.data=r.data.data;
        vm.data.status= $stateParams.status==''?'unprocessed':$stateParams.status;
        if($stateParams.status!=''&&$stateParams.status!=undefined)
          vm.inspection(1,$stateParams.status);
      })
    vm.inspection = function(num,status){
      vm.data.status=status;
      vm.selected=num;
      vm.currenttab =num;
    };
    vm.done=function (room_id,delivery_id) {
      var _if=false;
      api.inspection.estate.getdeliverys(delivery_id).then(function (r) {
      if(r.data.data.water_degree.length==0&&r.data.data.electricity_degree.length==0){

        _if=true;
      }
      })
      if(_if){
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

    vm.check = function(item){
      if(item.status=='processing'||item.status=='unprocessed'){
      $state.go('app.inspection.check',{delivery_id:item.delivery_id})
        }
    }


  }

})();
