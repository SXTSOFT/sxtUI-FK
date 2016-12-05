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
  function personPlanController($scope,$rootScope,moment,api,$mdDialog,$timeout){
    var vm = this;
    load();
    function load() {
      var now = moment(new Date().toISOString().substring(0,10)).toDate();
      vm.tasksList = [];
      api.plan.BuildPlan.personPlans().then(function (res) {
        vm.tdata = res.data;
        vm.tdata.forEach(function (_r) {
          _r.showNoPlan = _r.NoPlanTasks.length ? true : false;
          _r.PlaningTasks.forEach(function (r) {
            r.parentId=_r.Id;
            r.sdate = r.ActualStartTime && moment(r.ActualStartTime.substring(0, 10)).toDate() || r.ScheduledStartTime && moment(r.ScheduledStartTime.substring(0, 10)).toDate();
            r.edate = r.ActualEndTime && moment(r.ActualEndTime.substring(0, 10)).toDate() || r.ScheduledEndTime && moment(r.ScheduledEndTime.substring(0, 10)).toDate();
          })
        })
        vm.data = vm.tdata;
        vm.data && vm.data.forEach(function (_r) {
          var temp = {
            Name: _r.Name
          };
          temp.tasks = _r.PlaningTasks.filter(function (r) {
            return (r.edate && (r.sdate <= now && r.edate >= now)) || (!r.edate && r.sdate <= now);
          })
          vm.tasksList.push(temp);
        })
        vm.tasksList.forEach(function(task){
          task.tasks.forEach(function(_task){
            _task.showBtn = true;
          })
        })
      })
    }
    $scope.$watch('vm.data',function(){
      if(vm.data){
        $scope.onlyWeekendsPredicate = function(date){
          for(var j=0;j<vm.data.length;j++){
            for(var i=0;i<vm.data[j].PlaningTasks.length;i++){
              if(vm.data[j].PlaningTasks[i].edate&&vm.data[j].PlaningTasks[i].sdate <= date && vm.data[j].PlaningTasks[i].edate >= date||
              !vm.data[j].PlaningTasks[i].edate&&vm.data[j].PlaningTasks[i].sdate <= date){
                return true;
              }
            }
          }
        }
        vm.loading = true;
        //vm.myDate = new Date();
      }
    },true);
    $scope.$watch('vm.myDate',function(){
      if(!vm.myDate){
        vm.myDate = new Date();
        $timeout(function(){
          vm.myDate = new Date();
        },500)
      }
    })
    $rootScope.$on('md-calendar-change', function(event,data) {
      vm.tasksList = [];
      vm.data && vm.data.forEach(function (_r) {
        var temp ={
          Name:_r.Name
        };
         temp.tasks = _r.PlaningTasks.filter(function (r) {
           return r.edate&&(r.sdate <=data && r.edate>=data)||!r.edate&& r.sdate<=data;
        })
        vm.tasksList.push(temp)
      });
      console.log(vm.tasksList)
    })
    vm.startTask = function(t){
      var time = new Date();
      api.plan.BuildPlan.startInsert(t.parentId, t.Id,time).then(function(r){
        t.IsAbleStart = false;
        vm.data.forEach(function(tt){
          tt.PlaningTasks.forEach(function(_t){
            var f = r.data.find(function(_r){
              return _r.Id == _t.Id;
            })
            if(f){
              t.IsAbleStart = f.IsAbleStart;
              t.IsInterlude = f.IsInterlude;
              t.ManuallyClose = f.ManuallyClose;
            }
          })
          tt.NoPlanTasks.forEach(function(_t){
            var f = r.data.find(function(_r){
              return _r.Id == _t.Id;
            })
            if(f){
              t.IsAbleStart = f.IsAbleStart;
              t.IsInterlude = f.IsInterlude;
              t.ManuallyClose = f.ManuallyClose;
            }
          })
        })
      })
    }
    vm.start = function(t){
      var time = new Date();
      api.plan.Task.start(t.Id,true,time).then(function(r){
        vm.data.forEach(function(tt){
          tt.PlaningTasks.forEach(function(_t){
            var f = r.data.find(function(_r){
              return _r.Id == _t.Id;
            })
            if(f){
              t.State = f.State;
            }
          })
          tt.NoPlanTasks.forEach(function(_t){
            var f = r.data.find(function(_r){
              return _r.Id == _t.Id;
            })
            if(f){
              t.State = f.State;
            }
          })
        })

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
        t.IsInterlude = false;
        api.plan.Task.end(t.Id,true,time,res).then(function(r){
          vm.loading = false;
          load();
          //vm.data.forEach(function(tt){
          //  tt.PlaningTasks.forEach(function(_t){
          //    var f = r.data.find(function(_r){
          //      return _r.Id == _t.Id;
          //    })
          //    if(f){
          //      t.State = f.State;
          //    }
          //  })
          //  tt.NoPlanTasks.forEach(function(_t){
          //    var f = r.data.find(function(_r){
          //      return _r.Id == _t.Id;
          //    })
          //    if(f){
          //      t.State = f.State;
          //    }
          //  })
          //})
        })
      })

    }
  }
})(angular,undefined);
