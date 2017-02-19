/**
 * Created by emma on 2016/11/15.
 */
(function () {
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionCheck', {
      templateUrl: 'app/main/inspection/component/inspection-check.html',
      controller: inspectionCheckController,
      controllerAs: 'vm'
    });

  /**@ngInject*/
  function inspectionCheckController($scope, $rootScope, utils, $state, $stateParams, $mdPanel, api, auth, $timeout, $q, ys_file, sxt) {

    var vm = this;
    vm.userId = $stateParams.userId
    vm.markers = [];
    vm.loaded = false; //数据是否加载完成
    vm.current_marker;
    //获取任务详情数据
    vm.load = function () {
      return api.inspection.estate.getDelivery_off($stateParams.delivery_id).then(function (r) {
        if (r && r.data) {
          vm.delivery = angular.isArray(r.data)&&r.data.length?r.data[0]:r.data;
          if (vm.delivery.room && vm.delivery.room.layout) {
            var url = ys_file.getUrl(vm.delivery.room.room_id, vm.delivery.room.layout.drawing_url);
            vm.mapUrl = url;
            $timeout(function () {
              $rootScope.title=vm.delivery.room.name;
            })

          }
          vm.loaded = true;
        }
      }).catch(function () {
        vm.loaded = false;
      });
    }
    vm.load();


    vm.added = function (marker, isload, callback) {
      if (!isload) {
        vm.pop = true;
        marker=vm.markers.find(function (k) {
          return k.id==marker.id;
        })
        var record = {
          id: marker.id,
          room_id: vm.delivery.room.room_id,
          issues: 0,
          contact_name: vm.userId,
          contact_phone: "",
          caller_name: vm.userId,
          caller_phone: "",
          reservation_date_begin: new Date(),
          reservation_date_end: new Date(),
          description: "",
          pictures: "",
          drawing_x: marker.latlng[0],
          drawing_y: marker.latlng[1]
        }
        api.inspection.estate.postRepair_tasks_off(record).then(function () {
          marker.tag = record;
          vm.current_marker = marker
        });
      } else {
        vm.pop = false;
      }
    }

    vm.editing = function (marker) {
      vm.pop = true;
      vm.current_marker=vm.markers.find(function (k) {
        return k.id==marker.id;
      })
    }

    vm.preClick=function () {
        return $q(function (resolve,reject) {
            if (!vm.current_marker){
              resolve();
            }else {
              var record = vm.current_marker.tag;
              if (record){
                api.inspection.estate.getRepair_tasks_off(null,vm.current_marker.tag.id).then(function (r) {
                   var task=r.data[0];
                   if (task.pictures&&task.issues){
                     resolve();
                   }else {
                     reject()
                   }
                }).catch(function () {
                  reject();
                });
              }else {
                resolve(true);
              }
            }
        })
    }

    vm.cancelEdit = function (marker) {
      return $q(function (resolve, reject) {
        vm.pop = false;
        if (marker&&vm.current_marker&&vm.current_marker.id==marker.id){
          resolve();
        }
        else if (vm.current_marker && vm.current_marker.tag) {
          api.inspection.estate.postRepair_tasks_off(vm.current_marker.tag).then(function () {
            resolve(vm.current_marker);
          }).catch(function () {
            resolve(vm.current_marker);
          });
        } else {
          resolve();
        }
      })
    }


    vm.removed = function (marker) {
      if(marker.tag){
        api.inspection.estate.deleteRepair_tasks_off(marker.tag).then(function () {
          vm.current_marker=null;
          vm.pop=false;
        }); //删除问题记录
        var pic=marker.tag.pictures?marker.tag.pictures:"";
        var picArr=pic.split(",");
        picArr.forEach(function (m) {
          api.inspection.estate.getImg(m).then(function (k) { //删除图片
            api.inspection.estate.removeImg(k.data[0]);
          });
        })
      }
    }

    vm.moved=function (marker) {
        var markerLocal=vm.markers.find(function (k) {
          return k.id==marker.id;
        })
        if (markerLocal){
          var record= markerLocal.tag;
          if (record){
            record.drawing_x=marker.latlng.lat;
            record.drawing_y=marker.latlng.lng;
            api.inspection.estate.postRepair_tasks_off(record);
          }
          markerLocal.latlng=marker.latlng;
        }
    }

    $scope.$on('$destroy', $rootScope.$on('goBack', function (s, e) {
      e.cancel = true;
      api.inspection.estate.getDelivery_off($stateParams.delivery_id).then(function (r) {
        if (r && r.data) {
          var delivery  = angular.isArray(r.data)&&r.data.length?r.data[0]:r.data;
          if (delivery&&vm.mapUrl){
            if ((delivery.water_degree!=0&&!delivery.water_degree)||
              (delivery.electricity_degree!=0&&!delivery.electricity_degree)){
              utils.confirm("您还没有完成水电表抄送,是否现在就去抄送,选择否将直接返回").then(function () {
                $state.go('app.meterreading.page', {delivery_id: $stateParams.delivery_id,userId:vm.userId})
              }).catch(function () {
                $state.go("app.inspection.desktop",{index:1})
              });
              return;
            }
          }
        }
       $state.go('app.inspection.desktop', {index: 1});
      })
    }));

    //拦截头部按钮事件
    utils.onCmd($scope, ['cjwt', 'csb', 'prev', "goBack"], function (cmd, e) {
      switch (cmd) {
        case 'csb':
          $state.go('app.meterreading.page', {delivery_id: $stateParams.delivery_id,userId:vm.userId})
          break;
        case 'cjwt':
          $state.go('app.inspection.cjwt', {delivery_id: $stateParams.delivery_id});
          break;
      }
    })
  }
})();
