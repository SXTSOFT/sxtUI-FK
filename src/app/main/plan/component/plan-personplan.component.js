/**
 * Created by emma on 2016/11/11.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planPersonplan',{
      templateUrl:'app/main/plan/component/plan-personplan.html',
      controller:personPlanController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function personPlanController($scope,$rootScope,moment,api,$mdDialog){
    var vm = this;
    var now = new Date();
    vm.tasksList = [];
    api.plan.BuildPlan.personPlans().then(function(res){
      vm.tdata = res.data;
      vm.tdata.forEach(function(_r){
        _r.PlaningTasks.forEach(function(r){
          r.sdate =r.ScheduledStartTime&& moment(r.ScheduledStartTime).toDate();
          r.edate =r.ScheduledEndTime&& moment(r.ScheduledEndTime).toDate();
        })
      })
      vm.data = vm.tdata;
      vm.data&&vm.data.forEach(function(_r){
        var temp = _r.PlaningTasks.filter(function(r){
          return (r.sdate&&r.edate&&(r.sdate.getFullYear()<= now.getFullYear()&& r.edate.getFullYear() >= now.getFullYear())&&r.sdate.getDate()<=now.getDate()&& r.edate.getDate()>=now.getDate()&&r.sdate.getMonth()<= now.getMonth()&& r.edate.getMonth()>= now.getMonth())
        })
        vm.tasksList.push(temp)
      })
      console.log(vm.tasksList)
    })
    $scope.$watch('vm.data',function(){
      if(vm.data){
        $scope.onlyWeekendsPredicate = function(date){
          for(var j=0;j<vm.data.length;j++){
            for(var i=0;i<vm.data[j].PlaningTasks.length;i++){
              if(vm.data[j].PlaningTasks[i].edate&&vm.data[j].PlaningTasks[i].sdate&&(vm.data[j].PlaningTasks[i].sdate.getDate()<=date.getDate()&&vm.data[j].PlaningTasks[i].edate.getDate()>=date.getDate())&&(vm.data[j].PlaningTasks[i].sdate.getFullYear()<= date.getFullYear()&&vm.data[j].PlaningTasks[i].edate.getFullYear()>= date.getFullYear()  )&& (vm.data[j].PlaningTasks[i].sdate.getMonth() <= date.getMonth()&&vm.data[j].PlaningTasks[i].edate.getMonth() >= date.getMonth())){
                return true;
              }
            }
          }
        }
        vm.loading = true;
      }
    })
    //$scope.onlyWeekendsPredicate = function(date){
    //  for(var j=0;j<vm.data.length;j++){
    //    for(var i=0;i<vm.data[j].tasks.length;i++){
    //      if((vm.data[j].tasks[i].sdate.getDate()<=date.getDate()&&vm.data[j].tasks[i].edate.getDate()>=date.getDate())&&(vm.data[j].tasks[i].sdate.getFullYear() >= date.getFullYear()&&vm.data[j].tasks[i].edate.getFullYear() <= date.getFullYear()  )&& (vm.data[j].tasks[i].sdate.getMonth() >= date.getMonth()&&vm.data[j].tasks[i].edate.getMonth() <= date.getMonth())){
    //        return true;
    //      }
    //    }
    //  }
    //}
    $rootScope.$on('md-calendar-change', function(event,data) {
      vm.tasksList = [];
      vm.data && vm.data.forEach(function (_r) {
        var temp ={
          Name:_r.Name,
          tasks:[]
        };
         temp.data = _r.PlaningTasks.filter(function (r) {
          return (r.sdate && r.edate && (r.sdate.getFullYear() <= data.getFullYear() && r.edate.getFullYear() >= data.getFullYear()) && r.sdate.getDate() <= data.getDate() && r.edate.getDate() >= data.getDate() && r.sdate.getMonth()<= data.getMonth() && r.edate.getMonth() >= data.getMonth())
        })
        vm.tasksList.push(temp)
      });
      console.log(vm.tasksList)
    })
    vm.start = function(t){
      var time = new Date();
      api.plan.Task.start(t.Id,true,time).then(function(r){
        var f = r.data.find(function(_r){
          return _r.Id == t.Id;
        })
        if(f){
          t.State = f.State;
        }
      })
    }
    vm.end = function(t){
      var time = new Date();
      $mdDialog.show(
        $mdDialog.prompt()
          .title('确认关闭')
          .textContent('关闭原因')
          .placeholder('输入')
          .ok('确定')
          .cancel('取消')
      ).then(function(res){
        console.log(res)
      })
      api.plan.Task.end(t.Id,true,time).then(function(r){

      })
    }
  }
})(angular,undefined);
