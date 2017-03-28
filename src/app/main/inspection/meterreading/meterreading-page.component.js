/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('meterreadingPage',{
      templateUrl:'app/main/inspection/meterreading/meterreading-page.html',
      controller:meterreadingPageController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function meterreadingPageController($scope,utils,$state,auth,$stateParams,api,$rootScope){
    var vm = this;
    api.inspection.estate.getDelivery_off($stateParams.delivery_id).then(function (r) {
      if (r && r.data) {
        vm.delivery  = angular.isArray(r.data)&&r.data.length?r.data[0]:r.data;
        vm.delivery.check_table_at=new  Date();
        vm.delivery.check_user=$stateParams.userId
      }
    })

    vm.completed=function () {
      if (!vm.delivery.water_degree||!vm.delivery.electricity_degree){
        utils.alert("水表与电表的值不能为空");
        return;
      }
      api.inspection.estate.addOrUpdateDelivery(vm.delivery).then(function (r) {
        $rootScope.$emit("room_upload",$stateParams.delivery_id);
      })
    }

    var ev= $rootScope.$on("room_upload_over",function () {
      $state.go("app.inspection.desktop",{index:1});
    });

    $scope.$on('$destroy', function () {
      ev();
    })


    // vm.data= {
    //   water_degree: '',
    //   electricity_degree:'',
    //   check_user:'',
    //   check_table_at:new Date(),
    //   delivery_id:$stateParams.delivery_id
    // }
    //
    // auth.getUser().then(function (r) {
    //   vm.data.check_user=r.Username;
    //   vm.data.check_table_at=new Date();
    //   api.inspection.estate.getdeliverys($stateParams.delivery_id).then(function (r) {
    //     vm.data.water_degree=r.data.data.water_degree;
    //     vm.data.electricity_degree=r.data.data.electricity_degree;
    //   }).catch(function () {
    //
    //   })
    // });

    // utils.onCmd($scope,['save'],function(cmd,e){
    //   if (!vm.delivery.water_degree||!vm.delivery.electricity_degree){
    //
    //   }
    //   api.inspection.estate.addOrUpdateDelivery(vm.delivery).then(function (r) {
    //     $state.go("app.inspection.desktop",{index:1})
    //   })
    // })
  }

})();
