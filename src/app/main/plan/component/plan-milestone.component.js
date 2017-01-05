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
    vm.id= $stateParams.id;
    vm.load = load;
    load();
    function load(){
      api.plan.BuildPlan.getMileStone(vm.id).then(function(r){
        r.data.forEach(function(_r){
          _r.setTime = new Date(_r.MilestoneTime);
        })
        vm.data = r.data;
      });
    }

    api.plan.BuildPlan.mainProcess(vm.id).then(function(r){
      vm.mainProcess = r.data;
    });
    vm.select = function(item){
      console.log('sel',item)
      vm.current = item;
    }
    vm.edit = function(item){
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
    $rootScope.$on('md-calendar-change', function(event,data) {
      api.plan.BuildPlan.setMileStoneTime(vm.id,vm.current.Id,vm.current.setTime).then(function(r){
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
            api.plan.BuildPlan.updateMileStone(vm.id,vm.current.Id,data).then(function(r){
              load();
              utils.alert('更改成功');
            })
          }else if(r.data.SurplusRatio >=80 || r.data.SurplusRatio <100){
            utils.confirm('现今至'+vm.current.Name+'剩余工作量仅为标准工期的'+r.data.SurplusRatio+'%，可能会影响质量与进度').then(function(){
              api.plan.BuildPlan.updateMileStone(vm.id,vm.current.Id,data).then(function(r){
                load();
                utils.alert('更改成功');
              })
            })
          }else{
            utils.confirm('现今至'+vm.current.Name+'剩余工作量仅为标准工期的'+r.data.SurplusRatio+'%，会严重影响质量与进度').then(function(){
              api.plan.BuildPlan.updateMileStone(vm.id,vm.current.Id,data).then(function(r){
                load();
                utils.alert('更改成功');
              })
            })
          }
        }
      })
      console.log(event,data,vm.current)
    })
  }
})(angular,undefined);
