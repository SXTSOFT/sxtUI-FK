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
  function inspectionDesktopController($state,utils,$scope,api,$mdDialog,$window,$stateParams,$timeout,auth){

    var vm = this;
    vm.currenttab = 0;
    vm.loading = false;
    vm.selected=0;
    vm.status=!$stateParams.status?"unprocessed":$stateParams.status;
    switch (vm.status){
      case "unprocessed":
        vm.selected=0;
        break;
      case "processing":
        vm.selected=1;
        break;
      case "inspection_completed":
        vm.selected=2;
        break;
    }
    auth.getUser().then(function (r) {
      vm.loginname=r.Username
    });

    vm.parm={
      loginname:'11100000000',
      status:null,
      page_size:10,
      page_number:1
    }


    vm._if=false;
    vm.setData=function(item) {
      return  api.inspection.estate.getdeliverys(item.delivery_id).then(function (r) {
        $timeout(function () {
          if (!r.data.data.water_degree && !r.data.data.electricity_degree) {
            debugger;
            vm._if = true;
          }
        })
      })
    }

    vm.done=function (item) {
      var _if=false;
      api.inspection.estate.getdeliverys(item.delivery_id).then(function (r) {
          if(!r.data.data.water_degree&&!r.data.data.electricity_degree){
            _if= true;
          }
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
          if(item.status=='processing'||item.status=='unprocessed'){
            vm.parmData={
              status: ""
            }
            if(item.status=='processing'){
              vm.parmData.status="inspection_completed";
            }else if (item.status=='unprocessed'){
              vm.parmData.status="processing";
            }
            api.inspection.estate.updatedeliverys(vm.parmData,item.delivery_id).then(function (r) {
              if(r.status==200){
                vm.load();
                vm.selected=0;
                vm.status="inspection_completed";
                vm.data.status="inspection_completed";
                //vm.inspection(vm.selected,vm.status);
                vm.inspection(2,'inspection_completed');
              }
            })
          }
          // vm.inspection(2,'inspection_completed');
        }


      })

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

    //未开始状态 点击会修改状态为进行中
    vm.check = function(item){
      if(item.status=='processing'||item.status=='unprocessed'){
        vm.parmData={
          status: ""
        }
        if(item.status=='processing'){
          vm.parmData.status="inspection_completed";
        }else if (item.status=='unprocessed'){
          vm.parmData.status="processing";
        }
        api.inspection.estate.updatedeliverys(vm.parmData,item.delivery_id).then(function (r) {
          $state.go('app.inspection.check',{delivery_id:item.delivery_id})
        })


      }
    }

    //进行中状态中点击进去补充验房数据
    vm.repeatCheck = function(item){
      if(item.status=='processing'||item.status=='unprocessed')
        $state.go('app.inspection.check',{delivery_id:item.delivery_id})
    }


    vm.load=function() {
    return  api.inspection.estate.getdeliveryslist(vm.parm).then(function (r) {
      $timeout(function(){
        vm.data=r.data.data;
        vm.data.status=$
          vm.inspection(vm.selected,vm.status);

        vm.show=true;
        })
      })
    }
    vm.inspection = function(num,status){
      $timeout(function() {
        vm.count = 0;
        vm.data.status = status;
        vm.selected = num;
        vm.currenttab = num;
        vm.data.forEach(function (r) {
          if (r.status == status) {
            vm.count += 1;
          }
        })
      });
    };
      vm.load();

  }

})();
