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
  function inspectionDesktopController($state,utils,$scope,api,$q,$mdDialog,$window,$stateParams,ys_file,$timeout,auth){
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


      vm.upload=function () {

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
                  vm.selected=0;
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
        api.inspection.estate.updatedeliverys({
          status: "unprocessed",
          delivery_id:item.delivery_id
        })
      }


      //未开始状态 点击会修改状态为进行中
      vm.check = function(item){
        if(item.status=='processing'||item.status=='unprocessed'){
          vm.parmData={
            status: "",
            delivery_id:item.delivery_id
          }
          if(item.status=='processing'){
            vm.parmData.status="inspection_completed";
          }else if (item.status=='unprocessed'){
            vm.download(item);
            vm.parmData.status="processing";
          }
        }
      }

      vm.current;
      vm.download=function (item) {
        vm.current=item;
        $mdDialog.show({
          controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
            $scope.item = item;
            item.percent = item.current = 0;
            var tasks=[
              function (task) {
                return  api.inspection.estate.getdeliveryslist(vm.parm).then(function (k) {
                  if (angular.isArray(k.data)){
                    k.data.forEach(function (m) {
                      task.push(function () {
                        return  $q(function (resove,reject) {
                          if (m.room&&m.room.layout&&m.room.layout.drawing_url){
                            return ys_file.downUniqueFile(m.room.room_id,m.room.layout.drawing_url).then(function () {
                              resove();
                            });
                          }else {
                            resove();
                          }
                        })

                      })
                    })
                  }
                });
              },function () {
                return api.inspection.estate.issues_tree({
                  type:'delivery',
                  parent_id:'',
                  enabled:true,
                  page_size:10000,
                  page_number:1
                });
              }
            ]
            item.total = tasks.length;
            api.task(tasks, {
              event: 'download_yf',
              target: item,
              timeout:30000
            })(null, function () {
              $timeout(function () {
                utils.confirm("离线数据下载完成，是否继续验房?",null).then(function () {
                  api.inspection.estate.updatedeliverys(vm.parmData,item.delivery_id).then(function (r) {
                    $state.go('app.inspection.check',{delivery_id:item.delivery_id});
                  })
                })
              })
            }, function (timeout) {
              $mdDialog.cancel();
              utils.alert("网络异常,离线数据下载失败!");
            })
          }],
          template: '<md-dialog aria-label="正在下载离线数据"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="28"></md-progress-circular><p style="padding-left: 6px;">正在下载：{{item.ProjectName}} {{item.percent}}({{item.current}}/{{item.total}})</p></md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: false
        });
      }

      api.event('download_yf', function (s, e) {
        switch (e.event) {
          case 'progress':
            vm.current.percent = parseInt(e.percent * 100) + ' %';
            vm.current.current = e.current;
            vm.current.total = e.total;
            break;
        }
      }, $scope);





      //进行中状态中点击进去补充验房数据
      vm.repeatCheck = function(item){
        if(item.status=='processing')
          $state.go('app.inspection.check',{delivery_id:item.delivery_id})
      }

      vm.load=function() {
        return  api.inspection.estate.getdeliveryslist(vm.parm).then(function (r) {
          $timeout(function(){
            vm.data=r.data;
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



    });
  }

})();
