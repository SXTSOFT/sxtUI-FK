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
  function meterreadingPageController($scope,utils,$state,auth,$stateParams,api){
    var vm = this;
    vm.data= {
      water_degree: '',
      electricity_degree:'',
      check_user:'',
      check_table_at:new Date(),
      delivery_id:$stateParams.delivery_id
    }

    auth.getUser().then(function (r) {
      vm.data.check_user=r.Username;
      vm.data.check_table_at=new Date();
      api.inspection.estate.getdeliverys($stateParams.delivery_id).then(function (r) {
        vm.data.water_degree=r.data.data.water_degree;
        vm.data.electricity_degree=r.data.data.electricity_degree;
      }).catch(function () {

      })
    });

    utils.onCmd($scope,['save'],function(cmd,e){
      api.inspection.estate.updatedeliverys(vm.data).then(function (r) {
        $state.go("app.inspection.desktop",{status:'processing'})
      })

    })
  }

})();
