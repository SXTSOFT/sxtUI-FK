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
      controllerAs:'vm',
      sendBt: true,
    });

  /**@ngInject*/
  function personPlanController($scope,$rootScope,$mdToast,moment,api,$mdDialog,$timeout,utils,xhUtils,sxt){
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
          _r.NoPlanTasks.forEach(function (r) {
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
        $timeout(function(){
          vm.myDate = new Date();
        },500)
        //vm.myDate = new Date();
      }
    },true);
    //$scope.$watch('vm.myDate',function(){
    //  if(!vm.myDate){
    //    vm.myDate = new Date();
    //    $timeout(function(){
    //      vm.myDate = new Date();
    //    },800)
    //  }
    //})
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
    vm.showTaskD = function(t){
      if(t.UploadPhotoFileId){
        api.plan.fileService.get(t.UploadPhotoFileId).then(function(r){
          if(r.data.Base64){
            t.images=[{
              url:r.data.Base64,
              alt:t.EndDescription||''
            }]
            xhUtils.playPhoto(t.images)
          }else if(t.EndDescription){
            var msg = '反馈信息:'+t.EndDescription+'，无图片';
            utils.alert(msg)
          }else{
            utils.alert('无图片，无反馈信息')
            //$mdToast.show(
            //  $mdToast.simple()
            //    .textContent(task.EndDescription)
            //    .position('top')
            //    .hideDelay(3000)
            //);
          }

        },function(err){

        })
      }else{
        utils.alert('无图片，无反馈信息')
      }
        
    }
    vm.startTask = function(t){
      var time = new Date();
      api.plan.BuildPlan.startInsert(t.parentId, t.Id,time).then(function(r){
        //t.IsAbleStart = false;
        vm.loading = false;
        load();
        //vm.data.forEach(function(tt){
        //  tt.PlaningTasks.forEach(function(_t){
        //    var f = r.data.find(function(_r){
        //      return _r.Id == _t.Id;
        //    })
        //    if(f){
        //      t.IsAbleStart = f.IsAbleStart;
        //      t.IsInterlude = f.IsInterlude;
        //      t.ManuallyClose = f.ManuallyClose;
        //      t.IsRelatedObject = f.IsRelatedObject;
        //    }
        //  })
        //  tt.NoPlanTasks.forEach(function(_t){
        //    var f = r.data.find(function(_r){
        //      return _r.Id == _t.Id;
        //    })
        //    if(f){
        //      t.IsAbleStart = f.IsAbleStart;
        //      t.IsInterlude = f.IsInterlude;
        //      t.ManuallyClose = f.ManuallyClose;
        //      t.IsRelatedObject = f.IsRelatedObject;
        //    }
        //  })
        //})
      },function(err){
        utils.alert(err.data||'错误');
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
      xhUtils.photo().then(function (image) {
        if(image){
          var time = new Date();
          $mdDialog.show({
            templateUrl:'app/main/plan/component/plan-task-close.html',
            controller:['$scope',function($scope){
              $scope.img=[{ImageByte:image}];
              $scope.close = function(description){
                $scope.data ={
                  description:description,
                  PhotoFileName:sxt.uuid()+'.jpg',
                  PhotoFile:$scope.img[0].ImageByte
                }
                $mdDialog.hide($scope.data)
              }
              $scope.cancel = function(){
                $mdDialog.cancel()
              }
              var deleteFn = function(d,data){
                //console.log(data)
                $scope.img.splice(data,1);
                if(!$scope.img.length){
                  $mdDialog.cancel()
                }
                //$scope.$apply();
              }
              $rootScope.$on('delete',deleteFn);
            }],
            parent: angular.element(document.body),
            clickOutsideToClose:true,
          }
            //$mdDialog.prompt()
            //  .title('确认关闭')
            //  .textContent('关闭原因')
            //  .placeholder('输入')
            //  .ok('确定')
            //  .cancel('取消')
          ).then(function(res){
            t.IsInterlude = false;
            var data = angular.extend({
              TaskId: t.Id
            },res)
            api.plan.BuildPlan.endTask(t.parentId,data).then(function (r){
              vm.loading = false;
               load();
             })
            //api.plan.Task.end(t.Id,true,time,res.description,res.img,res.PhotoFileName).then(function(r){
            //  vm.loading = false;
            //  load();
            //  //vm.data.forEach(function(tt){
            //  //  tt.PlaningTasks.forEach(function(_t){
            //  //    var f = r.data.find(function(_r){
            //  //      return _r.Id == _t.Id;
            //  //    })
            //  //    if(f){
            //  //      t.State = f.State;
            //  //    }
            //  //  })
            //  //  tt.NoPlanTasks.forEach(function(_t){
            //  //    var f = r.data.find(function(_r){
            //  //      return _r.Id == _t.Id;
            //  //    })
            //  //    if(f){
            //  //      t.State = f.State;
            //  //    }
            //  //  })
            //  //})
            //},function(err){
            //  utils.alert(err.data||'错误');
            //})
          },function(){
            console.log('cancel')
          })
          //var img = {
          //  ProblemRecordFileID:sxt.uuid(),
          //  FileID:sxt.uuid()+".jpg",
          //  ProblemRecordID:scope.data.p.ProblemRecordID,
          //  CheckpointID:scope.data.v.CheckpointID,
          //  FileContent:image
          //};
          //remote.Procedure.InspectionProblemRecordFile.create(img);
          //scope.data.images.push(img);

        }
      });


    }
  }
})(angular,undefined);
