/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('inspectionCheck',{
      templateUrl:'app/main/inspection/component/inspection-check.html',
      controller:inspectionCheckController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function inspectionCheckController($scope,$rootScope,utils,$state,$stateParams,$mdPanel,api,auth,$timeout,$q,ys_file){

    var vm = this;
    vm.userId=$stateParams.userId
    vm.markers = [];
    vm.loaded=false; //数据是否加载完成
    // $scope.record={
    //   "id":0,
    //   "room_id": 203,
    //   "issues": 0,
    //   "contact_name": "string",
    //   "contact_phone": "string",
    //   "caller_name": "string",
    //   "caller_phone": "string",
    //   "reservation_date_begin": "2017-01-19T15:13:43.445Z",
    //   "reservation_date_end": "2017-01-19T15:13:43.445Z",
    //   "description": "string",
    //   "pictures": "string"
    // };


    //获取任务详情数据

    vm.load=function() {
      return api.inspection.estate.getDelivery($stateParams.delivery_id).then(function (r) {
        if (r&&r.data){
          vm.delivery=r.data;
          if (vm.delivery.room&&vm.delivery.room.layout){
            var url= ys_file.getUrl(vm.delivery.room.room_id,vm.delivery.room.layout.drawing_url);
            vm.mapUrl=url;
          }
          vm.loaded=true;
        }
      }).catch(function () {
        vm.loaded=false;
      });
    }
    vm.load();

    vm.markerDom=function() {
      return $("<div style='background: green;height: 32px;width: 32px'>"+vm.markers.length+"</div>")[0];
    }

    vm.added = function (marker) {
      vm.pop=true;
    }

    vm.edited=function (marker) {
      vm.pop=true;
    }

    vm.cancelEdit=function () {
      vm.pop=false;
    }

    vm.removed = function (marker) {
      var group = regionLayer,
        mk = null;
      layer.eachLayer(function (layer) {
        if (layer.id === marker.id) {
          mk = layer;
        }
      });
      if (mk) {
        group.removeLayer(mk);
      }
    }
    //拦截头部按钮事件
    utils.onCmd($scope,['cjwt','csb','prev'],function(cmd,e){
      switch (cmd){
        case 'csb':
              $state.go('app.meterreading.page',{delivery_id:$stateParams.delivery_id})
              break;
        case 'cjwt':
          $state.go('app.inspection.cjwt',{delivery_id:$stateParams.delivery_id});
              break;
      }
    })
  }
})();
