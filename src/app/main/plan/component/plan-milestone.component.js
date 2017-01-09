/**
 * Created by emma on 2016/11/8.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planMilestone',{
      templateUrl:'app/main/plan/component/plan-milestone.html',
      controller:planMilestoneController,
      controllerAs:'vm'
    })

  /**@ngInject*/
  function planMilestoneController($stateParams,api,$rootScope,$mdDialog,utils){
    var vm = this;
    vm.current = null;
    vm.tempid= $stateParams.id;
    vm.load = load;
    load();
    function load(){
      api.plan.BuildPlan.getMileStone(vm.tempid).then(function(r){
        r.data.forEach(function(_r){
          _r.setTime = new Date(_r.MilestoneTime);
        })
        vm.data = r.data;
      });
    }

    api.plan.BuildPlan.mainProcess(vm.tempid).then(function(r){
      vm.mainProcess = r.data;
    });
    vm.select = function(item){
     // console.log('sel',item)
      if(!item.edit) return;
      vm.current = item;
    }
    vm.edit = function(item){
      vm.data.forEach(function(r){
        r.edit = false;
      })
      item.edit = true;
    }
    //vm.edit = function(item){
    //  //item.edit = true;
    //  $mdDialog.show({
    //    templateUrl:'app/main/plan/component/plan-milestone-settime.html',
    //    controller:['$scope',function($scope){
    //      $scope.item = item;
    //      console.log(item)
    //      $scope.cancel = function(){
    //        $mdDialog.cancel()
    //      }
    //      $scope.answer = function(){
    //        $mdDialog.hide($scope.item)
    //      }
    //    }]
    //  }).then(function(res){
    //    console.log('res',res)
    //  })
    //}
    vm.enter=false;
    if($rootScope.$$listeners["md-calendar-change"]){
      $rootScope.$$listeners["md-calendar-change"] = [];
     }
    $rootScope.$on('md-calendar-change', function(event,data) {
      //if(vm.enter) return;
      //vm.enter = true;
      if(!data) return;
      api.plan.BuildPlan.setMileStoneTime($stateParams.id,vm.current.Id,vm.current.setTime).then(function(r){
        //
        if(r.data.State == 1){
          utils.alert('没有未完成任务')
        }else if(r.data.State == 2){
          utils.alert('没有有效工期')
        }else if(r.data.State == 3){
          utils.alert('压缩工期大于当前总工期')
        }else if(r.data.State == 0){
          var data = {
            "Id": vm.current.Id,
            "Name": vm.current.Name,
            "MilestoneTime": vm.current.setTime
          }
          if(r.data.SurplusRatio == 100){
            api.plan.BuildPlan.updateMileStone($stateParams.id,vm.current.Id,data).then(function(r){
              utils.alert('更改成功').then(function(){
                load();
              });
            })
          }else if(r.data.SurplusRatio >=80 && r.data.SurplusRatio <100){
            var msg1 = '现今至'+vm.current.Name+'剩余工作量仅为标准工期的'+r.data.SurplusRatio+'%，可能会影响质量与进度';
            utils.confirm(msg1,null).then(function(rs){
              console.log('ok')
              api.plan.BuildPlan.updateMileStone($stateParams.id,vm.current.Id,data).then(function(r){

                utils.alert('更改成功').then(function(){
                  load();
                });
              })
            },function(){
              console.log('cancel')
              vm.current.setTime = new Date(vm.current.MilestoneTime);
            })
          }else{
            var msg = '现今至'+vm.current.Name+'剩余工作量仅为标准工期的'+r.data.SurplusRatio+'%，会严重影响质量与进度'
            utils.confirm(msg,null).then(function(rs){
              console.log('ok')
              api.plan.BuildPlan.updateMileStone($stateParams.id,vm.current.Id,data).then(function(r){
                utils.alert('更改成功').then(function(){
                  load();
                });
              })
            },function(){
              vm.current.setTime = new Date(vm.current.MilestoneTime);
              console.log('cancel')
            })
          }
        }
      })
      //console.log(event,data,vm.current)
    })
  }
})(angular,undefined);
