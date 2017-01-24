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
  function inspectionDesktopController($state,utils,$scope,api,$q,$mdDialog,$window,$stateParams,ys_file,$timeout,auth,inspectionServe){
    var vm = this;
    vm.data={};//数据源
    vm.selected=$stateParams.index? $stateParams.index:0;//tab 初始选项

    auth.getUser().then(function () {
    });


    auth.getUser().then(function (r) {
      vm.loginname=r.Username
      console.log(r);
      vm.upload=function () {

      }

      vm.done=function (item) {
        var _if=false;
        api.inspection.estate.getDeliverysList(item.delivery_id).then(function (r) {
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
                status: "",
                delivery_id:item.delivery_id
              }
              if(item.status=='processing'){
                vm.parmData.status="inspection_completed";
              }else if (item.status=='unprocessed'){
                vm.parmData.status="processing";
              }
              api.inspection.estate.updatedeliverys(vm.parmData).then(function (r) {
                if(r.status==200){
                  vm.load();
                  vm.status="inspection_completed";
                  vm.data.status="inspection_completed";
                  vm.inspection(2,'inspection_completed');
                }
              })
            }
          }
        })
      }


      utils.onCmd($scope,['swap'],function(cmd,e){
        if(e.arg.type){
        }else{
          $state.go('app.statistics.problem')
        }
      })

      utils.onCmd($scope,['tj'],function(cmd,e){
        $state.go('app.statistics.taskpage');
      })


      vm.fh=function (item) {
        api.inspection.estate.putDelivery(item.delivery_id,{
          status: "unprocessed"
        })
      }



      vm.goChecked=function (item) {
        $state.go('app.inspection.check',{delivery_id:item.delivery_id,userId:"11100000000"})
      }


      function taskRun(tasks,sucess,fail,progressTitle) {
        var progress={};
        progressTitle=progressTitle?progressTitle:"正在下载离线数据";
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            $scope.item = progress;
            progress.percent = 0;
            progress.total = tasks.length;
            api.task(tasks, {
              timeout:30000
            })(function (percent,current,total) {
              progress.percent = parseInt(percent)*100 + ' %';
              progress.current = current;
              progress.total = total;
            }, function () {
              $mdDialog.hide();
              $timeout(function () {
                sucess();
              })
            }, function (timeout) {
              $mdDialog.cancel();
              fail();
            })
          }],
          template: '<md-dialog aria-label='+progressTitle+ ' ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });
      }

      vm.download=function (item) {
        var task=inspectionServe.downloadDeliveryTask(item);
        task=task.concat(function () {
          return api.inspection.estate.issues_tree({
            type:'delivery',
            parent_id:'',
            enabled:true,
            page_size:10000,
            page_number:1
          });
        });
        taskRun(task,function () {
          $timeout(function () {
            api.inspection.estate.putDelivery(item.delivery_id,{
              status:"processing"
            }).then(function (r) {
              api.inspection.estate.addOrUpdateDelivery(item).then(function () {
                utils.confirm("抢单成功,是否继续?").then(function () {
                }).catch(function () {
                  vm.selected=1;
                });
                vm.load();
              }).catch(function () {
                utils.alert("系统在抢单,刷新单据状态的时候发生错误");
              });
            })

          })
        },function () {
          utils.alert("网络异常,离线数据下载失败!");
        });
      }

      //进行中状态中点击进去补充验房数据
      vm.repeatCheck = function(item){
        if(item.status=='processing')
          $state.go('app.inspection.check',{delivery_id:item.delivery_id})
      }


      vm.load=function () {
        return  api.inspection.estate.getDeliverysList({
          loginname:'11100000000',
          page_size:50,
          page_number:1
        }).then(function (r) {
          vm.isEmpty=angular.isArray(r.data)&&r.data.length?false:true;
          return r.data;
        }).then(setSource).catch(setSource_offline)
      }


      function setSource(souce) {
        vm.show=true;
        vm.data.unprocessed = [];
        vm.data.inspection_completed = [];
        vm.data.processing = [];
        souce.forEach(function (k) {
          switch (k.status) {
            case "unprocessed":
              vm.data.unprocessed.push(k)
              break;
            case "processing":
              vm.data.processing.push(k);
              break;
            case "inspection_completed":
              vm.data.inspection_completed.push(k)
              break;
          }
        });
        var task = [
          function () {
            return api.inspection.estate.issues_tree({
              type:'delivery',
              parent_id:'',
              enabled:true,
              page_size:10000,
              page_number:1
            });
          }
        ];
        return api.inspection.estate.getDeliverysOff().then(function (r) {
          var en;
          vm.data.processing.forEach(function (n) {
            if (r && r.data) {
              en=r.data.find(function (k) {
                return k.delivery_id==n.delivery_id;
              })
            }
            if (!en){
              task=task.concat(inspectionServe.downloadDeliveryTask(n))
            }
          });
          if (task.length>1){
            taskRun(task,function () {
              $timeout(function () {
                utils.alert("数据刷新完成,您可以开始验房了",null);
              })
            },function () {

            },"正在刷新验房数据,请稍后...")

          }
        });
      }
      function setSource_offline() {
        vm.show=true;
        vm.data.unprocessed = vm.data.unprocessed ? vm.data.unprocessed : [];
        vm.data.inspection_completed = vm.data.inspection_completed ? vm.data.inspection_completed : [];
        vm.data.processing = vm.data.processing ? vm.data.processing : [];
        api.inspection.estate.getDeliverysOff().then(function (r) {
          vm.data.processing = vm.data.processing.concat(r.data);
        });
      }
      vm.load();

    });
  }

})();
